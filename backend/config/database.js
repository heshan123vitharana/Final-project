require('dotenv').config();
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'paddy_management',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
};

console.log('🔧 MySQL Database config loaded:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  hasPassword: !!dbConfig.password
});

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool.getConnection()
  .then((connection) => {
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
  })
  .catch((error) => {
    console.error('❌ MySQL connection failed:', error.message);
  });

// Initialize database tables
const initializeTables = async () => {
  try {
    console.log('🔧 Initializing MySQL database tables...');
    
    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        business_type ENUM('private', 'government') NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        city VARCHAR(255),
        district VARCHAR(255),
        postal_code VARCHAR(10),
        mill_capacity VARCHAR(100),
        mill_location VARCHAR(255),
        license_number VARCHAR(100),
        registration_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add new columns to existing users table if they don't exist
    const columns = [
      'nic VARCHAR(20)',
      'address TEXT',
      'city VARCHAR(255)',
      'district VARCHAR(255)',
      'postal_code VARCHAR(10)',
      'mill_capacity VARCHAR(100)',
      'mill_location VARCHAR(255)',
      'license_number VARCHAR(100)',
      'registration_date DATE'
    ];
    
    for (const column of columns) {
      const columnName = column.split(' ')[0];
      try {
        await pool.execute(`ALTER TABLE users ADD COLUMN ${column}`);
        console.log(`✅ Added column ${columnName} to users table`);
      } catch (error) {
        // Column might already exist, ignore error
        if (!error.message.includes('Duplicate column name')) {
          console.log(`ℹ️ Column ${columnName} might already exist`);
        }
      }
    }
    console.log('✅ Users table ready');

    // Admin table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admin table ready');

    // Paddy prices table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS paddy_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        district VARCHAR(255) NOT NULL,
        province VARCHAR(255) NOT NULL,
        market VARCHAR(255) NOT NULL,
        variety VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL DEFAULT 'Wet',
        price_per_kg DECIMAL(10, 2) NOT NULL,
        previous_price DECIMAL(10, 2),
        currency VARCHAR(10) DEFAULT 'LKR',
        trend ENUM('up', 'down', 'flat') DEFAULT 'flat',
        price_change DECIMAL(10, 2) DEFAULT 0,
        availability VARCHAR(50) DEFAULT 'Available',
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Paddy prices table ready');

    // User profile photos table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_profile_photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        photo_data LONGTEXT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_size INT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_photo (user_id)
      )
    `);
    console.log('✅ User profile photos table ready');

    // Mill licenses table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS mill_licenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        application_number VARCHAR(50) NOT NULL UNIQUE,
        license_type VARCHAR(100) DEFAULT 'Standard Mill License',
        license_number VARCHAR(100) NULL,
        payment_receipt LONGTEXT NOT NULL,
        br_document LONGTEXT NOT NULL,
        comments TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_date TIMESTAMP NULL,
        rejected_date TIMESTAMP NULL,
        expiry_date TIMESTAMP NULL,
        approval_comments TEXT,
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_status (user_id, status),
        INDEX idx_application_number (application_number)
      )
    `);
    
    // Add new columns to existing mill_licenses table if they don't exist
    const licenseColumns = [
      'license_number VARCHAR(100)',
      'rejected_date TIMESTAMP NULL',
      'approval_comments TEXT',
      'rejection_reason TEXT'
    ];
    
    for (const column of licenseColumns) {
      const columnName = column.split(' ')[0];
      try {
        await pool.execute(`ALTER TABLE mill_licenses ADD COLUMN ${column}`);
        console.log(`✅ Added column ${columnName} to mill_licenses table`);
      } catch (error) {
        // Column might already exist, ignore error
        if (!error.message.includes('Duplicate column name')) {
          console.log(`ℹ️ Column ${columnName} might already exist`);
        }
      }
    }
    console.log('✅ Mill licenses table ready');

    // Insert default admin (use INSERT IGNORE to avoid duplicates)
    await pool.execute(`
      INSERT IGNORE INTO admin (username, email, password, status) 
      VALUES ('admin01', 'admin@paddy.lk', 'admin123', 'active')
    `);
    console.log('✅ Default admin user ready');

    // Insert test user for profile photo testing (use INSERT IGNORE to avoid duplicates)
    await pool.execute(`
      INSERT IGNORE INTO users (id, first_name, last_name, business_name, business_type, phone, email, password) 
      VALUES (1, 'Test', 'User', 'Test Mill', 'private', '0123456789', 'test@mill.lk', 'password123')
    `);
    console.log('✅ Test user ready');

    // Initialize stock tables
    const StockModel = require('../models/stockModel');
    await StockModel.initializeStockTables();

    console.log('✅ MySQL database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Initialize tables after a short delay
setTimeout(initializeTables, 1000);

module.exports = pool;