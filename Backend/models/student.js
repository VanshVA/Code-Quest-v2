const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const studentSchema = new mongoose.Schema({
    studentFirstName: {
        type: String,
        required: true
    },
    studentLastName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true,
        unique: true
    },
    studentPassword: {
        type: String,
        required: true
    },
    studentImage: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
    },
    role: {
        type: String,
        required: true,
        default: "student"
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    allowance: {
        type: Boolean,
        default: true
    },
    competitionsJoined: [{
        type: Schema.Types.ObjectId,
        ref: 'Competition'
    }],
    provider: {
        type: String
    },
    registerTime: {
        type: Date,
    },
    loginTime: {
        type: Date,
    },
    blockedStatus: {
        type: Boolean,
        default: false
    },
});

studentSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.studentPassword = await bcrypt.hash(this.studentPassword, 10);
    }
    next();
});

module.exports = mongoose.model("student", studentSchema);