const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Admin auth controller methods
const adminAuthController = {
  // Login for admin
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
      }

      // Find admin by email
      const admin = await Admin.findOne({ adminEmail: email });

      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Check password
      const isPasswordMatch = await bcrypt.compare(password, admin.adminPassword);

      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken(admin._id);

      // Update login time
      admin.loginTime = new Date();
      await admin.save();

      res.status(200).json({
        success: true,
        token,
        admin: {
          _id: admin._id,
          name: admin.adminName,
          email: admin.adminEmail,
          role: admin.role,
          loginTime: admin.loginTime,
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get current admin profile
  getProfile: async (req, res) => {
    try {
      const admin = await Admin.findById(req.admin._id).select('-adminPassword');
      
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
      
      res.status(200).json({
        success: true,
        admin
      });
    } catch (error) {
      console.error('Get admin profile error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

module.exports = adminAuthController;