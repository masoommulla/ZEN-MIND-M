import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const therapistAuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  profilePicture: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'
  },
  about: {
    type: String,
    maxlength: [1000, 'About cannot exceed 1000 characters'],
    default: ''
  },
  specializations: [{
    type: String,
    enum: ['Depression', 'Anxiety', 'Stress Management', 'Relationship Issues', 'Teen Counseling', 'Academic Pressure', 'Family Issues', 'Self Esteem', 'Grief', 'Trauma']
  }],
  education: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  languages: [{
    type: String,
    default: ['English', 'Hindi']
  }],
  pricing: {
    perSession: {
      type: Number,
      default: 1, // ₹1 per 30 minutes
      min: 1
    },
    duration: {
      type: Number,
      default: 30, // 30 minutes base
      enum: [30]
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  // Current session tracking for real-time availability
  currentSession: {
    isActive: {
      type: Boolean,
      default: false
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null
    },
    startedAt: {
      type: Date,
      default: null
    },
    endsAt: {
      type: Date,
      default: null
    }
  },
  // Time slots for today and tomorrow (3 slots per day)
  timeSlots: [{
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    slots: [{
      startTime: String, // Format: HH:MM (24-hour)
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false
      },
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
      }
    }]
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: {
      type: String,
      default: 'Anonymous Teen'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalSessions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'therapist',
    immutable: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for pricePerSession (frontend compatibility)
therapistAuthSchema.virtual('pricePerSession').get(function() {
  return this.pricing?.perSession || 0;
});

// Hash password before saving
therapistAuthSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
therapistAuthSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Get available slots for a specific date
therapistAuthSchema.methods.getAvailableSlots = function(date) {
  const daySlots = this.timeSlots.find(ts => ts.date === date);
  if (!daySlots) return [];
  
  return daySlots.slots.filter(slot => !slot.isBooked);
};

// Book a time slot
therapistAuthSchema.methods.bookSlot = async function(date, startTime, appointmentId) {
  const daySlots = this.timeSlots.find(ts => ts.date === date);
  if (!daySlots) {
    throw new Error('No slots available for this date');
  }
  
  const slot = daySlots.slots.find(s => s.startTime === startTime);
  if (!slot) {
    throw new Error('Slot not found');
  }
  
  if (slot.isBooked) {
    throw new Error('Slot is already booked');
  }
  
  slot.isBooked = true;
  slot.appointmentId = appointmentId;
  await this.save();
  
  return slot;
};

// Release a time slot (for cancellations)
therapistAuthSchema.methods.releaseSlot = async function(date, startTime) {
  const daySlots = this.timeSlots.find(ts => ts.date === date);
  if (!daySlots) return;
  
  const slot = daySlots.slots.find(s => s.startTime === startTime);
  if (slot) {
    slot.isBooked = false;
    slot.appointmentId = null;
    await this.save();
  }
};

// Cancel slot (alias for releaseSlot)
therapistAuthSchema.methods.cancelSlot = async function(date, startTime) {
  return await this.releaseSlot(date, startTime);
};

// Update therapist rating based on reviews
therapistAuthSchema.methods.updateRating = async function() {
  if (!this.reviews || this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = Number((totalRating / this.reviews.length).toFixed(1));
    this.reviewCount = this.reviews.length;
  }
  await this.save();
};

const TherapistAuth = mongoose.model('TherapistAuth', therapistAuthSchema);

export default TherapistAuth;