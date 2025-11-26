import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    trim: true
  },
  mood: {
    type: String,
    trim: true,
    required: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  gratitude: [{
    type: String
  }],
  goals: [{
    text: String,
    completed: { type: Boolean, default: false }
  }],
  aiInsights: {
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    themes: [String],
    suggestions: [String]
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'audio', 'file']
    },
    url: String,
    name: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
journalSchema.index({ userId: 1, createdAt: -1 });
journalSchema.index({ tags: 1 });

// Get journal statistics
journalSchema.statics.getUserStats = async function(userId) {
  const journals = await this.find({ userId });
  
  const tagCounts = {};
  const moodCounts = {};
  
  journals.forEach(journal => {
    journal.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    if (journal.mood) {
      moodCounts[journal.mood] = (moodCounts[journal.mood] || 0) + 1;
    }
  });
  
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
  
  return {
    total: journals.length,
    favorites: journals.filter(j => j.isFavorite).length,
    topTags: sortedTags,
    moodDistribution: moodCounts,
    thisMonth: journals.filter(j => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return j.createdAt >= monthAgo;
    }).length
  };
};

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;