import express from 'express';
import Appointment from '../models/Appointment.js';
import TherapistAuth from '../models/TherapistAuth.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendRefundEmail } from '../utils/emailService.js';

const router = express.Router();

// Platform fee percentage
const PLATFORM_FEE_PERCENTAGE = 10;

/**
 * POST /api/refund/cancel-appointment/:appointmentId
 * Cancel appointment and process refund with 10% platform fee
 */
router.post('/cancel-appointment/:appointmentId', protect, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify ownership
    if (appointment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own appointments'
      });
    }

    // Check if already cancelled
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    // Check if already completed
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed session'
      });
    }

    // Check cancellation time (must be at least 2 hours before session)
    const sessionDateTime = new Date(appointment.date);
    const [hours, minutes] = appointment.startTime.split(':');
    sessionDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const now = new Date();
    const timeDiff = (sessionDateTime - now) / 1000 / 60 / 60; // hours

    if (timeDiff < 2) {
      return res.status(400).json({
        success: false,
        message: 'Cancellations must be made at least 2 hours before the session'
      });
    }

    // Calculate refund amount (original amount - 10% platform fee)
    const originalAmount = appointment.payment.amount;
    const platformFee = Math.round(originalAmount * (PLATFORM_FEE_PERCENTAGE / 100));
    const refundAmount = originalAmount - platformFee;

    // Update appointment status
    appointment.status = 'cancelled';
    appointment.cancellation = {
      cancelledBy: 'user',
      reason: reason || 'No reason provided',
      cancelledAt: new Date()
    };
    appointment.payment.status = 'refunded';
    await appointment.save();

    // Release the therapist's slot
    const therapist = await TherapistAuth.findById(appointment.therapistId);
    if (therapist) {
      const dateStr = new Date(appointment.date).toISOString().split('T')[0];
      await therapist.cancelSlot(dateStr, appointment.startTime);
      console.log(`✅ Therapist slot released: ${dateStr} ${appointment.startTime}`);
    }

    // Get user details for email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send refund email
    try {
      await sendRefundEmail(
        user.email,
        user.name,
        {
          appointmentId: appointment._id,
          therapistName: appointment.therapistName,
          date: new Date(appointment.date).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          startTime: appointment.startTime,
          originalAmount,
          platformFee,
          refundAmount,
          platformFeePercentage: PLATFORM_FEE_PERCENTAGE,
          cancellationReason: reason || 'No reason provided'
        }
      );
      console.log('✅ Refund email sent to:', user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send refund email:', emailError);
      // Don't fail the refund if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled and refund processed',
      data: {
        appointmentId: appointment._id,
        status: 'cancelled',
        refund: {
          originalAmount,
          platformFee,
          platformFeePercentage: PLATFORM_FEE_PERCENTAGE,
          refundAmount,
          currency: 'INR'
        },
        cancellation: appointment.cancellation
      }
    });

    console.log(`✅ Refund processed: ₹${originalAmount} -> ₹${refundAmount} (₹${platformFee} fee)`);
  } catch (error) {
    console.error('❌ Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
});

/**
 * GET /api/refund/policy
 * Get refund policy details
 */
router.get('/policy', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      platformFeePercentage: PLATFORM_FEE_PERCENTAGE,
      minimumCancellationTime: '2 hours before session',
      refundProcessingTime: 'Instant (Fake payment system)',
      policy: [
        `${PLATFORM_FEE_PERCENTAGE}% platform fee will be deducted from all refunds`,
        'Cancellations must be made at least 2 hours before the scheduled session',
        'No refunds for no-shows or late cancellations',
        'Completed sessions cannot be refunded',
        'Refunds are processed instantly in the demo system'
      ]
    }
  });
});

export default router;