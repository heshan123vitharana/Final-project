require('dotenv').config();
const db = require('./database');

async function testDirectRegistration() {
    try {
        console.log('🔍 Testing direct user registration...');
        
        // Test database connection first
        console.log('Testing database connection...');
        const [testResult] = await db.execute('SELECT 1 as test, NOW() as current_time_val');
        console.log('✅ Database connection successful:', testResult[0]);
        
        // Check current max ID
        const [maxIdResult] = await db.execute('SELECT MAX(id) as maxId FROM users');
        console.log('Current max user ID:', maxIdResult[0].maxId);
        
        // Insert a test user directly
        console.log('Inserting test user...');
        const result = await db.execute(
            "INSERT INTO users (first_name, last_name, business_name, business_type, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ['Direct', 'Test', 'Direct Test Mill', 'private', '0771234567', 'direct@test.com', 'hashedpassword123']
        );
        
        console.log('✅ User inserted successfully:', result[0]);
        
        // Check new max ID
        const [newMaxIdResult] = await db.execute('SELECT MAX(id) as maxId FROM users');
        console.log('New max user ID:', newMaxIdResult[0].maxId);
        
        // Get the newly inserted user
        const [newUser] = await db.execute('SELECT * FROM users WHERE email = ?', ['direct@test.com']);
        console.log('✅ Newly inserted user:', newUser[0]);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    } finally {
        process.exit(0);
    }
}

testDirectRegistration();