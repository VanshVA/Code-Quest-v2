const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
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
    submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true
    },
    results: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        questionType: {
            type: String,
            enum: ['MCQ', 'CODE', 'TEXT'],
            required: true
        },
        studentAnswer: {
            type: mongoose.Schema.Types.Mixed, // Can store string for text/code or option ID for MCQ
            required: true
        },
        correctAnswer: {
            type: String,
            // Only stored for MCQ questions as they have predefined correct answers
            required: function () { return this.questionType === 'MCQ'; }
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    percentageScore: {
        type: Number,
        default: 0
    },
    scoreAssignedTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
