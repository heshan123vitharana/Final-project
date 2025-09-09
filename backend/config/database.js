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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
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

    // Insert default admin (use INSERT IGNORE to avoid duplicates)
    await pool.execute(`
      INSERT IGNORE INTO admin (username, email, password, status) 
      VALUES ('admin01', 'admin@paddy.lk', 'admin123', 'active')
    `);
    console.log('✅ Default admin user ready');

    console.log('✅ MySQL database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Initialize tables after a short delay
setTimeout(initializeTables, 1000);

module.exports = pool;