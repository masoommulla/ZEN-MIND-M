import express from 'express';
import Journal from '../models/Journal.js';
import { protect } from '../middleware/auth.js';
import { validateJournal, validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/journals
// @desc    Create a new journal entry
// @access  Private
router.post('/', async (req, res) => {
  try {
    console.log('Journal creation request:', req.body);
    
    // Remove empty mood if present
    const journalData = {
      ...req.body,
      userId: req.user.id
    };
    
    // Remove mood if it's empty string
    if (!journalData.mood || journalData.mood === '') {
      delete journalData.mood;
    }
    
    // Remove tags if empty array
    if (journalData.tags && journalData.tags.length === 0) {
      delete journalData.tags;
    }

    console.log('Cleaned journal data:', journalData);

    const journal = await Journal.create(journalData);

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: journal
    });
  } catch (error) {
    console.error('Journal creation error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating journal entry',
      error: error.message
    });
  }
});

// @route   GET /api/journals
// @desc    Get all journal entries for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 50, 
      page = 1, 
      sort = '-createdAt',
      tag,
      mood,
      isFavorite
    } = req.query;

    // Build query
    const query = { userId: req.user.id };
    if (tag) query.tags = tag;
    if (mood) query.mood = mood;
    if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const journals = await Journal.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Journal.countDocuments(query);

    res.status(200).json({
      success: true,
      count: journals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: journals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching journal entries',
      error: error.message
    });
  }
});

// @route   GET /api/journals/stats
// @desc    Get journal statistics for current user
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Journal.getUserStats(req.user.id);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching journal statistics',
      error: error.message
    });
  }
});

// @route   GET /api/journals/search
// @desc    Search journal entries
// @access  Private
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const journals = await Journal.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: journals.length,
      data: journals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching journal entries',
      error: error.message
    });
  }
});

// @route   GET /api/journals/date/:date
// @desc    Get journal entries for specific date
// @access  Private
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Create date range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const journals = await Journal.find({
      userId: req.user.id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: journals.length,
      data: journals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching journal entries for date',
      error: error.message
    });
  }
});

// @route   GET /api/journals/:id
// @desc    Get single journal entry
// @access  Private
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: journal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching journal entry',
      error: error.message
    });
  }
});

// @route   PUT /api/journals/:id
// @desc    Update journal entry
// @access  Private
router.put('/:id', validateMongoId, async (req, res) => {
  try {
    let journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: false }
    );

    res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      data: journal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating journal entry',
      error: error.message
    });
  }
});

// @route   PATCH /api/journals/:id/favorite
// @desc    Toggle favorite status
// @access  Private
router.patch('/:id/favorite', validateMongoId, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    journal.isFavorite = !journal.isFavorite;
    await journal.save();

    res.status(200).json({
      success: true,
      message: `Journal entry ${journal.isFavorite ? 'added to' : 'removed from'} favorites`,
      data: journal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating favorite status',
      error: error.message
    });
  }
});

// @route   DELETE /api/journals/:id
// @desc    Delete journal entry
// @access  Private
router.delete('/:id', validateMongoId, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    await Journal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting journal entry',
      error: error.message
    });
  }
});

export default router;