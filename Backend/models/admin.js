const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const  adminSchema = mongoose.Schema({
    adminName: {
        type: String,
        required: true, 
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true
    },
    adminPassword: {
        type: String,
        required: true
    },
    adminImage: {
        type: String,
        default: "https://res.cloudinary.com/dzqj1x3qk/image/upload/v1735681234/default-profile-picture.png"
    },  
    role:{
        type: String,
        require:true
    },
    permissions: {
        type: Array,
        default: ["StudentManagement","TeacherManagement","CompetitionManagement"], // Default to an empty array
    },
    loginTime: {
        type: Date, // This will store multiple login timestamps
      },
    lastLoginTime: {
        type: Date,
        default: null,
    },
    
});

adminSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.adminPassword = await bcrypt.hash(this.adminPassword, 10);
    }
    next();
});

module.exports = mongoose.model("admin",adminSchema);