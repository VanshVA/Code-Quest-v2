const express = require('express');
const router = express.Router();
const studentDashboardController = require('../controllers/studentDashboardController');
const { protect } = require('../middlewares/authMiddleware');

//========================= STUDENT PROFILE ROUTES ================================//
router.get('/profile', protect, studentDashboardController.getProfile);
router.put('/profile', protect, studentDashboardController.updateProfile);
router.put('/password', protect, studentDashboardController.updatePassword);

//========================= COMPETITION ROUTES ================================//
router.get('/competitions', protect, studentDashboardController.getAvailableCompetitions);
router.get('/competitions/:id/overview', protect, studentDashboardController.getCompetitionOverview);
router.get('/competitions/:id', protect, studentDashboardController.getCompetitionDetails);
router.post('/competitions/:id/join', protect, studentDashboardController.joinCompetition);
router.post('/competitions/:id/save', protect, studentDashboardController.saveCompetitionAnswers);
router.post('/competitions/:id/submit', protect, studentDashboardController.submitCompetitionAnswers);
router.get('/competitions/:competitionId/results', protect, studentDashboardController.getCompetitionResults);
router.get('/competitions/:competitionId/leaderboard', protect, studentDashboardController.getCompetitionLeaderboard);

//========================= DASHBOARD STATISTICS ROUTE ================================//
router.get('/dashboard-stats', protect, studentDashboardController.getDashboardStatistics);

module.exports = router;