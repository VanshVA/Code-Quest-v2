const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/login', adminAuthController.login);

// Protected routes
router.get('/profile', protectAdmin, adminAuthController.getProfile);

module.exports = router;