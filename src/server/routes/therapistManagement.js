import express from 'express';
import TherapistAuth from '../models/TherapistAuth.js';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is therapist
const isTherapist = async (req, res, next) => {
  // Check if req.user exists and has role 'therapist'
  if (!req.user || req.user.role !== 'therapist') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Therapist only.'
    });
  }
  req.therapist = req.user;
  next();
};

// @route   GET /api/therapist/profile
// @desc    Get therapist profile
// @access  Private (Therapist only)
router.get('/profile', protect, isTherapist, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.therapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @route   PUT /api/therapist/profile
// @desc    Update therapist profile
// @access  Private (Therapist only)
router.put('/profile', protect, isTherapist, async (req, res) => {
  try {
    const {
      name,
      email,
      about,
      specializations,
      education,
      experience,
      languages,
      profilePicture
    } = req.body;

    const therapist = await TherapistAuth.findById(req.user.id);

    // If email is being changed, check if it's already in use by another therapist
    if (email && email !== therapist.email) {
      const existingTherapist = await TherapistAuth.findOne({ email, _id: { $ne: req.user.id } });
      if (existingTherapist) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another therapist'
        });
      }
      therapist.email = email;
    }

    if (name) therapist.name = name;
    if (about) therapist.about = about;
    if (specializations) therapist.specializations = specializations;
    if (education) therapist.education = education;
    if (experience !== undefined) therapist.experience = experience;
    if (languages) therapist.languages = languages;
    if (profilePicture) therapist.profilePicture = profilePicture;

    await therapist.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: therapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @route   PUT /api/therapist/pricing
// @desc    Update pricing
// @access  Private (Therapist only)
router.put('/pricing', protect, isTherapist, async (req, res) => {
  try {
    const { perSession, duration } = req.body;

    const therapist = await TherapistAuth.findById(req.user.id);

    if (perSession !== undefined) {
      if (perSession < 1) {
        return res.status(400).json({
          success: false,
          message: 'Price must be at least ₹1'
        });
      }
      therapist.pricing.perSession = perSession;
    }

    if (duration) {
      if (duration !== 30) {
        return res.status(400).json({
          success: false,
          message: 'Session duration must be 30 minutes'
        });
      }
      therapist.pricing.duration = duration;
    }

    await therapist.save();

    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully',
      data: {
        pricing: therapist.pricing
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating pricing',
      error: error.message
    });
  }
});

// @route   PUT /api/therapist/password
// @desc    Update password
// @access  Private (Therapist only)
router.put('/password', protect, isTherapist, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const therapist = await TherapistAuth.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await therapist.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    therapist.password = newPassword;
    await therapist.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
});

// @route   GET /api/therapist/slots
// @desc    Get therapist's available slots
// @access  Private (Therapist only)
router.get('/slots', protect, isTherapist, async (req, res) => {
  try {
    const therapist = await TherapistAuth.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: therapist.timeSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching slots',
      error: error.message
    });
  }
});

// @route   PUT /api/therapist/slots
// @desc    Update available slots
// @access  Private (Therapist only)
router.put('/slots', protect, isTherapist, async (req, res) => {
  try {
    const { date, slots } = req.body;

    if (!date || !slots || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: 'Date and slots array are required'
      });
    }

    const therapist = await TherapistAuth.findById(req.user.id);

    // Find existing date or create new
    let dateSlots = therapist.timeSlots.find(s => s.date === date);

    if (dateSlots) {
      // Update existing slots (keep booked slots intact)
      const updatedSlots = slots.map(newSlot => {
        const existingSlot = dateSlots.slots.find(
          s => s.startTime === newSlot.startTime && s.isBooked
        );
        if (existingSlot) {
          return existingSlot; // Keep booked slot as is
        }
        return {
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
          isBooked: false,
          appointmentId: null
        };
      });
      dateSlots.slots = updatedSlots;
    } else {
      // Add new date with slots
      therapist.timeSlots.push({
        date,
        slots: slots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: false,
          appointmentId: null
        }))
      });
    }

    await therapist.save();

    res.status(200).json({
      success: true,
      message: 'Slots updated successfully',
      data: therapist.timeSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating slots',
      error: error.message
    });
  }
});

// @route   GET /api/therapist/appointments
// @desc    Get therapist's appointments
// @access  Private (Therapist only)
router.get('/appointments', protect, isTherapist, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      therapistId: req.user.id,
      status: { $in: ['scheduled', 'confirmed'] }
    })
      .populate('userId', 'name email avatar')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
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

// @route   GET /api/therapist/stats
// @desc    Get therapist statistics
// @access  Private (Therapist only)
router.get('/stats', protect, isTherapist, async (req, res) => {
  try {
    const therapist = await TherapistAuth.findById(req.user.id);
    const appointments = await Appointment.find({ therapistId: req.user.id });

    const stats = {
      totalSessions: therapist.totalSessions,
      rating: therapist.rating,
      reviewCount: therapist.reviewCount,
      upcomingAppointments: appointments.filter(
        a => a.status === 'scheduled' || a.status === 'confirmed'
      ).length,
      completedAppointments: appointments.filter(
        a => a.status === 'completed'
      ).length
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

export default router;