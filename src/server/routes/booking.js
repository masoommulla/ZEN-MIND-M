import express from 'express';
import TherapistAuth from '../models/TherapistAuth.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendAppointmentEmail, sendTherapistAppointmentEmail } from '../utils/emailService.js';

const router = express.Router();

// @route   POST /api/booking/instant-book
// @desc    Instant booking - no slot selection, book immediately
// @access  Private
router.post('/instant-book', protect, async (req, res) => {
  try {
    const { therapistId, duration = 30 } = req.body;

    // Validation
    if (!therapistId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Therapist ID and duration are required'
      });
    }

    // Validate duration (30 or 60 minutes only)
    if (![30, 60].includes(duration)) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be 30 or 60 minutes'
      });
    }

    // Find therapist
    const therapist = await TherapistAuth.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Validate therapist has pricing configured
    if (!therapist.pricing || !therapist.pricing.perSession) {
      return res.status(400).json({
        success: false,
        message: 'Therapist pricing is not configured'
      });
    }

    // Check if therapist is currently busy
    if (therapist.currentSession && therapist.currentSession.isActive) {
      const now = new Date();
      
      // If endsAt is not set, clear the invalid session
      if (!therapist.currentSession.endsAt) {
        therapist.currentSession = {
          isActive: false,
          appointmentId: null,
          startedAt: null,
          endsAt: null
        };
        await therapist.save();
      } else {
        const sessionEndsAt = new Date(therapist.currentSession.endsAt);
        
        // Buffer already included in endsAt (set by end-session endpoint)
        if (now < sessionEndsAt) {
          return res.status(400).json({
            success: false,
            message: 'Therapist is currently busy. Please try again later.',
            availableAt: sessionEndsAt
          });
        } else {
          // Buffer expired - clear the session
          therapist.currentSession = {
            isActive: false,
            appointmentId: null,
            startedAt: null,
            endsAt: null
          };
          await therapist.save();
        }
      }
    }

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current time
    const now = new Date();
    
    // Session will start 5 minutes from now (this is when join button unlocks and timer starts)
    const sessionStart = new Date(now.getTime() + 5 * 60000);
    
    // Calculate end time based on session start + duration (not booking time)
    const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);
    
    // Format times
    const startTime = `${String(sessionStart.getHours()).padStart(2, '0')}:${String(sessionStart.getMinutes()).padStart(2, '0')}`;
    const endTime = `${String(sessionEnd.getHours()).padStart(2, '0')}:${String(sessionEnd.getMinutes()).padStart(2, '0')}`;

    // Calculate amount based on therapist's per-minute rate
    const perMinuteRate = therapist.pricing.perSession / 30;
    const amount = Math.ceil(perMinuteRate * duration);

    // Generate fake transaction ID
    const fakeTransactionId = `FAKE_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create appointment
    const appointment = await Appointment.create({
      userId: req.user.id,
      therapistId: therapist._id,
      therapistName: therapist.name,
      therapistAvatar: therapist.profilePicture,
      date: sessionStart,
      startTime,
      endTime,
      duration,
      type: 'video',
      status: 'scheduled',
      payment: {
        amount: amount,
        currency: 'INR',
        status: 'completed',
        transactionId: fakeTransactionId,
        paidAt: new Date(),
        method: 'fake_payment'
      },
      meetingLink: `https://meet.jit.si/zenmind-${Date.now()}-${Math.random().toString(36).substring(7)}`
    });

    // Update therapist's current session status
    therapist.currentSession = {
      isActive: true,
      appointmentId: appointment._id,
      startedAt: sessionStart,
      endsAt: sessionEnd
    };
    await therapist.save();

    // Send email notification to teen
    try {
      await sendAppointmentEmail(
        user.email,
        user.name,
        {
          therapistName: therapist.name,
          date: sessionStart.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          startTime,
          endTime,
          duration,
          amount: amount,
          appointmentId: appointment._id
        }
      );
      console.log('✅ Appointment confirmation email sent to teen:', user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send email to teen, but booking succeeded:', emailError);
    }

    // Send email notification to therapist
    try {
      if (therapist.email) {
        await sendTherapistAppointmentEmail(
          therapist.email,
          therapist.name,
          {
            teenName: 'Anonymous Teen',
            date: sessionStart.toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            startTime,
            endTime,
            duration,
            amount: amount,
            appointmentId: appointment._id
          }
        );
        console.log('✅ Appointment notification email sent to therapist:', therapist.email);
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send email to therapist, but booking succeeded:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Session booked successfully! You can join in 5 minutes.',
      data: {
        appointment,
        canJoinAt: sessionStart
      }
    });
  } catch (error) {
    console.error('❌ Error creating instant booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// @route   GET /api/booking/therapist-status/:therapistId
// @desc    Check if therapist is available
// @access  Public
router.get('/therapist-status/:therapistId', async (req, res) => {
  try {
    const therapist = await TherapistAuth.findById(req.params.therapistId);
    
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    const now = new Date();
    let isAvailable = true;
    let availableAt = null;

    if (therapist.currentSession && therapist.currentSession.isActive) {
      // If endsAt is not set, clear the invalid session
      if (!therapist.currentSession.endsAt) {
        therapist.currentSession = {
          isActive: false,
          appointmentId: null,
          startedAt: null,
          endsAt: null
        };
        await therapist.save();
      } else {
        const sessionEndsAt = new Date(therapist.currentSession.endsAt);
        
        // Buffer already included in endsAt (set by end-session endpoint)
        if (now < sessionEndsAt) {
          isAvailable = false;
          availableAt = sessionEndsAt;
        } else {
          // Buffer expired - clear the session
          therapist.currentSession = {
            isActive: false,
            appointmentId: null,
            startedAt: null,
            endsAt: null
          };
          await therapist.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        isAvailable,
        availableAt,
        currentSession: therapist.currentSession
      }
    });
  } catch (error) {
    console.error('❌ Error checking therapist status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking therapist status',
      error: error.message
    });
  }
});

// @route   POST /api/booking/join-session/:appointmentId
// @desc    Join video session
// @access  Private
router.post('/join-session/:appointmentId', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('therapistId')
      .populate('userId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify user is part of this appointment
    const isUser = appointment.userId._id.toString() === req.user.id;
    const isTherapist = appointment.therapistId._id.toString() === req.user.id;

    if (!isUser && !isTherapist) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to join this session'
      });
    }

    // Check if session can be joined (5 minutes before scheduled time)
    const now = new Date();
    const sessionStart = new Date(appointment.date);
    const fiveMinBefore = new Date(sessionStart.getTime() - 5 * 60000);
    const sessionEnd = new Date(sessionStart.getTime() + appointment.duration * 60000);

    if (now < fiveMinBefore) {
      const waitTime = Math.ceil((fiveMinBefore - now) / 60000);
      return res.status(400).json({
        success: false,
        message: `Session can be joined in ${waitTime} minute(s)`,
        canJoinAt: fiveMinBefore
      });
    }

    if (now > sessionEnd) {
      return res.status(400).json({
        success: false,
        message: 'This session has ended'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        meetingLink: appointment.meetingLink,
        appointment,
        participantInfo: {
          isTherapist,
          otherParticipant: isTherapist ? {
            name: 'Anonymous Teen',
            avatar: appointment.userId.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=teen'
          } : {
            name: appointment.therapistName,
            avatar: appointment.therapistAvatar
          }
        }
      }
    });
  } catch (error) {
    console.error('❌ Error joining session:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining session',
      error: error.message
    });
  }
});

// @route   POST /api/booking/end-session/:appointmentId
// @desc    End a session (auto-called or manual)
// @access  Private
router.post('/end-session/:appointmentId', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('therapistId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Update appointment status
    appointment.status = 'completed';
    await appointment.save();

    // Update therapist's current session - keep endsAt for 10-minute buffer
    const therapist = appointment.therapistId;
    if (therapist.currentSession && therapist.currentSession.appointmentId.toString() === appointment._id.toString()) {
      // Keep the session marked as "active" for 10 more minutes to prevent new bookings
      const now = new Date();
      const bufferEndTime = new Date(now.getTime() + 10 * 60000); // 10 minutes from now
      
      therapist.currentSession = {
        isActive: true, // Keep active during buffer period
        appointmentId: null,
        startedAt: null,
        endsAt: bufferEndTime // Buffer expires in 10 minutes
      };
      await therapist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (error) {
    console.error('❌ Error ending session:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending session',
      error: error.message
    });
  }
});

export default router;