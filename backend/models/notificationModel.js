const db = require('../config/database');

class NotificationModel {
  // Create notifications table
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        user_type ENUM('mill', 'admin') NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'success', 'warning', 'error', 'price_update', 'mill_update', 'stock_update', 'license_update') DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        related_id INT NULL,
        related_type VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id, user_type),
        INDEX idx_read (is_read),
        INDEX idx_created (created_at)
      )
    `;
    
    try {
      await db.query(query);
      console.log('✅ Notifications table ready');
    } catch (error) {
      console.error('❌ Error creating notifications table:', error);
      throw error;
    }
  }

  // Create a notification
  static async create({ user_id, user_type, title, message, type = 'info', related_id = null, related_type = null }) {
    const query = `
      INSERT INTO notifications (user_id, user_type, title, message, type, related_id, related_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const [result] = await db.query(query, [user_id, user_type, title, message, type, related_id, related_type]);
      return { id: result.insertId, success: true };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create notification for all mills
  static async createForAllMills({ title, message, type = 'info', related_id = null, related_type = null }) {
    try {
      // Get all mill user IDs - users table doesn't have 'role' column, all users in 'users' table are mills
      const [mills] = await db.query('SELECT id FROM users');
      
      console.log(`📢 Creating notifications for ${mills.length} mill users`);
      
      const promises = mills.map(mill => 
        this.create({
          user_id: mill.id,
          user_type: 'mill',
          title,
          message,
          type,
          related_id,
          related_type
        })
      );
      
      await Promise.all(promises);
      console.log(`✅ Successfully created ${mills.length} notifications for all mills`);
      return { success: true, count: mills.length };
    } catch (error) {
      console.error('Error creating notifications for all mills:', error);
      throw error;
    }
  }

  // Get notifications for a user
  static async getByUser(user_id, user_type, limit = 50) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = ? AND user_type = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    
    try {
      const [notifications] = await db.query(query, [user_id, user_type, limit]);
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount(user_id, user_type) {
    const query = `
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ? AND user_type = ? AND is_read = FALSE
    `;
    
    try {
      const [result] = await db.query(query, [user_id, user_type]);
      return result[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Mark as read
  static async markAsRead(id, user_id) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = ? AND user_id = ?
    `;
    
    try {
      const [result] = await db.query(query, [id, user_id]);
      return { success: result.affectedRows > 0 };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all as read
  static async markAllAsRead(user_id, user_type) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = ? AND user_type = ? AND is_read = FALSE
    `;
    
    try {
      const [result] = await db.query(query, [user_id, user_type]);
      return { success: true, count: result.affectedRows };
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  // Delete a notification
  static async delete(id, user_id) {
    const query = `
      DELETE FROM notifications
      WHERE id = ? AND user_id = ?
    `;
    
    try {
      const [result] = await db.query(query, [id, user_id]);
      return { success: result.affectedRows > 0 };
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Delete all for user
  static async deleteAll(user_id, user_type) {
    const query = `
      DELETE FROM notifications
      WHERE user_id = ? AND user_type = ?
    `;
    
    try {
      const [result] = await db.query(query, [user_id, user_type]);
      return { success: true, count: result.affectedRows };
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationModel;
