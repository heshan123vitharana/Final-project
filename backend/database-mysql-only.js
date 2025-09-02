require('dotenv').config();
const mysql = require('mysql2');

console.log('🔧 FORCING MySQL database connection...');
console.log('Database config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? '***hidden***' : 'NOT SET'
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('MySQL pool created, testing connection...');

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err.message);
        console.error('Error details:', err);
    } else {
        console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
        connection.release();
    }
});

// Initialize MySQL tables
const initializeTables = async () => {
    try {
        console.log('🔧 Initializing MySQL database tables...');
        
        // Users table
        await pool.promise().execute(`
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
        await pool.promise().execute(`
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

        // Insert default admin (use INSERT IGNORE to avoid duplicates)
        await pool.promise().execute(`
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

// Test connection and initialize tables
async function testAndInitialize() {
    try {
        console.log('Testing simple query...');
        const [rows] = await pool.promise().execute('SELECT 1 as test');
        console.log('✅ Simple query successful:', rows);
        
        // Initialize tables after successful connection
        await initializeTables();
    } catch (error) {
        console.error('❌ Database connection or initialization failed:', error.message);
    }
}

// Run test and initialization after a short delay
setTimeout(testAndInitialize, 1000);

module.exports = pool.promise();