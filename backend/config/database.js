require('dotenv').config();

// Check if we should use SQLite
const useSQLite = process.env.USE_SQLITE === 'true';

if (useSQLite) {
  // SQLite configuration
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  
  const dbPath = path.join(__dirname, '..', 'paddy_management.db');
  console.log('🔧 SQLite Database config loaded:', {
    path: dbPath,
    exists: require('fs').existsSync(dbPath)
  });
  
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ SQLite connection failed:', err.message);
    } else {
      console.log('✅ Connected to SQLite database successfully');
    }
  });
  
  // SQLite query wrapper to match MySQL interface
  const sqlitePool = {
    execute: (query, params = []) => {
      return new Promise((resolve, reject) => {
        // Convert MySQL syntax to SQLite where needed
        let sqliteQuery = query
          .replace(/AUTO_INCREMENT/g, 'AUTOINCREMENT')
          .replace(/INT AUTO_INCREMENT/g, 'INTEGER')
          .replace(/ENUM\([^)]+\)/g, 'TEXT')
          .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'DATETIME DEFAULT CURRENT_TIMESTAMP');
        
        if (sqliteQuery.toLowerCase().includes('select')) {
          db.all(sqliteQuery, params, (err, rows) => {
            if (err) reject(err);
            else resolve([rows]);
          });
        } else {
          db.run(sqliteQuery, params, function(err) {
            if (err) reject(err);
            else resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
          });
        }
      });
    }
  };
  
  module.exports = sqlitePool;
} else {
  // MySQL configuration (original code)
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
        email VARCHAR(191) NOT NULL UNIQUE,
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
        username VARCHAR(191) NOT NULL UNIQUE,
        email VARCHAR(191) NOT NULL UNIQUE,
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

    // Enhanced Features - Sri Lanka Districts Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS sri_lanka_districts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        province VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Sri Lanka districts table ready');

    // Enhanced Features - District Paddy Prices Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS district_paddy_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        district_name VARCHAR(100) NOT NULL,
        paddy_type ENUM('Nadu - White', 'Nadu - Red', 'Samba', 'Kiri Samba') NOT NULL,
        paddy_condition ENUM('Wet', 'Dry') NOT NULL,
        price_per_kg DECIMAL(10,2) NOT NULL,
        effective_date DATE NOT NULL,
        created_by INT,
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_district_type (district_name, paddy_type),
        INDEX idx_status_date (status, effective_date)
      )
    `);
    console.log('✅ District paddy prices table ready');

    // Enhanced Features - Add certificate and password management columns
    const enhancedUserColumns = [
      'password_change_required BOOLEAN DEFAULT FALSE',
      'password_expires_at TIMESTAMP NULL',
      'password_changed_at TIMESTAMP NULL',
      'reset_token VARCHAR(255) DEFAULT NULL',
      'reset_token_expires TIMESTAMP NULL'
    ];
    
    for (const column of enhancedUserColumns) {
      const columnName = column.split(' ')[0];
      try {
        await pool.execute(`ALTER TABLE users ADD COLUMN ${column}`);
        console.log(`✅ Added column ${columnName} to users table`);
      } catch (error) {
        if (!error.message.includes('Duplicate column name')) {
          console.log(`ℹ️ Column ${columnName} might already exist`);
        }
      }
    }

    const enhancedLicenseColumns = [
      'certificate_path VARCHAR(255)',
      'certificate_generated_at TIMESTAMP NULL'
    ];
    
    for (const column of enhancedLicenseColumns) {
      const columnName = column.split(' ')[0];
      try {
        await pool.execute(`ALTER TABLE mill_licenses ADD COLUMN ${column}`);
        console.log(`✅ Added column ${columnName} to mill_licenses table`);
      } catch (error) {
        if (!error.message.includes('Duplicate column name')) {
          console.log(`ℹ️ Column ${columnName} might already exist`);
        }
      }
    }

    // Insert Sri Lankan districts data
    const districts = [
      ['Colombo', 'Western Province'],
      ['Gampaha', 'Western Province'],
      ['Kalutara', 'Western Province'],
      ['Kandy', 'Central Province'],
      ['Matale', 'Central Province'],
      ['Nuwara Eliya', 'Central Province'],
      ['Galle', 'Southern Province'],
      ['Matara', 'Southern Province'],
      ['Hambantota', 'Southern Province'],
      ['Jaffna', 'Northern Province'],
      ['Kilinochchi', 'Northern Province'],
      ['Mannar', 'Northern Province'],
      ['Mullaitivu', 'Northern Province'],
      ['Vavuniya', 'Northern Province'],
      ['Puttalam', 'North Western Province'],
      ['Kurunegala', 'North Western Province'],
      ['Anuradhapura', 'North Central Province'],
      ['Polonnaruwa', 'North Central Province'],
      ['Badulla', 'Uva Province'],
      ['Monaragala', 'Uva Province'],
      ['Ratnapura', 'Sabaragamuwa Province'],
      ['Kegalle', 'Sabaragamuwa Province'],
      ['Ampara', 'Eastern Province'],
      ['Batticaloa', 'Eastern Province'],
      ['Trincomalee', 'Eastern Province']
    ];

    for (const [name, province] of districts) {
      try {
        await pool.execute(
          'INSERT IGNORE INTO sri_lanka_districts (name, province) VALUES (?, ?)',
          [name, province]
        );
      } catch (error) {
        console.log(`ℹ️ District ${name} might already exist`);
      }
    }
    console.log('✅ Sri Lankan districts data loaded');

    // Insert sample district paddy prices
    const samplePrices = [
      ['Hambantota', 'Nadu - White', 'Dry', 85.00],
      ['Hambantota', 'Nadu - White', 'Wet', 75.00],
      ['Hambantota', 'Kiri Samba', 'Dry', 95.00],
      ['Hambantota', 'Kiri Samba', 'Wet', 85.00],
      ['Colombo', 'Nadu - White', 'Dry', 90.00],
      ['Colombo', 'Nadu - White', 'Wet', 80.00],
      ['Kandy', 'Samba', 'Dry', 100.00],
      ['Kandy', 'Samba', 'Wet', 90.00],
      ['Galle', 'Nadu - Red', 'Dry', 88.00],
      ['Galle', 'Nadu - Red', 'Wet', 78.00]
    ];

    for (const [district, type, condition, price] of samplePrices) {
      try {
        await pool.execute(
          'INSERT IGNORE INTO district_paddy_prices (district_name, paddy_type, paddy_condition, price_per_kg, effective_date) VALUES (?, ?, ?, ?, CURDATE())',
          [district, type, condition, price]
        );
      } catch (error) {
        console.log(`ℹ️ Price entry for ${district} ${type} ${condition} might already exist`);
      }
    }
    console.log('✅ Sample district paddy prices loaded');

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

    // Gallery table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500) NOT NULL,
        image_data LONGTEXT,
        category VARCHAR(100) DEFAULT 'general',
        alt_text VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Gallery images table ready');

    // Services table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100),
        image_url VARCHAR(500),
        category ENUM('service', 'feature') DEFAULT 'service',
        priority INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Services table ready');

    // Excellence/Achievements table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS excellence_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type ENUM('achievement', 'certification', 'award', 'milestone') NOT NULL,
        date_achieved DATE,
        image_url VARCHAR(500),
        certificate_url VARCHAR(500),
        priority INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Excellence items table ready');

    // Initialize stock tables
    const StockModel = require('../models/stockModel');
    await StockModel.initializeStockTables();

    console.log('✅ Stock tables initialized successfully');

    console.log('✅ MySQL database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Initialize tables after a short delay
setTimeout(initializeTables, 1000);

module.exports = pool;
}