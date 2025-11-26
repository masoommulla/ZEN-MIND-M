import express from 'express';
import Appointment from '../models/Appointment.js';
import TherapistAuth from '../models/TherapistAuth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/reviews/submit
 * Submit a review for a completed session
 */
router.post('/submit', protect, async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validation
    if (!appointmentId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify the appointment belongs to the user
    if (appointment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own sessions'
      });
    }

    // Check if appointment is completed
    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed sessions'
      });
    }

    // Check if already reviewed
    if (appointment.review && appointment.review.rating) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this session'
      });
    }

    // Add review to appointment
    appointment.review = {
      rating,
      comment: comment || '',
      createdAt: new Date()
    };
    await appointment.save();

    // Add review to therapist and update rating
    const therapist = await TherapistAuth.findById(appointment.therapistId);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Add to reviews array
    therapist.reviews.push({
      appointmentId: appointment._id,
      userId: userId,
      userName: 'Anonymous Teen', // Keep anonymous
      rating,
      comment: comment || '',
      createdAt: new Date()
    });

    // Recalculate average rating
    const totalRating = therapist.reviews.reduce((sum, review) => sum + review.rating, 0);
    therapist.rating = totalRating / therapist.reviews.length;
    therapist.reviewCount = therapist.reviews.length;

    await therapist.save();

    console.log(`✅ Review submitted: ${rating} stars for therapist ${therapist.name}`);

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review: appointment.review,
        therapistRating: therapist.rating,
        therapistReviewCount: therapist.reviewCount
      }
    });
  } catch (error) {
    console.error('❌ Error submitting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
});

/**
 * GET /api/reviews/therapist/:therapistId
 * Get all reviews for a therapist
 */
router.get('/therapist/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { limit = 10, sortBy = 'recent' } = req.query;

    const therapist = await TherapistAuth.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Ensure reviews is an array
    let reviews = Array.isArray(therapist.reviews) ? [...therapist.reviews] : [];

    // Sort reviews
    if (sortBy === 'recent') {
      reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'highest') {
      reviews.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      reviews.sort((a, b) => a.rating - b.rating);
    }

    // Apply limit
    reviews = reviews.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        reviews,
        totalReviews: therapist.reviewCount || 0,
        averageRating: therapist.rating || 0,
        ratingDistribution: {
          5: Array.isArray(therapist.reviews) ? therapist.reviews.filter(r => r.rating === 5).length : 0,
          4: Array.isArray(therapist.reviews) ? therapist.reviews.filter(r => r.rating === 4).length : 0,
          3: Array.isArray(therapist.reviews) ? therapist.reviews.filter(r => r.rating === 3).length : 0,
          2: Array.isArray(therapist.reviews) ? therapist.reviews.filter(r => r.rating === 2).length : 0,
          1: Array.isArray(therapist.reviews) ? therapist.reviews.filter(r => r.rating === 1).length : 0,
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
});

/**
 * GET /api/reviews/check/:appointmentId
 * Check if user has reviewed a specific appointment
 */
router.get('/check/:appointmentId', protect, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user._id;

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
        message: 'Unauthorized'
      });
    }

    const hasReviewed = appointment.review && appointment.review.rating;

    res.status(200).json({
      success: true,
      data: {
        hasReviewed,
        review: hasReviewed ? appointment.review : null
      }
    });
  } catch (error) {
    console.error('❌ Error checking review status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking review status',
      error: error.message
    });
  }
});

export default router;