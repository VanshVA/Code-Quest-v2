const mongoose = require('mongoose');
const { Schema } = mongoose;

// Answer schema for individual question answers
const answerSchema = new Schema({
  questionId: {
    type: String,
    required: false
  },
  answer: {
    type: Schema.Types.Mixed, // Can be string for text/MCQ or code for coding questions
    required: false
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  // Additional fields for coding answers
  executionTime: {
    type: Number,
    default: 0
  },
  memoryUsage: {
    type: Number,
    default: 0
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  }
});

// Competition result schema
const competitionResultSchema = new Schema({
  competitionId: {
    type: Schema.Types.ObjectId,
    ref: 'Competition',
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  creatorId: {
    type: String,
    required: true
  },
  // Round fields are now optional instead of required
  roundId: {
    type: String,
    required: false
  },
  roundNumber: {
    type: Number,
    required: false
  },
  roundType: {
    type: String,
    enum: ['TEXT', 'MCQ', 'CODE', ''],
    required: false
  },
  // Competition type from the parent competition
  competitionType: {
    type: String,
    enum: ['TEXT', 'MCQ', 'CODE'],
    required: true
  },
  answers: [answerSchema],
  isSubmitted: {
    type: Boolean,
    default: false
  },
  submissionTime: {
    type: Date
  },
  isGraded: {
    type: Boolean,
    default: false
  },
  gradedTime: {
    type: Date
  },
  totalScore: {
    type: Number,
    default: 0
  },
  maxPossibleScore: {
    type: Number,
    default: 0
  },
  scorePercentage: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0 // Time spent in seconds
  },
  feedback: {
    type: String,
    default: ''
  }
});

// Method to calculate total score
competitionResultSchema.methods.calculateScore = function() {
  // Calculate total score from answers
  let totalScore = 0;
  let maxPossibleScore = this.answers.length; // Each question is worth 1 point

  // Sum up scores from all answers
  this.answers.forEach(answer => {
    totalScore += answer.score || 0;
  });

  // Update the score fields
  this.totalScore = totalScore;
  this.maxPossibleScore = maxPossibleScore;
  
  // Calculate percentage (avoid division by zero)
  if (maxPossibleScore > 0) {
    this.scorePercentage = (totalScore / maxPossibleScore) * 100;
  } else {
    this.scorePercentage = 0;
  }
};

const CompetitionResult = mongoose.model('CompetitionResult', competitionResultSchema);

module.exports = CompetitionResult;