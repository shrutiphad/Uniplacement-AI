const express = require('express');
const router  = express.Router();
const {
  analyzeResume, analyzeJD, generateInterviewPrep,
  mockInterviewChat, findSimilarResumes, getMyAnalyses,
  aiRateLimiter,
} = require('../controllers/aiController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/analyze-resume',          authenticate, authorize('student'), aiRateLimiter, analyzeResume);
router.post('/generate-interview-prep', authenticate, authorize('student'), aiRateLimiter, generateInterviewPrep);
router.post('/mock-interview',          authenticate, authorize('student'), aiRateLimiter, mockInterviewChat);
router.get('/my-analyses',              authenticate, authorize('student'), getMyAnalyses);
router.post('/analyze-jd',             authenticate, analyzeJD);
router.post('/find-similar-resumes',   authenticate, authorize('admin'), findSimilarResumes);

module.exports = router;