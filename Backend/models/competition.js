const mongoose = require('mongoose');
const student = require('./student');
const { Schema } = mongoose;

// Define the schema for questions
const questionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: false // Only required for text and mcq questions
  },
  options: {
    type: [String],
    default: []
  }
});

// Define the schema for competitions
const competitionSchema = new Schema({
  competitionName: {
    type: String,
    required: true
  },
  competitionDescription: {
    type: String,
    required: true
  },
  creatorId: {
    type: String,
    required: true
  },
  competitionType: {
    type: String,
    enum: ['TEXT', 'MCQ', 'CODE'],
    required: true
  },
  duration: {
    type: Number,
    default: 60 // Default duration in minutes
  },
  questions: [questionSchema], // Array of questions directly in the competition
  id: {
    type: Number,
  },
  isLive: {
    type: Boolean,
    default: false
  },
  startTiming: {
    type: String,
    default: ""
  },
  lastSaved: {
    type: String
  },
  endTiming: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  },
  studentsJoined: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  previousCompetition: { type: Boolean, default: false },
  winner: { type: String, default: null },
  runnerUp: { type: String, default: null },
  secondRunnerUp: { type: String, default: null },
});

// Pre-save middleware to update status based on timing
competitionSchema.pre('save', function(next) {
  // Only process if timing fields are available
  if (this.startTiming) {
    const now = new Date();
    const startTime = new Date(this.startTiming);
    
    // Calculate end time (if not explicitly set)
    let endTime;
    if (this.endTiming && this.endTiming !== "") {
      endTime = new Date(this.endTiming);
    } else if (this.duration) {
      // If no end time but has duration, calculate end time from start time + duration
      endTime = new Date(startTime.getTime() + (this.duration * 60000)); // Convert minutes to milliseconds
      // Update endTiming field
      this.endTiming = endTime.toISOString();
    } else {
      // Default to 60 minutes if no duration specified
      endTime = new Date(startTime.getTime() + (60 * 60000));
      this.endTiming = endTime.toISOString();
    }
    
    // Determine status based on current time relative to start and end times
    if (now < startTime) {
      this.status = 'upcoming';
    } else if (now >= startTime && now <= endTime) {
      this.status = 'active';
    } else {
      this.status = 'ended';
      // If competition has ended, it should not be live anymore
      this.isLive = false;
    }
  }
  
  next();
});

// Create and export the Competition model
const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
