const express = require('express');
const router = express.Router();
const teacherAuthController = require('../controllers/teacherAuthController');
const { protectTeacher } = require('../middlewares/authMiddleware');

// Public routes
router.post('/login', teacherAuthController.login);
router.post('/request-password-reset', teacherAuthController.requestPasswordResetOTP);
router.post('/verify-password-reset-otp', teacherAuthController.verifyPasswordResetOTP);
router.post('/reset-password', teacherAuthController.resetPassword);

// Protected routes
router.get('/profile', protectTeacher, teacherAuthController.getProfile);

module.exports = router;