import express from 'express';
import Resource from '../models/Resource.js';
import { protect } from '../middleware/auth.js';
import { validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/resources
// @desc    Get all resources with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      type,
      difficulty,
      featured,
      premium,
      limit = 20,
      page = 1,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (premium !== undefined) {
      query.isPremium = premium === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const resources = await Resource.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resources',
      error: error.message
    });
  }
});

// @route   GET /api/resources/featured
// @desc    Get featured resources
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const resources = await Resource.find({
      isActive: true,
      isFeatured: true
    })
    .sort('-rating -views')
    .limit(6);

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured resources',
      error: error.message
    });
  }
});

// @route   GET /api/resources/search
// @desc    Search resources
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const resources = await Resource.find({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    }).sort('-rating -views');

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching resources',
      error: error.message
    });
  }
});

// @route   GET /api/resources/categories
// @desc    Get resource categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Increment view count
    await resource.incrementViews();

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resource',
      error: error.message
    });
  }
});

// @route   POST /api/resources
// @desc    Create a new resource
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const resource = await Resource.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating resource',
      error: error.message
    });
  }
});

// @route   PUT /api/resources/:id
// @desc    Update resource
// @access  Private (Admin only)
router.put('/:id', protect, validateMongoId, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating resource',
      error: error.message
    });
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource
// @access  Private (Admin only)
router.delete('/:id', protect, validateMongoId, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting resource',
      error: error.message
    });
  }
});

// @route   PATCH /api/resources/:id/like
// @desc    Like a resource
// @access  Private
router.patch('/:id/like', protect, validateMongoId, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    resource.likes += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource liked successfully',
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking resource',
      error: error.message
    });
  }
});

// @route   PATCH /api/resources/:id/download
// @desc    Increment download count
// @access  Private
router.patch('/:id/download', protect, validateMongoId, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    resource.downloads += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Download count updated',
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating download count',
      error: error.message
    });
  }
});

export default router;