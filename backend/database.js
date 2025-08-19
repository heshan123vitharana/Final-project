require('dotenv').config();
const mysql = require('mysql2');

console.log('Loading database.js...');
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

console.log('Pool created, testing connection...');

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('Error details:', err);
    } else {
        console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
        connection.release();
    }
});

// Test a simple query
async function testQuery() {
    try {
        console.log('Testing simple query...');
        const [rows] = await pool.promise().execute('SELECT 1 as test');
        console.log('✅ Simple query successful:', rows);
    } catch (error) {
        console.error('❌ Simple query failed:', error.message);
    }
}

// Run test query after a short delay
setTimeout(testQuery, 1000);

module.exports = pool.promise();