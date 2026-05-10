const express = require('express');
const router  = express.Router();
const { getNotifications, markRead, markAllRead, deleteNotification } = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/',              authenticate, getNotifications);
router.put('/read-all',      authenticate, markAllRead);
router.put('/:id/read',      authenticate, markRead);
router.delete('/:id',        authenticate, deleteNotification);

module.exports = router;