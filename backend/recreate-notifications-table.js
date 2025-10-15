const mysql = require('mysql2/promise');

async function recreateNotificationsTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'paddy_management'
  });

  try {
    console.log('🗑️  Dropping old notifications table...');
    await connection.query('DROP TABLE IF EXISTS notifications');
    
    console.log('📝 Creating new notifications table with correct schema...');
    await connection.query(`
      CREATE TABLE notifications (
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
    `);
    
    console.log('✅ Notifications table recreated successfully!');
    
    // Verify
    const [columns] = await connection.query('DESCRIBE notifications');
    console.log('\n📋 New table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

recreateNotificationsTable();
