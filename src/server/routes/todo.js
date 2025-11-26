import express from 'express';
import Todo from '../models/Todo.js';
import { protect } from '../middleware/auth.js';
import { validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/todos
// @desc    Create a new todo
// @access  Private
router.post('/', async (req, res) => {
  try {
    const todo = await Todo.create({
      userId: req.user.id,
      text: req.body.text,
      category: req.body.category,
      priority: req.body.priority,
      dueDate: req.body.dueDate
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error.message
    });
  }
});

// @route   GET /api/todos
// @desc    Get all todos for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { completed, category, sort = '-createdAt' } = req.query;
    
    const filter = { userId: req.user.id };
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    const todos = await Todo.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error.message
    });
  }
});

// @route   GET /api/todos/stats
// @desc    Get todo statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    
    const stats = {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      pending: todos.filter(t => !t.completed).length,
      byCategory: {
        personal: todos.filter(t => t.category === 'personal').length,
        study: todos.filter(t => t.category === 'study').length,
        health: todos.filter(t => t.category === 'health').length,
        other: todos.filter(t => t.category === 'other').length
      },
      byPriority: {
        high: todos.filter(t => t.priority === 'high').length,
        medium: todos.filter(t => t.priority === 'medium').length,
        low: todos.filter(t => t.priority === 'low').length
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todo stats',
      error: error.message
    });
  }
});

// @route   GET /api/todos/:id
// @desc    Get single todo
// @access  Private
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todo',
      error: error.message
    });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update todo
// @access  Private
router.put('/:id', validateMongoId, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const fieldsToUpdate = {
      text: req.body.text,
      category: req.body.category,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      completed: req.body.completed
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // Update completedAt if marking as completed
    if (req.body.completed === true && !todo.completed) {
      fieldsToUpdate.completedAt = new Date();
    } else if (req.body.completed === false) {
      fieldsToUpdate.completedAt = null;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error.message
    });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete todo
// @access  Private
router.delete('/:id', validateMongoId, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error.message
    });
  }
});

// @route   PATCH /api/todos/:id/toggle
// @desc    Toggle todo completion status
// @access  Private
router.patch('/:id/toggle', validateMongoId, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date() : null;
    await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo status updated',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling todo',
      error: error.message
    });
  }
});

export default router;
