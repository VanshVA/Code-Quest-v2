const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Admin = require('../models/admin');

// Protect student routes
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get student from token
    const student = await Student.findById(decoded.id).select('-studentPassword');
    
    if (!student) {
      return res.status(401).json({ success: false, message: 'Not authorized, student not found' });
    }
    
    // Check if student account is active
    if (!student.allowance) {
      return res.status(401).json({ success: false, message: 'Account is not verified or has been disabled' });
    }
    
    req.student = student;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Protect teacher routes
const protectTeacher = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get teacher from token
    const teacher = await Teacher.findById(decoded.id).select('-teacherPassword');
    
    if (!teacher) {
      return res.status(401).json({ success: false, message: 'Not authorized, teacher not found' });
    }
    
    req.teacher = teacher;
    next();
  } catch (error) {
    console.error('Teacher auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Protect admin routes
const protectAdmin = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get admin from token
    const admin = await Admin.findById(decoded.id).select('-adminPassword');
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    let user;
    
    if (req.student) {
      user = req.student;
    } else if (req.teacher) {
      user = req.teacher;
    } else if (req.admin) {
      user = req.admin;
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, no user found' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${user.role} is not authorized to access this resource` 
      });
    }
    
    next();
  };
};

module.exports = { protect, protectTeacher, protectAdmin, authorize };