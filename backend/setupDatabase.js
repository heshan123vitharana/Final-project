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