import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  profilePicture: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'
  },
  about: {
    type: String,
    default: 'Experienced therapist dedicated to helping teens with mental health challenges.',
    maxlength: [1000, 'About cannot exceed 1000 characters']
  },
  specializations: [{
    type: String,
    required: true
  }],
  education: {
    type: String,
    default: 'M.A. in Clinical Psychology'
  },
  experience: {
    type: Number,
    default: 5,
    min: 0
  },
  languages: [{
    type: String,
    default: ['English', 'Hindi']
  }],
  pricePerSession: {
    type: Number,
    default: 1, // ₹1 for 30 minutes
    min: 1
  },
  sessionDuration: {
    type: Number,
    default: 30, // minutes
    enum: [30, 60]
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
  // Available time slots (3 slots per day) - DEPRECATED but kept for backward compatibility
  availableSlots: [{
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    slots: [{
      startTime: {
        type: String, // Format: HH:MM (24-hour)
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      isBooked: {
        type: Boolean,
        default: false
      },
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null
      }
    }]
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
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
    comment: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  role: {
    type: String,
    default: 'therapist',
    immutable: true
  }
}, {
  timestamps: true
});

// Hash password before saving
therapistSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
therapistSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Initialize default slots for today and tomorrow
therapistSchema.methods.initializeDefaultSlots = async function() {
  const today = new Date();
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Default 3 slots per day with 30-min breaks
  const defaultSlots = [
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '12:00', endTime: '13:00' },
    { startTime: '14:00', endTime: '15:00' }
  ];
  
  // Initialize only today's slots - therapist will add tomorrow's slots manually
  this.availableSlots = [
    {
      date: formatDate(today),
      slots: defaultSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
        bookedBy: null,
        appointmentId: null
      }))
    }
  ];
  
  await this.save();
};

// Get available slots for a specific date
therapistSchema.methods.getAvailableSlots = function(date) {
  const dateSlots = this.availableSlots.find(slot => slot.date === date);
  if (!dateSlots) return [];
  
  return dateSlots.slots.filter(slot => !slot.isBooked);
};

// Book a slot
therapistSchema.methods.bookSlot = async function(date, startTime, userId, appointmentId) {
  const dateSlots = this.availableSlots.find(slot => slot.date === date);
  if (!dateSlots) {
    throw new Error('No slots available for this date');
  }
  
  const slot = dateSlots.slots.find(s => s.startTime === startTime && !s.isBooked);
  if (!slot) {
    throw new Error('Slot not available');
  }
  
  slot.isBooked = true;
  slot.bookedBy = userId;
  slot.appointmentId = appointmentId;
  
  await this.save();
  return slot;
};

// Cancel a slot booking
therapistSchema.methods.cancelSlot = async function(date, startTime) {
  const dateSlots = this.availableSlots.find(slot => slot.date === date);
  if (!dateSlots) return;
  
  const slot = dateSlots.slots.find(s => s.startTime === startTime);
  if (slot) {
    slot.isBooked = false;
    slot.bookedBy = null;
    slot.appointmentId = null;
    await this.save();
  }
};

// Index for faster queries
therapistSchema.index({ specializations: 1 });
therapistSchema.index({ isActive: 1 });
therapistSchema.index({ 'availableSlots.date': 1 });

const Therapist = mongoose.model('Therapist', therapistSchema);

export default Therapist;