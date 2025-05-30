const Student = require('../models/student');
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

// Controller methods
const studentAuthController = {
  // Request OTP for signup
  requestSignupOTP: async (req, res) => {
    try {
      const { studentEmail, studentFirstName, studentLastName, studentPassword } = req.body;

      if (!studentEmail || !studentFirstName || !studentLastName || !studentPassword) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields' });
      }

      // Check if student already exists
      const existingStudent = await Student.findOne({ studentEmail });
      if (existingStudent) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      // Generate and store OTP temporarily
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // Store temporary user data and OTP in a new student document
      const tempStudent = new Student({
        studentEmail,
        studentFirstName,
        studentLastName,
        studentPassword,
        otp,
        otpExpires,
        allowance: false // Account not activated until OTP verification
      });

      await tempStudent.save();

      // Send OTP via email
      const emailSent = await sendOTP(
        studentEmail, 
        otp, 
        'Verify Your Email for Code-Quest Registration',
        `Hello ${studentFirstName},<br><br>Thank you for registering with Code-Quest. To complete your registration, please use the following OTP (One-Time Password):`
      );

      if (!emailSent) {
        return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
      }

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email for verification',
        student: {
          _id: tempStudent._id,
          email: tempStudent.studentEmail
        }
      });
    } catch (error) {
      console.error('Signup OTP request error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Verify OTP and complete signup
  verifySignupOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
      }

      // Find the student with the given email and valid OTP
      const student = await Student.findOne({
        studentEmail: email,
        otp: otp,
        otpExpires: { $gt: Date.now() }
      });

      if (!student) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      // Activate the student account
      student.allowance = true;
      student.otp = undefined;
      student.otpExpires = undefined;
      student.loginTime.push(new Date());
      
      await student.save();

      // Generate token
      const token = generateToken(student._id);

      res.status(200).json({
        success: true,
        message: 'Account verified successfully',
        token,
        student: {
          _id: student._id,
          firstName: student.studentFirstName,
          lastName: student.studentLastName,
          email: student.studentEmail,
          role: student.role,
          image: student.studentImage,
        }
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Resend OTP for signup
  resendSignupOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      // Find the student with the given email
      const student = await Student.findOne({ studentEmail: email, allowance: false });

      if (!student) {
        return res.status(400).json({ success: false, message: 'Student not found or already verified' });
      }

      // Generate new OTP and update expiry
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      student.otp = otp;
      student.otpExpires = otpExpires;
      await student.save();

      // Send OTP via email
      const emailSent = await sendOTP(
        email, 
        otp, 
        'Your New OTP for Code-Quest Registration',
        `Hello ${student.studentFirstName},<br><br>Here is your new OTP (One-Time Password) to complete your registration:`
      );

      if (!emailSent) {
        return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
      }

      res.status(200).json({
        success: true,
        message: 'New OTP sent to your email'
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
      }

      // Find student by email
      const student = await Student.findOne({ studentEmail: email });

      if (!student) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Check if account is activated
      if (!student.allowance) {
        return res.status(401).json({ success: false, message: 'Account not verified. Please verify your email first.' });
      }

      // Check password
      const isPasswordMatch = await bcrypt.compare(password, student.studentPassword);

      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Update login time
      student.loginTime.push(new Date());
      await student.save();

      // Generate token
      const token = generateToken(student._id);

      res.status(200).json({
        success: true,
        token,
        student: {
          _id: student._id,
          firstName: student.studentFirstName,
          lastName: student.studentLastName,
          email: student.studentEmail,
          role: student.role,
          image: student.studentImage,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
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

      // Find student by email
      const student = await Student.findOne({ studentEmail: email });

      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found with this email' });
      }

      // Generate OTP and set expiry
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      student.otp = otp;
      student.otpExpires = otpExpires;
      await student.save();

      // Send OTP via email
      const emailSent = await sendOTP(
        email, 
        otp, 
        'Password Reset OTP for Code-Quest',
        `Hello ${student.studentFirstName},<br><br>You requested to reset your password. Please use the following OTP (One-Time Password) to proceed:`
      );

      if (!emailSent) {
        return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
      }

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email for password reset',
        student: {
          _id: student._id,
          email: student.studentEmail
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

      // Find the student with the given email and valid OTP
      const student = await Student.findOne({
        studentEmail: email,
        otp: otp,
        otpExpires: { $gt: Date.now() }
      });

      if (!student) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      // Generate reset token (temporary for password reset page)
      const resetToken = jwt.sign({ id: student._id, purpose: 'password-reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        resetToken,
        student: {
          _id: student._id,
          email: student.studentEmail
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

      // Find student
      const student = await Student.findOne({
        _id: decoded.id,
        studentEmail: email
      });

      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

        // Check if new password is the same as old password
        const isSamePassword = await bcrypt.compare(newPassword, student.studentPassword);
        if (isSamePassword) {
            return res.status(400).json({ success: false, message: 'New password cannot be the same as the old password' });
            }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      student.studentPassword = hashedPassword;
      student.otp = undefined;
      student.otpExpires = undefined;
      await student.save();

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get current student profile
  getProfile: async (req, res) => {
    try {
      const student = await Student.findById(req.student._id).select('-studentPassword -otp -otpExpires');
      
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      
      res.status(200).json({
        success: true,
        student
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

module.exports = studentAuthController;