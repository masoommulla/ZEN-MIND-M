import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age')
    .optional()
    .isInt({ min: 13, max: 19 }).withMessage('Age must be between 13 and 19'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Mood validation rules
export const validateMood = [
  body('mood')
    .notEmpty().withMessage('Mood is required')
    .isIn(['amazing', 'good', 'okay', 'sad', 'anxious', 'stressed', 'angry'])
    .withMessage('Invalid mood value'),
  body('intensity')
    .notEmpty().withMessage('Intensity is required')
    .isInt({ min: 1, max: 10 }).withMessage('Intensity must be between 1 and 10'),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  handleValidationErrors
];

// Journal validation rules
export const validateJournal = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
  body('mood')
    .optional()
    .isIn(['amazing', 'good', 'okay', 'sad', 'anxious', 'stressed', 'angry'])
    .withMessage('Invalid mood value'),
  handleValidationErrors
];

// Appointment validation rules
export const validateAppointment = [
  body('therapistId')
    .notEmpty().withMessage('Therapist ID is required'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('startTime')
    .notEmpty().withMessage('Start time is required'),
  body('endTime')
    .optional(),
  body('type')
    .optional()
    .isIn(['video', 'audio', 'chat', 'phone', 'in-person'])
    .withMessage('Invalid appointment type'),
  handleValidationErrors
];

// Message validation rules
export const validateMessage = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
  body('type')
    .optional()
    .isIn(['text', 'image', 'file', 'audio', 'video'])
    .withMessage('Invalid message type'),
  handleValidationErrors
];

// MongoDB ObjectId validation
export const validateMongoId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors
];