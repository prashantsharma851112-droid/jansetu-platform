const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getUserNotifications);
router.put('/mark-read/:id', authenticate, markAsRead);

module.exports = router;
