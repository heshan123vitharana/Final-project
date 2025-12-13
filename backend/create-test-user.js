require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/config/database');

async function createTestUser() {
    try {
        console.log('🔧 Creating test user...\n');

        const testUser = {
            first_name: 'Test',
            last_name: 'User',
            business_name: 'Test Mill',
            business_type: 'private',
            phone: '+94771234567',
            nic: '199012345678',
            email: 'testuser@example.com',
            password: 'Test@123'
        };

        console.log('📋 Test User Details:');
        console.log(`   Email: ${testUser.email}`);
        console.log(`   NIC: ${testUser.nic}`);
        console.log(`   Password: ${testUser.password}`);
        console.log('');

        // Hash password
        const passwordHash = await bcrypt.hash(testUser.password, 10);

        // Insert user
        const [result] = await db.execute(
            `INSERT INTO users (first_name, last_name, business_name, business_type, phone, nic, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                testUser.first_name,
                testUser.last_name,
                testUser.business_name,
                testUser.business_type,
                testUser.phone,
                testUser.nic,
                testUser.email,
                passwordHash
            ]
        );

        console.log('✅ Test user created successfully!');
        console.log(`   User ID: ${result.insertId}`);
        console.log('');
        console.log('🧪 Now you can test NIC verification:');
        console.log('');
        console.log('   Test 1 - CORRECT NIC (should succeed):');
        console.log(`     Email: ${testUser.email}`);
        console.log(`     NIC: ${testUser.nic}`);
        console.log(`     Password: ${testUser.password}`);
        console.log('');
        console.log('   Test 2 - WRONG NIC (should fail):');
        console.log(`     Email: ${testUser.email}`);
        console.log('     NIC: 999999999V (wrong)');
        console.log(`     Password: ${testUser.password}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

createTestUser();
