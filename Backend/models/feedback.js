const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  feedback: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    trim: true,
    default: ''
  },
  feedbackType: {
    type: String,
    enum: ['general', 'suggestion', 'bug', 'testimonial', 'other'],
    default: 'general'
  },
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'customer_support', 'email', 'social_media'],
    default: 'website'
  },
  ratingGeneral: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingEase: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingSupport: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  specificFeatures: {
    type: [String],
    default: []
  },
  contactConsent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'in-progress', 'resolved', 'archived'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // This can reference multiple models: Student, Teacher, Admin
  },
  userType: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'guest'],
    default: 'guest'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a text index for searching
feedbackSchema.index({
  name: 'text',
  email: 'text',
  feedback: 'text'
});

module.exports = mongoose.model('Feedback', feedbackSchema);
