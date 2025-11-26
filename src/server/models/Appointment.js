import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TherapistAuth',
    required: true
  },
  therapistName: {
    type: String
  },
  therapistAvatar: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    default: 60 // in minutes
  },
  type: {
    type: String,
    enum: ['video', 'audio', 'chat', 'in-person'],
    default: 'video'
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  reason: {
    type: String,
    maxlength: [300, 'Reason cannot exceed 300 characters']
  },
  meetingLink: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  payment: {
    amount: Number,
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    method: String
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['user', 'therapist', 'system']
    },
    reason: String,
    cancelledAt: Date
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: Date
  },
  sessionNotes: {
    type: String,
    maxlength: [2000, 'Session notes cannot exceed 2000 characters']
  }
}, {
  timestamps: true
});

// Index for faster queries
appointmentSchema.index({ userId: 1, date: -1 });
appointmentSchema.index({ therapistId: 1, date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1, startTime: 1 });

// Check for conflicts before saving
appointmentSchema.pre('save', async function(next) {
  if (!this.isNew && !this.isModified('date') && !this.isModified('startTime')) {
    return next();
  }
  
  const conflict = await this.constructor.findOne({
    therapistId: this.therapistId,
    date: this.date,
    startTime: this.startTime,
    status: { $in: ['scheduled', 'confirmed'] },
    _id: { $ne: this._id }
  });
  
  if (conflict) {
    throw new Error('This time slot is already booked');
  }
  
  next();
});

// Get upcoming appointments
appointmentSchema.statics.getUpcoming = async function(userId, userType = 'user') {
  const query = userType === 'user' 
    ? { userId } 
    : { therapistId: userId };
  
  return await this.find({
    ...query,
    date: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  })
  .populate('userId', 'name email avatar')
  .populate('therapistId', 'name title specialties image rating')
  .sort({ date: 1, startTime: 1 });
};

// Get appointment statistics
appointmentSchema.statics.getStats = async function(userId, userType = 'user') {
  const query = userType === 'user' 
    ? { userId } 
    : { therapistId: userId };
  
  const all = await this.find(query);
  
  return {
    total: all.length,
    completed: all.filter(a => a.status === 'completed').length,
    upcoming: all.filter(a => 
      a.status === 'scheduled' || a.status === 'confirmed'
    ).length,
    cancelled: all.filter(a => a.status === 'cancelled').length
  };
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;