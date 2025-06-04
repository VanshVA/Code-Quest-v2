const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');

router.post('/feedback', adminDashboardController.createFeedback);

module.exports = router;