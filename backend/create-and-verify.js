require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/config/database');

async function createAndVerifyUser() {
    try {
        console.log('🔧 Creating test user...\n');

        // Hash password
        const passwordHash = await bcrypt.hash('Test@123', 10);

        // 1. Insert user
        const [result] = await db.execute(
            `INSERT INTO users (first_name, last_name, business_name, business_type, phone, nic, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Test', 'User', 'Test Mill', 'private', '+94771234567', '199012345678', 'testuser@example.com', passwordHash]
        );

        console.log(`✅ Insert result: ID ${result.insertId}`);

        // 2. Verify immediately
        const [users] = await db.execute('SELECT * FROM users');
        console.log(`\n🔍 Found ${users.length} users in database:`);
        users.forEach(u => console.log(`   - ${u.email} (NIC: ${u.nic})`));

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('⚠️ User already exists!');
            // Check existing users anyway
            const [users] = await db.execute('SELECT * FROM users');
            console.log(`\n🔍 Existing users:`);
            users.forEach(u => console.log(`   - ${u.email} (NIC: ${u.nic})`));
        } else {
            console.error('❌ Error:', error);
        }
    } finally {
        process.exit(0);
    }
}

createAndVerifyUser();
