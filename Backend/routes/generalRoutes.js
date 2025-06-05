const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const generalController = require('../controllers/generalController');

// Public routes that don't require authentication
router.get('/competitions', generalController.fetchCompetitions);
router.get('/testimonials', generalController.fetchFeedbacks);
router.post('/feedback', adminDashboardController.createFeedback);

module.exports = router;