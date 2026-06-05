const express = require('express');
const router = express.Router();
const {
  applyToRole, getMyApplications, getAllApplications,
  updateApplicationStatus, getApplicationById, withdrawApplication,
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
 
router.post('/', authenticate, authorize('student'), applyToRole);
router.get('/my', authenticate, authorize('student'), getMyApplications);
router.get('/', authenticate, authorize('admin'), getAllApplications);
router.get('/:id', authenticate, getApplicationById);
router.put('/:id/status', authenticate, authorize('admin'), updateApplicationStatus);
router.delete('/:id', authenticate, authorize('student'), withdrawApplication);
 
module.exports = router;
 