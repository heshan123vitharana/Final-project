require('dotenv').config();
const db = require('./database-mysql-only');

async function checkDatabase() {
    try {
        console.log('🔍 Checking MySQL database contents...\n');
        
        // Check users table
        console.log('=== USERS TABLE ===');
        const [users] = await db.execute('SELECT id, first_name, last_name, business_name, email, business_type, created_at FROM users ORDER BY id DESC LIMIT 20');
        if (users.length === 0) {
            console.log('❌ No users found in database');
        } else {
            console.log(`✅ Found ${users.length} users:`);
            users.forEach(user => {
                console.log(`  - ID: ${user.id}, Name: ${user.first_name} ${user.last_name}, Email: ${user.email}, Business: ${user.business_name}`);
            });
        }
        
        console.log('\n=== ADMIN TABLE ===');
        const [admins] = await db.execute('SELECT id, username, email, status, created_at FROM admin');
        if (admins.length === 0) {
            console.log('❌ No admins found in database');
        } else {
            console.log(`✅ Found ${admins.length} admins:`);
            admins.forEach(admin => {
                console.log(`  - ID: ${admin.id}, Username: ${admin.username}, Email: ${admin.email}, Status: ${admin.status}`);
            });
        }
        
        // Check for newest users by ID
        console.log('\n=== CHECKING FOR HIGH ID USERS ===');
        const [highIdUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE id > 20');
        console.log(`Users with ID > 20: ${highIdUsers[0].count}`);
        
        const [maxId] = await db.execute('SELECT MAX(id) as maxId FROM users');
        console.log(`Maximum user ID in database: ${maxId[0].maxId}`);
        
        // Test database connection
        console.log('\n=== DATABASE CONNECTION TEST ===');
        const [testResult] = await db.execute('SELECT 1 as test, NOW() as current_time_val');
        console.log('✅ Database connection successful:', testResult[0]);
        
        // Show table structure
        console.log('\n=== AVAILABLE TABLES ===');
        const [tables] = await db.execute('SHOW TABLES');
        console.log('Tables in paddy_management database:');
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`  - ${tableName}`);
        });
        
    } catch (error) {
        console.error('❌ Database check failed:', error.message);
        console.error('Full error:', error);
    } finally {
        process.exit(0);
    }
}

checkDatabase();