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
router.post('/competitions/:id/archive', protectTeacher, isTeacher, teacherDashboardController.archiveCompetition);
router.post('/competitions/:id/toggle-status', protectTeacher, isTeacher, teacherDashboardController.toggleCompetitionStatus);

//========================= COMPETITION RESULTS ROUTES ================================//
router.get('/competitions/:competitionId/results', protectTeacher, isTeacher, teacherDashboardController.getCompetitionResults);
// router.put('/competitions/:competitionId/winners', protectTeacher, isTeacher, teacherDashboardController.setCompetitionWinners);
router.get('/competitions/:competitionId/students', protectTeacher, isTeacher, teacherDashboardController.getCompetitionStudents);
router.get('/competitions/:competitionId/submissions', protectTeacher, isTeacher, teacherDashboardController.getAllSubmissionsForCompetition);
router.get('/competitions/:competitionId/students/:studentId/submission', protectTeacher, isTeacher, teacherDashboardController.getStudentSubmission);
// router.put('/submissions/:submissionId/grade', protectTeacher, isTeacher, teacherDashboardController.gradeSubmission);

//========================= DASHBOARD STATISTICS ROUTE ================================//
router.get('/dashboard-stats', protectTeacher, isTeacher, teacherDashboardController.getDashboardStatistics);

module.exports = router;