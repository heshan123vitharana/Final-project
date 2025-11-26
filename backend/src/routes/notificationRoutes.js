const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(requireAuth);

// Get all notifications for current user
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Mark all as read
router.put('/mark-all-read', markAllAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

// Delete all notifications
router.delete('/', deleteAllNotifications);

module.exports = router;
