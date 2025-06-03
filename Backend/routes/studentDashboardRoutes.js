const express = require('express');
const router = express.Router();
const studentDashboardController = require('../controllers/studentDashboardController');
const { protect } = require('../middlewares/authMiddleware');

//========================= STUDENT PROFILE ROUTES ================================//
router.get('/profile', protect, studentDashboardController.getProfile);
router.put('/profile', protect, studentDashboardController.updateProfile);
router.put('/password', protect, studentDashboardController.updatePassword);

//========================= COMPETITION ROUTES ================================//
router.get('/competitions/upcoming', protect, studentDashboardController.getUpcomingCompetitions);
router.get('/competitions/active', protect, studentDashboardController.getActiveCompetitions);
router.get('/competitions/joined', protect, studentDashboardController.getJoinedCompetitions);
router.post('/competitions/:id/join', protect, studentDashboardController.joinCompetition);
router.post('/competitions/:id/submit', protect, studentDashboardController.submitCompetitionAnswers);
router.post('/competitions/:id/disqualify', protect, studentDashboardController.disqualifyStudent);
router.post('/competitions/disqualified', protect, studentDashboardController.getDisqualifiedStudent);

//========================= STUDENT RESULTS ROUTES ================================//
router.get('/results/:id', protect, studentDashboardController.  getAllResults);

//========================= DASHBOARD STATISTICS ROUTE ================================//

module.exports = router;