import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  topic: {
    type: String,
    required: [true, 'Please provide a topic'],
    trim: true,
    maxlength: [200, 'Topic cannot exceed 200 characters']
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 480 // 8 hours max
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
studyPlanSchema.index({ userId: 1, date: -1 });
studyPlanSchema.index({ userId: 1, completed: 1 });

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);

export default StudyPlan;
