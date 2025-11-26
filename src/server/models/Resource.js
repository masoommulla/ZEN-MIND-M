import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['article', 'video', 'audio', 'exercise', 'worksheet', 'book', 'podcast', 'app']
  },
  type: {
    type: String,
    required: true,
    enum: ['anxiety', 'depression', 'stress', 'sleep', 'relationships', 'self-esteem', 'mindfulness', 'general']
  },
  content: {
    type: String
  },
  url: {
    type: String
  },
  thumbnail: {
    type: String
  },
  duration: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String
  }],
  author: {
    name: String,
    credentials: String
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
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
  publishedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for searching and filtering
resourceSchema.index({ category: 1, type: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ isFeatured: 1 });
resourceSchema.index({ rating: -1 });

// Increment view count
resourceSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
