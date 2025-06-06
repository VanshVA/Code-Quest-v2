const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const generalController = require('../controllers/generalController');

// Public routes that don't require authentication
router.get('/statistics', generalController.getStatistics);
router.get('/competitions/all', generalController.getAllCompetitions);
router.get('/feedback', generalController.getAllFeedback);
router.post('/feedback', adminDashboardController.createFeedback);
router.get('/results', generalController.getAllResults);

module.exports = router;