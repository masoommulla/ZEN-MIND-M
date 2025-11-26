import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: [true, 'Please select a mood'],
    enum: ['amazing', 'good', 'okay', 'sad', 'anxious', 'stressed', 'angry']
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  emotions: [{
    type: String
  }],
  activities: [{
    type: String
  }],
  triggers: [{
    type: String
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  energy: {
    type: Number,
    min: 1,
    max: 10
  },
  sleep: {
    hours: Number,
    quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    }
  },
  social: {
    type: String,
    enum: ['none', 'minimal', 'moderate', 'active']
  },
  suggestion: {
    activity: String,
    book: String,
    song: String,
    exercise: String,
    emotion: String,
    intensity: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
moodSchema.index({ userId: 1, date: -1 });

// Get mood statistics for a user
moodSchema.statics.getUserStats = async function(userId, days = 30) {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);
  
  const moods = await this.find({
    userId,
    date: { $gte: dateLimit }
  }).sort({ date: -1 });
  
  // Calculate statistics
  const moodCounts = {};
  let totalIntensity = 0;
  const emotions = new Set();
  const activities = new Set();
  
  moods.forEach(mood => {
    moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    totalIntensity += mood.intensity;
    mood.emotions.forEach(e => emotions.add(e));
    mood.activities.forEach(a => activities.add(a));
  });
  
  return {
    total: moods.length,
    moodDistribution: moodCounts,
    averageIntensity: moods.length ? (totalIntensity / moods.length).toFixed(1) : 0,
    topEmotions: Array.from(emotions).slice(0, 5),
    topActivities: Array.from(activities).slice(0, 5),
    recentMoods: moods.slice(0, 7)
  };
};

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;