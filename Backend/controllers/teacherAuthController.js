const Teacher = require('../models/teacher');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendOTP = async (email, otp, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #bc4037;">Code-Quest</h2>
          </div>
          <p>${message}</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h3>
          </div>
          <p>This OTP is valid for 10 minutes only.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; color: #777; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Code-Quest, KITPS. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Teacher authentication controller methods
const teacherAuthController = {
  // Login for teacher
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
      }

      // Find teacher by email
      const teacher = await Teacher.findOne({ teacherEmail: email });

      if (!teacher) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Check password
      const isPasswordMatch = await bcrypt.compare(password, teacher.teacherPassword);

      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Update login time
      teacher.loginTime.push(new Date());
      await teacher.save();

      // Generate token
      const token = generateToken(teacher._id);

      res.status(200).json({
        success: true,
        token,
        teacher: {
          _id: teacher._id,
          firstName: teacher.teacherFirstName,
          lastName: teacher.teacherLastName,
          email: teacher.teacherEmail,
          role: teacher.role,
          image: teacher.teacherImage
        }
      });
    } catch (error) {
      console.error('Teacher login error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Request OTP for password reset
  requestPasswordResetOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      // Find teacher by email
      const teacher = await Teacher.findOne({ teacherEmail: email });

      if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher not found with this email' });
      }

      // Generate OTP and set expiry
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      teacher.otp = otp;
      teacher.otpExpires = otpExpires;
      await teacher.save();

      // Send OTP via email
      const emailSent = await sendOTP(
        email, 
        otp, 
        'Password Reset OTP for Code-Quest',
        `Hello ${teacher.teacherFirstName},<br><br>You requested to reset your password. Please use the following OTP (One-Time Password) to proceed:`
      );

      if (!emailSent) {
        return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
      }

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email for password reset',
        teacher: {
          _id: teacher._id,
          email: teacher.teacherEmail
        }
      });
    } catch (error) {
      console.error('Password reset OTP request error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Verify OTP for password reset
  verifyPasswordResetOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
      }

      // Find the teacher with the given email and valid OTP
      const teacher = await Teacher.findOne({
        teacherEmail: email,
        otp: otp,
        otpExpires: { $gt: Date.now() }
      });

      if (!teacher) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      // Generate reset token (temporary for password reset page)
      const resetToken = jwt.sign({ id: teacher._id, purpose: 'password-reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        resetToken,
        teacher: {
          _id: teacher._id,
          email: teacher.teacherEmail
        }
      });
    } catch (error) {
      console.error('Password reset OTP verification error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Reset password after OTP verification
  resetPassword: async (req, res) => {
    try {
      const { email, newPassword, resetToken } = req.body;

      if (!email || !newPassword || !resetToken) {
        return res.status(400).json({ success: false, message: 'Email, new password, and reset token are required' });
      }

      // Verify reset token
      let decoded;
      try {
        decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (decoded.purpose !== 'password-reset') {
          throw new Error('Invalid token purpose');
        }
      } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired reset token' });
      }

      // Find teacher
      const teacher = await Teacher.findOne({
        _id: decoded.id,
        teacherEmail: email
      });

      if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
      }

      // Update password
      teacher.teacherPassword = newPassword;
      teacher.otp = undefined;
      teacher.otpExpires = undefined;
      await teacher.save();

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get current teacher profile
  getProfile: async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.teacher._id).select('-teacherPassword -otp -otpExpires');
      
      if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
      }
      
      res.status(200).json({
        success: true,
        teacher
      });
    } catch (error) {
      console.error('Get teacher profile error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

module.exports = teacherAuthController;