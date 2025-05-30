const jwt = require('jsonwebtoken');
const Student = require('../models/student');

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

module.exports = { protect };