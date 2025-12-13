const mysql = require('mysql2/promise');

const config = {
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '45rV2DvpEvko3BL.root',
    password: 'YSF2qfoH7iTSeuH0',
    database: 'test',
    ssl: {
        rejectUnauthorized: false
    }
};

async function initDB() {
    console.log('Connecting to TiDB Cloud...');
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('Connected successfully!');

        // 1. Create Leadership Table
        console.log('Creating/Checking leadership table...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS leadership (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url VARCHAR(255),
        email VARCHAR(255),
        linkedin_url VARCHAR(255),
        twitter_url VARCHAR(255),
        order_index INT DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // 2. Create Services Table
        console.log('Creating/Checking services table...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        icon VARCHAR(255),
        features JSON,
        priority INT DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // 3. Create Excellence Items Table
        console.log('Creating/Checking excellence_items table...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS excellence_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50),
        priority INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // 4. Create Gallery Categories Table
        console.log('Creating/Checking gallery_categories table...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS gallery_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        description TEXT,
        image_url VARCHAR(255),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        // 5. Create Gallery Images Table
        console.log('Creating/Checking gallery_images table...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT,
        file_name VARCHAR(255),
        file_path VARCHAR(255),
        file_size INT,
        mime_type VARCHAR(50),
        image_url LONGTEXT,
        is_active BOOLEAN DEFAULT 1,
        status VARCHAR(20) DEFAULT 'active',
        category VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE SET NULL
      )
    `);

        // 6. Alter Users Table (Add mill_district if missing)
        console.log('Checking users table for mill_district column...');
        try {
            const [columns] = await connection.execute("SHOW COLUMNS FROM users LIKE 'mill_district'");
            if (columns.length === 0) {
                console.log('Adding mill_district column to users table...');
                await connection.execute("ALTER TABLE users ADD COLUMN mill_district VARCHAR(255) AFTER district");
            } else {
                console.log('mill_district column already exists.');
            }
        } catch (err) {
            console.log('Error checking/altering users table:', err.message);
        }

        console.log('✅ Database schema initialization completed successfully!');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

initDB();
