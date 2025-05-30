const Teacher = require('../models/teacher');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Current date and time for logging
const CURRENT_DATE_TIME = "2025-05-30 11:11:50";
const CURRENT_USER = "VanshSharmaSDENow";

// Helper function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const adminDashboardController = {
  // Get all teachers
  getAllTeachers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Prepare filter based on query parameters
      const filter = {};
      
      if (req.query.search) {
        filter.$or = [
          { teacherFirstName: { $regex: req.query.search, $options: 'i' } },
          { teacherLastName: { $regex: req.query.search, $options: 'i' } },
          { teacherEmail: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Count total teachers matching filter
      const totalTeachers = await Teacher.countDocuments(filter);
      
      // Get teachers with pagination
      const teachers = await Teacher.find(filter)
        .select('-teacherPassword') // Exclude password
        .sort({ _id: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);
      
      res.status(200).json({
        success: true,
        data: {
          teachers,
          pagination: {
            total: totalTeachers,
            page,
            pages: Math.ceil(totalTeachers / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error("Error in getAllTeachers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve teachers",
        error: error.message
      });
    }
  },
  
  // Get single teacher by ID
  getTeacherById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const teacher = await Teacher.findById(id).select('-teacherPassword');
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: { teacher }
      });
    } catch (error) {
      console.error("Error in getTeacherById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve teacher details",
        error: error.message
      });
    }
  },
  
  // Create new teacher
  createTeacher: async (req, res) => {
    try {
      const { teacherFirstName, teacherLastName, teacherEmail, teacherPassword, teacherImage, role } = req.body;
      
      // Validate required fields
      if (!teacherFirstName || !teacherLastName || !teacherEmail || !teacherPassword) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }
      
      // Validate email format
      if (!validateEmail(teacherEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }
      
      // Check if teacher with this email already exists
      const existingTeacher = await Teacher.findOne({ teacherEmail });
      if (existingTeacher) {
        return res.status(409).json({
          success: false,
          message: "Teacher with this email already exists"
        });
      }
      
      // Set default role if not provided
      const teacherRole = role || "teacher";
      
      // Create new teacher
      const newTeacher = new Teacher({
        teacherFirstName,
        teacherLastName,
        teacherEmail,
        teacherPassword,
        teacherImage: teacherImage || undefined, // Use default if not provided
        role: teacherRole
      });
      
      await newTeacher.save();
      
      // Return teacher data without password
      const teacherResponse = { ...newTeacher._doc };
      delete teacherResponse.teacherPassword;
      
      res.status(201).json({
        success: true,
        message: "Teacher created successfully",
        data: { teacher: teacherResponse }
      });
    } catch (error) {
      console.error("Error in createTeacher:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create teacher",
        error: error.message
      });
    }
  },
  
  // Update teacher
  updateTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const { teacherFirstName, teacherLastName, teacherEmail, teacherPassword, teacherImage, role } = req.body;
      
      // Find teacher
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found"
        });
      }
      
      // If email is being updated, check if it's already in use
      if (teacherEmail && teacherEmail !== teacher.teacherEmail) {
        if (!validateEmail(teacherEmail)) {
          return res.status(400).json({
            success: false,
            message: "Invalid email format"
          });
        }
        
        const emailExists = await Teacher.findOne({ teacherEmail });
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: "Email already in use by another teacher"
          });
        }
      }
      
      // Update fields if provided
      if (teacherFirstName) teacher.teacherFirstName = teacherFirstName;
      if (teacherLastName) teacher.teacherLastName = teacherLastName;
      if (teacherEmail) teacher.teacherEmail = teacherEmail;
      if (teacherImage) teacher.teacherImage = teacherImage;
      if (role) teacher.role = role;
      
      // Special handling for password
      if (teacherPassword) {
        teacher.teacherPassword = await bcrypt.hash(teacherPassword, 10);
      }
      
      // Save updated teacher
      await teacher.save();
      
      // Return updated teacher data without password
      const teacherResponse = { ...teacher._doc };
      delete teacherResponse.teacherPassword;
      
      res.status(200).json({
        success: true,
        message: "Teacher updated successfully",
        data: { teacher: teacherResponse }
      });
    } catch (error) {
      console.error("Error in updateTeacher:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update teacher",
        error: error.message
      });
    }
  },
  
  // Delete teacher
  deleteTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find teacher
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found"
        });
      }
      
      // Delete teacher
      await Teacher.findByIdAndDelete(id);
      
      res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteTeacher:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete teacher",
        error: error.message
      });
    }
  }
};

module.exports = adminDashboardController;