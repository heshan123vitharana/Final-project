const fetch = require('node-fetch');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'paddy_management'
};

const TEST_ADMIN = {
    username: 'test_verify_admin_logs',
    email: 'test_verify_logs@admin.com',
    password: 'password123'
};

async function runTest() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        // 1. Create Test Admin
        console.log('👤 Creating test admin...');
        const hashedPassword = await bcrypt.hash(TEST_ADMIN.password, 10);
        await connection.execute(
            'INSERT INTO admin (username, email, password, status) VALUES (?, ?, ?, ?)',
            [TEST_ADMIN.username, TEST_ADMIN.email, hashedPassword, 'active']
        );
        console.log('✅ Test admin created');

        // 2. Test Correct Password
        console.log('🔑 Testing correct password...');
        const response1 = await fetch('http://localhost:5000/api/admin/verify-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_ADMIN.email,
                password: TEST_ADMIN.password
            })
        });
        const data1 = await response1.json();
        console.log('Response 1:', data1);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        if (connection) {
            // 4. Cleanup
            console.log('🧹 Cleaning up...');
            await connection.execute('DELETE FROM admin WHERE email = ?', [TEST_ADMIN.email]);
            await connection.end();
            console.log('✅ Cleanup complete');
        }
    }
}

runTest();
