const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const disqualifiedStudentSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  competitionId: {
    type: Schema.Types.ObjectId,
    ref: 'competition',
    required: true
  },
  disqualifiedStatus: {
    type: Boolean,
    default: true
  },
  disqualificationReason: {
    type: String,
    required: true
  },
  disqualifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a compound index to prevent duplicate entries for the same student in the same competition
disqualifiedStudentSchema.index({ studentId: 1, competitionId: 1 }, { unique: true });

const DisqualifiedStudent = mongoose.model('disqualifiedStudent', disqualifiedStudentSchema);

module.exports = DisqualifiedStudent;
