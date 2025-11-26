import express from 'express';
import Appointment from '../models/Appointment.js';
import TherapistAuth from '../models/TherapistAuth.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendCancellationEmailToUser, sendCancellationEmailToTherapist } from '../utils/emailService.js';
import { validateAppointment, validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', validateAppointment, async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      userId: req.user.id
    };

    // If payment info is provided, use it; otherwise create default
    if (req.body.paymentStatus === 'paid') {
      appointmentData.payment = {
        amount: req.body.cost || 0,
        currency: 'USD',
        status: 'completed',
        paidAt: req.body.paymentDate ? new Date(req.body.paymentDate) : new Date()
      };
    }

    const appointment = await Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating appointment',
      error: error.message
    });
  }
});

// @route   GET /api/appointments
// @desc    Get all appointments for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, upcoming } = req.query;

    const query = { userId: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = { $in: ['scheduled', 'confirmed'] };
    }

    const appointments = await Appointment.find(query)
      .populate('userId', 'name email avatar')
      .populate('therapistId', 'name profilePicture education specializations rating')
      .sort({ date: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/upcoming
// @desc    Get upcoming appointments
// @access  Private
router.get('/upcoming', async (req, res) => {
  try {
    const appointments = await Appointment.getUpcoming(req.user.id);

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/stats
// @desc    Get appointment statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Appointment.getStats(req.user.id);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment statistics',
      error: error.message
    });
  }
});

// @route   DELETE /api/appointments/clear-past
// @desc    Clear all past/completed/cancelled appointments
// @access  Private
router.delete('/clear-past', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Delete all cancelled, completed appointments or past dates
    const result = await Appointment.deleteMany({
      userId: req.user.id,
      $or: [
        { status: 'cancelled' },
        { status: 'completed' },
        { date: { $lt: today } }
      ]
    });

    res.status(200).json({
      success: true,
      message: `Successfully cleared ${result.deletedCount} past session(s)`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear past appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing past appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email avatar')
      .populate('therapistId', 'name title specialties image rating');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (appointment.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', validateMongoId, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Don't allow updating completed/cancelled appointments
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${appointment.status} appointment`
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('userId', 'name email avatar')
    .populate('therapistId', 'name title specialties image');

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating appointment',
      error: error.message
    });
  }
});

// @route   PATCH /api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private
router.patch('/:id/cancel', validateMongoId, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    appointment.status = 'cancelled';
    appointment.cancellation = {
      cancelledBy: 'user',
      reason: req.body.reason || 'No reason provided',
      cancelledAt: new Date()
    };

    // Mark payment as refunded
    if (appointment.payment) {
      appointment.payment.status = 'refunded';
    }

    await appointment.save();

    // Send cancellation emails to BOTH user and therapist
    try {
      const user = await User.findById(appointment.userId);
      const therapist = await TherapistAuth.findById(appointment.therapistId);
      
      if (user && therapist) {
        // Calculate refund amounts
        const originalAmount = appointment.payment?.amount || 0;
        const platformFee = Math.ceil(originalAmount * 0.1); // 10% fee
        const refundAmount = originalAmount - platformFee;

        // Send email to user
        await sendCancellationEmailToUser(
          user.email,
          user.name,
          {
            therapistName: appointment.therapistName || therapist.name,
            date: new Date(appointment.date).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            duration: appointment.duration,
            reason: appointment.cancellation?.reason || 'No reason provided',
            originalAmount: originalAmount,
            platformFee: platformFee,
            refundAmount: refundAmount
          }
        );

        // Send email to therapist
        await sendCancellationEmailToTherapist(
          therapist.email,
          therapist.name,
          {
            date: new Date(appointment.date).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            duration: appointment.duration,
            reason: appointment.cancellation?.reason || 'No reason provided',
            originalAmount: originalAmount,
            refundAmount: refundAmount
          }
        );

        console.log('✅ Cancellation emails sent to both user and therapist');
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send cancellation emails:', emailError);
      // Don't fail the cancellation if emails fail
    }

    // Release the slot in therapist's availability
    try {
      const therapist = await TherapistAuth.findById(appointment.therapistId);
      if (therapist) {
        await therapist.cancelSlot(
          new Date(appointment.date).toISOString().split('T')[0],
          appointment.startTime
        );
      }
    } catch (slotError) {
      console.error('⚠️ Failed to release therapist slot:', slotError);
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully. Your amount will be refunded soon! 💜',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
});

// @route   PATCH /api/appointments/:id/complete
// @desc    Mark appointment as completed
// @access  Private
router.patch('/:id/complete', validateMongoId, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    appointment.status = 'completed';
    await appointment.save();

    // Update therapist total sessions
    const therapist = await TherapistAuth.findById(appointment.therapistId);
    if (therapist) {
      therapist.totalSessions += 1;
      await therapist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing appointment',
      error: error.message
    });
  }
});

// @route   POST /api/appointments/:id/review
// @desc    Add review to completed appointment
// @access  Private
router.post('/:id/review', validateMongoId, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this appointment'
      });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed appointments'
      });
    }

    appointment.review = {
      rating,
      comment: comment || '',
      createdAt: new Date()
    };

    await appointment.save();

    // Update therapist rating
    const therapist = await TherapistAuth.findById(appointment.therapistId);
    if (therapist) {
      await therapist.updateRating();
    }

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private
router.delete('/:id', validateMongoId, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
    }

    // Only allow deletion of cancelled or old appointments
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointmentDate >= today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active appointments. Please cancel first.'
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
});

export default router;