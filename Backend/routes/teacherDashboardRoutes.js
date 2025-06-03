const express = require('express');
const router = express.Router();
const teacherDashboardController = require('../controllers/teacherDashboardController');
const { protectTeacher, authorize } = require('../middlewares/authMiddleware');

// Teacher role middleware - ensures the user has the 'teacher' role
const isTeacher = authorize('teacher', 'senior_teacher'); // Including both teacher roles

//========================= TEACHER PROFILE ROUTES ================================//
router.get('/profile', protectTeacher, teacherDashboardController.getProfile);
router.put('/profile', protectTeacher, teacherDashboardController.updateProfile);
router.put('/password', protectTeacher, teacherDashboardController.updatePassword);

//========================= COMPETITION MANAGEMENT ROUTES ================================//
router.get('/competitions', protectTeacher, isTeacher, teacherDashboardController.getCompetitions);
router.get('/competitions/:id', protectTeacher, isTeacher, teacherDashboardController.getCompetitionById);
router.post('/competitions', protectTeacher, isTeacher, teacherDashboardController.createCompetition);
router.put('/competitions/:id', protectTeacher, isTeacher, teacherDashboardController.updateCompetition);
router.delete('/competitions/:id', protectTeacher, isTeacher, teacherDashboardController.deleteCompetition);
router.post('/competitions/:id/clone', protectTeacher, isTeacher, teacherDashboardController.cloneCompetition);
router.post('/competitions/:id/archive', protectTeacher, isTeacher, teacherDashboardController.toggleArchiveStatus);
router.post('/competitions/:id/toggle-status', protectTeacher, isTeacher, teacherDashboardController.toggleCompetitionStatus);

//========================= COMPETITION RESULTS ROUTES ================================//
router.get('/competitions/:submissionId/results', protectTeacher, isTeacher, teacherDashboardController.evaluateSubmission);
router.get('/competitions/results/:submissionId', protectTeacher, isTeacher, teacherDashboardController.getResultDetails);
router.get('/competitions/:competitionId/submissions', protectTeacher, isTeacher, teacherDashboardController.getCompetitionSubmissions);
router.get('/competitions/submissions/:submissionId', protectTeacher, isTeacher, teacherDashboardController.getSubmissionDetail);

//========================= DASHBOARD STATISTICS ROUTE ================================//
router.get('/dashboard-stats', protectTeacher, isTeacher, teacherDashboardController.getDashboardStats);

module.exports = router;