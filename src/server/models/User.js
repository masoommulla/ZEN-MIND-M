import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(value) {
        // Skip validation if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
        if (value.startsWith('$2a$') || value.startsWith('$2b$') || value.startsWith('$2y$')) {
          return true;
        }
        // Password must contain: 
        // - At least 8 characters
        // - At least one uppercase letter
        // - At least one lowercase letter
        // - At least one number
        // - At least one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(value);
      },
      message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character (@$!%*?&)'
    },
    select: false
  },
  age: {
    type: Number,
    min: [13, 'Must be at least 13 years old'],
    max: [19, 'This app is designed for teenagers']
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
  },
  role: {
    type: String,
    enum: ['user', 'therapist', 'admin'],
    default: 'user'
  },
  profile: {
    bio: String,
    pronouns: String,
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other', '']
    },
    dateOfBirth: {
      type: Date
    },
    interests: [String],
    supportNeeds: [String]
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'private' },
      shareProgress: { type: Boolean, default: false }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'unlimited'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: false }
  },
  streakCount: {
    type: Number,
    default: 0
  },
  lastCheckIn: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak on check-in
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastCheck = this.lastCheckIn;
  
  if (!lastCheck) {
    this.streakCount = 1;
  } else {
    const diffTime = Math.abs(now - lastCheck);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      this.streakCount += 1;
    } else if (diffDays > 1) {
      this.streakCount = 1;
    }
  }
  
  this.lastCheckIn = now;
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;