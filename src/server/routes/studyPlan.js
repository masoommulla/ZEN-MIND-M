import express from 'express';
import StudyPlan from '../models/StudyPlan.js';
import { protect } from '../middleware/auth.js';
import { validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/study-plans
// @desc    Create a new study plan
// @access  Private
router.post('/', async (req, res) => {
  try {
    const studyPlan = await StudyPlan.create({
      userId: req.user.id,
      subject: req.body.subject,
      topic: req.body.topic,
      duration: req.body.duration,
      notes: req.body.notes,
      date: req.body.date
    });

    res.status(201).json({
      success: true,
      message: 'Study plan created successfully',
      data: studyPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating study plan',
      error: error.message
    });
  }
});

// @route   GET /api/study-plans
// @desc    Get all study plans for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { completed, sort = '-date' } = req.query;
    
    const filter = { userId: req.user.id };
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    const studyPlans = await StudyPlan.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: studyPlans.length,
      data: studyPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching study plans',
      error: error.message
    });
  }
});

// @route   GET /api/study-plans/stats
// @desc    Get study plan statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const studyPlans = await StudyPlan.find({ userId: req.user.id });
    
    const totalDuration = studyPlans.reduce((sum, plan) => sum + plan.duration, 0);
    const completedDuration = studyPlans
      .filter(p => p.completed)
      .reduce((sum, plan) => sum + plan.duration, 0);

    // Get unique subjects
    const subjects = [...new Set(studyPlans.map(p => p.subject))];
    
    // This month's stats
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const thisMonth = studyPlans.filter(p => p.date >= monthAgo);

    const stats = {
      total: studyPlans.length,
      completed: studyPlans.filter(p => p.completed).length,
      pending: studyPlans.filter(p => !p.completed).length,
      totalDuration: totalDuration,
      completedDuration: completedDuration,
      subjects: subjects,
      thisMonth: thisMonth.length,
      thisMonthDuration: thisMonth.reduce((sum, plan) => sum + plan.duration, 0)
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching study plan stats',
      error: error.message
    });
  }
});

// @route   GET /api/study-plans/:id
// @desc    Get single study plan
// @access  Private
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: studyPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching study plan',
      error: error.message
    });
  }
});

// @route   PUT /api/study-plans/:id
// @desc    Update study plan
// @access  Private
router.put('/:id', validateMongoId, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }

    const fieldsToUpdate = {
      subject: req.body.subject,
      topic: req.body.topic,
      duration: req.body.duration,
      notes: req.body.notes,
      date: req.body.date,
      completed: req.body.completed
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // Update completedAt if marking as completed
    if (req.body.completed === true && !studyPlan.completed) {
      fieldsToUpdate.completedAt = new Date();
    } else if (req.body.completed === false) {
      fieldsToUpdate.completedAt = null;
    }

    const updatedStudyPlan = await StudyPlan.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Study plan updated successfully',
      data: updatedStudyPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating study plan',
      error: error.message
    });
  }
});

// @route   DELETE /api/study-plans/:id
// @desc    Delete study plan
// @access  Private
router.delete('/:id', validateMongoId, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }

    await StudyPlan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Study plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting study plan',
      error: error.message
    });
  }
});

// @route   PATCH /api/study-plans/:id/toggle
// @desc    Toggle study plan completion status
// @access  Private
router.patch('/:id/toggle', validateMongoId, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }

    studyPlan.completed = !studyPlan.completed;
    studyPlan.completedAt = studyPlan.completed ? new Date() : null;
    await studyPlan.save();

    res.status(200).json({
      success: true,
      message: 'Study plan status updated',
      data: studyPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling study plan',
      error: error.message
    });
  }
});

export default router;
