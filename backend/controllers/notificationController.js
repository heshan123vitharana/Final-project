const NotificationModel = require('../models/notificationModel');

// Get notifications for current user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id || req.user?.userId;
    const userType = req.user?.role === 'admin' ? 'admin' : 'mill';
    const limit = parseInt(req.query.limit) || 50;

    console.log('🔔 Fetching notifications for:', { userId, userType, role: req.user?.role });

    if (!userId) {
      console.error('❌ No user ID found in token:', req.user);
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const notifications = await NotificationModel.getByUser(userId, userType, limit);
    const unreadCount = await NotificationModel.getUnreadCount(userId, userType);

    console.log(`✅ Found ${notifications.length} notifications, ${unreadCount} unread`);

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id || req.user?.userId;
    const userType = req.user?.role === 'admin' ? 'admin' : 'mill';

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const count = await NotificationModel.getUnreadCount(userId, userType);

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.sub || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const result = await NotificationModel.markAsRead(id, userId);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id || req.user?.userId;
    const userType = req.user?.role === 'admin' ? 'admin' : 'mill';

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const result = await NotificationModel.markAllAsRead(userId, userType);

    res.json({
      success: true,
      message: `${result.count} notifications marked as read`
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.sub || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const result = await NotificationModel.delete(id, userId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Notification deleted'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// Delete all notifications
const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id || req.user?.userId;
    const userType = req.user?.role === 'admin' ? 'admin' : 'mill';

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const result = await NotificationModel.deleteAll(userId, userType);

    res.json({
      success: true,
      message: `${result.count} notifications deleted`
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all notifications',
      error: error.message
    });
  }
};

// Helper function to create notifications (can be called from other controllers)
const createNotification = async ({ user_id, user_type, title, message, type, related_id, related_type }) => {
  try {
    return await NotificationModel.create({ user_id, user_type, title, message, type, related_id, related_type });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Helper function to create notifications for all mills
const createNotificationForAllMills = async ({ title, message, type, related_id, related_type }) => {
  try {
    return await NotificationModel.createForAllMills({ title, message, type, related_id, related_type });
  } catch (error) {
    console.error('Error creating notification for all mills:', error);
    throw error;
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  createNotification,
  createNotificationForAllMills
};
