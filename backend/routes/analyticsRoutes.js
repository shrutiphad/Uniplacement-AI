const express = require('express');
const router = express.Router();
const {
  getAdminOverview, getDepartmentParticipation,
  getApplicationsPerCompany, getFitScoreDistribution,
  getPlacementTrends, getStudentAnalytics,
} = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Admin analytics
router.get('/admin/overview', authenticate, authorize('admin'), getAdminOverview);
router.get('/admin/department-participation', authenticate, authorize('admin'), getDepartmentParticipation);
router.get('/admin/applications-per-company', authenticate, authorize('admin'), getApplicationsPerCompany);
router.get('/admin/fit-score-distribution', authenticate, authorize('admin'), getFitScoreDistribution);
router.get('/admin/placement-trends', authenticate, authorize('admin'), getPlacementTrends);

// Student analytics
router.get('/student/me', authenticate, authorize('student'), getStudentAnalytics);

module.exports = router;