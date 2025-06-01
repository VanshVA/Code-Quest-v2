const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Very Hard'],
    required: false
  },
  improvements: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  },
  experience: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'addressed'],
    default: 'pending'
  }
}, { timestamps: true });

// One student can only give one feedback per competition
feedbackSchema.index({ studentId: 1, competitionId: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
