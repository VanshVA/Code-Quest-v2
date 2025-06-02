const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    competitionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [{
        type: String,
        required: true
    }],
    answers: [{
        type: String,
        // required: true
    }],
    submissionTime: {
        type: Date,
        default: Date.now
    },
});

// Create a compound index to ensure a student can only submit once per competition
submissionSchema.index({ competitionId: 1, studentId: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
