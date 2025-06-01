const mongoose = require('mongoose');
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
  competitionAvailableTiming:{
    type: String,
    default: ""
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
  previousCompetition: { type: Boolean, default: false },
  winner: { type: String, default: null },
  runnerUp: { type: String, default: null },
  secondRunnerUp: { type: String, default: null },
});

// Pre-save middleware to update status based on timing
competitionSchema.pre('save', function(next) {
  // Only process if timing fields are available
  if (this.competitionAvailableTiming) {
    const now = new Date();
    const availableFrom = new Date(this.competitionAvailableTiming);
    
    // Calculate end time (if not explicitly set)
    let endTime;
    if (this.endTiming) {
      endTime = new Date(this.endTiming);
    } else if (this.duration) {
      // If no end time but has duration, calculate end time from available time + duration
      endTime = new Date(availableFrom.getTime() + (this.duration * 60000)); // Convert minutes to milliseconds
      // Update endTiming field
      this.endTiming = endTime.toISOString();
    } else {
      // Default to 60 minutes if no duration specified
      endTime = new Date(availableFrom.getTime() + (60 * 60000));
      this.endTiming = endTime.toISOString();
    }
    
    // Determine status based on current time relative to available and end times
    if (now < availableFrom) {
      this.status = 'upcoming';
    } else if (now >= availableFrom && now <= endTime) {
      this.status = 'active';
    } else {
      this.status = 'ended';
    }
  }
  
  next();
});

// Create static method to update status for all competitions
competitionSchema.statics.updateAllStatuses = async function() {
  const now = new Date();
  
  // Find all competitions with timing info
  const competitions = await this.find({ competitionAvailableTiming: { $ne: "" } });
  
  let updatedCount = 0;
  
  // Update each competition's status
  for (const competition of competitions) {
    const originalStatus = competition.status;
    
    const availableFrom = new Date(competition.competitionAvailableTiming);
    let endTime;
    
    if (competition.endTiming) {
      endTime = new Date(competition.endTiming);
    } else if (competition.duration) {
      endTime = new Date(availableFrom.getTime() + (competition.duration * 60000));
      competition.endTiming = endTime.toISOString();
    } else {
      endTime = new Date(availableFrom.getTime() + (60 * 60000));
      competition.endTiming = endTime.toISOString();
    }
    
    if (now < availableFrom) {
      competition.status = 'upcoming';
    } else if (now >= availableFrom && now <= endTime) {
      competition.status = 'active';
    } else {
      competition.status = 'ended';
    }
    
    if (competition.status !== originalStatus) {
      await competition.save();
      updatedCount++;
    }
  }
  
  return updatedCount;
};

// Virtual property to check if competition is currently available
competitionSchema.virtual('isAvailable').get(function() {
  if (!this.competitionAvailableTiming) return false;
  
  const now = new Date();
  const availableFrom = new Date(this.competitionAvailableTiming);
  const endTime = this.endTiming ? new Date(this.endTiming) : null;
  
  // Competition is available if current time is after available time
  // and before end time (if defined) and if competition is live
  return this.isLive && now >= availableFrom && (!endTime || now <= endTime);
});

// Create and export the Competition model
const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
