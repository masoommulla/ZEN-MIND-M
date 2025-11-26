import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      age: req.body.age,
      avatar: req.body.avatar,
      settings: req.body.settings
    };

    // Handle profile fields separately
    if (req.body.profile) {
      fieldsToUpdate.profile = {};
      if (req.body.profile.phone !== undefined) fieldsToUpdate.profile.phone = req.body.profile.phone;
      if (req.body.profile.gender !== undefined) fieldsToUpdate.profile.gender = req.body.profile.gender;
      if (req.body.profile.dateOfBirth !== undefined) fieldsToUpdate.profile.dateOfBirth = req.body.profile.dateOfBirth;
      if (req.body.profile.bio !== undefined) fieldsToUpdate.profile.bio = req.body.profile.bio;
      if (req.body.profile.pronouns !== undefined) fieldsToUpdate.profile.pronouns = req.body.profile.pronouns;
      if (req.body.profile.interests !== undefined) fieldsToUpdate.profile.interests = req.body.profile.interests;
      if (req.body.profile.supportNeeds !== undefined) fieldsToUpdate.profile.supportNeeds = req.body.profile.supportNeeds;
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // Handle email separately - check if it's being changed and if it's unique
    if (req.body.email && req.body.email !== req.user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
      fieldsToUpdate.email = req.body.email;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/me/password
// @desc    Update user password
// @access  Private
router.put('/me/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

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

// @route   PUT /api/users/me/avatar
// @desc    Update user avatar
// @access  Private
router.put('/me/avatar', async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an avatar URL'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating avatar',
      error: error.message
    });
  }
});

// @route   PUT /api/users/me/subscription
// @desc    Update user subscription
// @access  Private
router.put('/me/subscription', async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['free', 'premium', 'unlimited'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    const subscription = {
      plan,
      isActive: plan !== 'free',
      startDate: new Date()
    };

    // Set end date based on plan
    if (plan !== 'free') {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      subscription.endDate = endDate;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { subscription },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subscription',
      error: error.message
    });
  }
});

// @route   POST /api/users/me/check-in
// @desc    Daily check-in to update streak
// @access  Private
router.post('/me/check-in', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.updateStreak();

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: {
        streakCount: user.streakCount,
        lastCheckIn: user.lastCheckIn
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking in',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/me
// @desc    Delete user account
// @access  Private
router.delete('/me', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -settings');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

export default router;