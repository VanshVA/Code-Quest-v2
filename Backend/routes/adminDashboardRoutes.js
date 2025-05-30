const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { protectAdmin, authorize } = require('../middlewares/authMiddleware');

// Teacher management routes - all protected by admin authentication
router.get('/teachers', protectAdmin, authorize('admin'), adminDashboardController.getAllTeachers);
router.get('/teachers/:id', protectAdmin, authorize('admin'), adminDashboardController.getTeacherById);
router.post('/teachers', protectAdmin, authorize('admin'), adminDashboardController.createTeacher);
router.put('/teachers/:id', protectAdmin, authorize('admin'), adminDashboardController.updateTeacher);
router.delete('/teachers/:id', protectAdmin, authorize('admin'), adminDashboardController.deleteTeacher);

// Student management routes
// router.get('/students', protectAdmin, authorize('admin'), adminDashboardController.getAllStudents);
// router.get('/students/:id', protectAdmin, authorize('admin'), adminDashboardController.getStudentById);
// router.post('/students', protectAdmin, authorize('admin'), adminDashboardController.createStudent);
// router.put('/students/:id', protectAdmin, authorize('admin'), adminDashboardController.updateStudent);
// router.delete('/students/:id', protectAdmin, authorize('admin'), adminDashboardController.deleteStudent);

// // Competition management routes
// router.get('/competitions', protectAdmin, authorize('admin'), adminDashboardController.getAllCompetitions);
// router.get('/competitions/:id', protectAdmin, authorize('admin'), adminDashboardController.getCompetitionById);
// router.post('/competitions', protectAdmin, authorize('admin'), adminDashboardController.createCompetition);
// router.put('/competitions/:id', protectAdmin, authorize('admin'), adminDashboardController.updateCompetition);
// router.delete('/competitions/:id', protectAdmin, authorize('admin'), adminDashboardController.deleteCompetition);

// // Results management routes
// router.get('/results', protectAdmin, authorize('admin'), adminDashboardController.getAllResults);
// router.get('/results/:id', protectAdmin, authorize('admin'), adminDashboardController.getResultById);

// // Admin profile routes
// router.get('/profile', protectAdmin, adminDashboardController.getProfile);
// router.put('/profile', protectAdmin, adminDashboardController.updateProfile);
// router.put('/password', protectAdmin, adminDashboardController.updatePassword);

// // Dashboard statistics routes
// router.get('/statistics', protectAdmin, adminDashboardController.getDashboardStatistics);
// router.get('/recent-activities', protectAdmin, adminDashboardController.getRecentActivities);

module.exports = router;