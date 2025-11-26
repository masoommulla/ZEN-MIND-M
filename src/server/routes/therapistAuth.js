import express from 'express';
import jwt from 'jsonwebtoken';
import TherapistAuth from '../models/TherapistAuth.js';
import OTP from '../models/OTP.js';
import { sendOtpEmail } from '../utils/emailService.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'therapist' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/therapist-auth/login
// @desc    Therapist login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    console.log('🔐 Therapist login attempt for:', email);

    // Find therapist with password field
    const therapist = await TherapistAuth.findOne({ email }).select('+password');
    
    if (!therapist) {
      console.log('❌ No therapist found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await therapist.comparePassword(password);
    
    if (!isPasswordMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ Therapist logged in:', email);

    // Generate token
    const token = generateToken(therapist._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        therapist: {
          id: therapist._id,
          name: therapist.name,
          email: therapist.email,
          profilePicture: therapist.profilePicture,
          role: therapist.role,
          specializations: therapist.specializations
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Therapist login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// @route   POST /api/therapist-auth/verify
// @desc    Verify therapist JWT token
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'therapist') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const therapist = await TherapistAuth.findById(decoded.id).select('-password');

    if (!therapist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        therapist: {
          id: therapist._id,
          name: therapist.name,
          email: therapist.email,
          profilePicture: therapist.profilePicture,
          role: therapist.role,
          specializations: therapist.specializations
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
});

// @route   POST /api/therapist-auth/forgot-password
// @desc    Send OTP to email for password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if therapist exists
    const therapist = await TherapistAuth.findOne({ email });
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'No therapist account found with this email'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Save OTP to database (expires in 10 minutes)
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    await sendOtpEmail(therapist.email, therapist.name, otp);

    console.log(`✅ OTP sent to therapist email: ${email}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please check your inbox.'
    });
  } catch (error) {
    console.error('❌ Therapist forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
});

// @route   POST /api/therapist-auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    console.log(`✅ OTP verified for therapist: ${email}`);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('❌ Therapist OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
});

// @route   POST /api/therapist-auth/reset-password
// @desc    Reset password after OTP verification
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    // Check if there's a verified OTP for this email
    const otpRecord = await OTP.findOne({ email, verified: true });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Please verify OTP first'
      });
    }

    // Find therapist
    const therapist = await TherapistAuth.findOne({ email }).select('+password');

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Update password
    therapist.password = newPassword;
    await therapist.save();

    // Delete OTP record
    await OTP.deleteMany({ email });

    console.log(`✅ Password reset successful for therapist: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('❌ Therapist reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

export default router;