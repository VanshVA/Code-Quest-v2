const express = require('express');
const router = express.Router();
const studentAuthController = require('../controllers/studentAuthController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.post('/request-signup-otp', studentAuthController.requestSignupOTP);
router.post('/verify-signup-otp', studentAuthController.verifySignupOTP);
router.post('/resend-signup-otp', studentAuthController.resendSignupOTP);
router.post('/login', studentAuthController.login);
router.post('/request-password-reset', studentAuthController.requestPasswordResetOTP);
router.post('/verify-password-reset-otp', studentAuthController.verifyPasswordResetOTP);
router.post('/reset-password', studentAuthController.resetPassword);

// Protected routes
router.get('/profile', protect, studentAuthController.getProfile);

module.exports = router;