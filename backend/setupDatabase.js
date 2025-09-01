require('dotenv').config();
const mysql = require('mysql2/promise');

const setupDatabase = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('✅ Connected to database');

    // Admin table - THIS WAS MISSING!
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user
    await connection.execute(`
      INSERT IGNORE INTO admin (username, email, password, status) VALUES
      ('admin01', 'admin@paddy.lk', 'admin123', 'active')
    `);

    console.log('✅ Admin table created successfully');

    // Admin login log table - FIXED the db.execute to connection.execute
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_login_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        success TINYINT(1) NOT NULL,
        ip VARCHAR(50),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Admin login log table created successfully');

    // Paddy prices table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS paddy_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        district VARCHAR(100) NOT NULL,
        province VARCHAR(100) NOT NULL,
        market VARCHAR(100) NOT NULL,
        variety VARCHAR(100) NOT NULL,
        type ENUM('Wet', 'Dry') NOT NULL DEFAULT 'Wet',
        price_per_kg DECIMAL(10,2) NOT NULL,
        previous_price DECIMAL(10,2),
        currency VARCHAR(10) DEFAULT 'LKR',
        trend ENUM('up', 'down', 'flat') DEFAULT 'flat',
        price_change DECIMAL(10,2) DEFAULT 0,
        availability ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_district (district),
        INDEX idx_variety (variety),
        INDEX idx_status (status),
        INDEX idx_updated (updated_at)
      )
    `);

    // Insert sample paddy price data
    await connection.execute(`
      INSERT IGNORE INTO paddy_prices (id, district, province, market, variety, type, price_per_kg, previous_price, currency, trend, price_change, availability, status, description) VALUES
      (1, 'Colombo', 'Western', 'Pettah', 'Nadu', 'Wet', 210.00, 205.00, 'LKR', 'up', 5.00, 'High', 'Active', 'Premium white rice, highest quality grade'),
      (2, 'Kandy', 'Central', 'Good Shed', 'Samba', 'Wet', 245.00, 248.00, 'LKR', 'down', -3.00, 'Medium', 'Active', 'High quality samba rice'),
      (3, 'Galle', 'Southern', 'Galle Town', 'Nadu', 'Wet', 205.00, 205.00, 'LKR', 'flat', 0.00, 'Medium', 'Active', 'Standard quality nadu rice'),
      (4, 'Kurunegala', 'North Western', 'Kurunegala City', 'Keeri Samba', 'Wet', 270.00, 262.00, 'LKR', 'up', 8.00, 'High', 'Active', 'Premium keeri samba variety'),
      (5, 'Anuradhapura', 'North Central', 'Central Market', 'Nadu', 'Wet', 195.00, 192.00, 'LKR', 'up', 3.00, 'High', 'Active', 'Good quality nadu rice'),
      (6, 'Badulla', 'Uva', 'Badulla Market', 'Red Nadu', 'Wet', 220.00, 225.00, 'LKR', 'down', -5.00, 'Low', 'Active', 'Traditional red rice variety'),
      (7, 'Colombo', 'Western', 'Manning Market', 'Samba', 'Dry', 280.00, 275.00, 'LKR', 'up', 5.00, 'Medium', 'Active', 'Dry samba rice for storage'),
      (8, 'Gampaha', 'Western', 'Negombo', 'Nadu', 'Wet', 200.00, 198.00, 'LKR', 'up', 2.00, 'High', 'Active', 'Fresh nadu rice from coastal region'),
      (9, 'Kalutara', 'Western', 'Kalutara Market', 'Basmati', 'Dry', 350.00, 345.00, 'LKR', 'up', 5.00, 'Low', 'Active', 'Imported basmati quality rice'),
      (10, 'Ratnapura', 'Sabaragamuwa', 'Gem City Market', 'Samba', 'Wet', 230.00, 235.00, 'LKR', 'down', -5.00, 'Medium', 'Active', 'Local samba variety')
    `);

    console.log('✅ Paddy prices table created successfully');

    // Mill registration table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS mill_registration (
        id INT AUTO_INCREMENT PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Business types table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS business_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      INSERT IGNORE INTO business_types (id, name, description) VALUES
      (1, 'Rice Mill', 'Processing and milling of rice'),
      (2, 'Flour Mill', 'Processing and milling of wheat and other grains'),
      (3, 'Oil Mill', 'Processing of oil seeds'),
      (4, 'Spice Mill', 'Processing and grinding of spices')
    `);

    // Mill-business types junction table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS mill_business_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mill_id INT NOT NULL,
        business_type_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_mill_business_type (mill_id, business_type_id)
      )
    `);

    // Users table for registration/login
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        business_type ENUM('private','government') NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('🎉 All tables created successfully');
    
  } catch (err) {
    console.error('❌ Database setup error:', err.message);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
};

setupDatabase();