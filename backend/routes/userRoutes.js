const express = require('express');
const router = express.Router();
const { updateProfile, uploadResume, getAllStudents, getStudentById } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Student routes
router.put('/profile', authenticate, updateProfile);
router.post('/resume', authenticate, upload.single('resume'), uploadResume);

// Admin routes
router.get('/', authenticate, authorize('admin'), getAllStudents);
router.get('/:id', authenticate, authorize('admin'), getStudentById);

module.exports = router;