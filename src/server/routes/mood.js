import express from 'express';
import Mood from '../models/Mood.js';
import { protect } from '../middleware/auth.js';
import { validateMood, validateMongoId } from '../middleware/validation.js';
import { generateMoodSuggestion } from '../utils/moodSuggestions.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/moods
// @desc    Create a new mood entry
// @access  Private
router.post('/', validateMood, async (req, res) => {
  try {
    const moodData = {
      ...req.body,
      userId: req.user.id
    };

    // Generate suggestion based on intensity and first selected emotion
    const primaryEmotion = req.body.emotions && req.body.emotions[0] ? req.body.emotions[0] : 'Happy';
    const suggestion = generateMoodSuggestion(
      req.body.intensity || 5,
      primaryEmotion
    );
    
    console.log('Generated suggestion for emotion:', primaryEmotion, 'intensity:', req.body.intensity);
    console.log('Suggestion object:', JSON.stringify(suggestion, null, 2));
    
    moodData.suggestion = suggestion;

    const mood = await Mood.create(moodData);

    // Convert to plain object to ensure suggestion is included
    const moodObj = mood.toObject();
    
    console.log('Mood created successfully');
    console.log('Mood suggestion after save:', JSON.stringify(moodObj.suggestion, null, 2));

    res.status(201).json({
      success: true,
      message: 'Mood entry created successfully',
      data: moodObj
    });
  } catch (error) {
    console.error('Error creating mood:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating mood entry',
      error: error.message
    });
  }
});

// @route   GET /api/moods
// @desc    Get all mood entries for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { limit = 30, sort = '-date' } = req.query;

    const moods = await Mood.find({ userId: req.user.id })
      .sort(sort)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood entries',
      error: error.message
    });
  }
});

// @route   GET /api/moods/stats
// @desc    Get mood statistics for current user
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const stats = await Mood.getUserStats(req.user.id, parseInt(days));

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood statistics',
      error: error.message
    });
  }
});

// @route   GET /api/moods/:id
// @desc    Get single mood entry
// @access  Private
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mood
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood entry',
      error: error.message
    });
  }
});

// @route   PUT /api/moods/:id
// @desc    Update mood entry
// @access  Private
router.put('/:id', validateMongoId, async (req, res) => {
  try {
    let mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    mood = await Mood.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Mood entry updated successfully',
      data: mood
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating mood entry',
      error: error.message
    });
  }
});

// @route   DELETE /api/moods/:id
// @desc    Delete mood entry
// @access  Private
router.delete('/:id', validateMongoId, async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    await Mood.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting mood entry',
      error: error.message
    });
  }
});

// @route   GET /api/moods/range/:startDate/:endDate
// @desc    Get mood entries within date range
// @access  Private
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const moods = await Mood.find({
      userId: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood entries',
      error: error.message
    });
  }
});

export default router;