const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const teacherSchema = new mongoose.Schema({
    teacherFirstName: {
        type: String,
        required: true
    },
    teacherLastName: {
        type: String,
        required: true
    },
    teacherEmail: {
        type: String,
        required: true,
        unique: true
    },
    teacherPassword: {
        type: String,
        required: true
    },
    teacherImage: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"

    },
    role: {
        type: String,
        required: true,
    },
    registerTime:{
        type: Date,
    },
    loginTime: {
        type: Date,
    },
});

teacherSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.teacherPassword = await bcrypt.hash(this.teacherPassword, 10);
    }
    next();
});

module.exports = mongoose.model("teacher", teacherSchema);