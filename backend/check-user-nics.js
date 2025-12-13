// Test script to check if users have NIC values in database
require('dotenv').config();
const db = require('./src/config/database');

async function checkUserNICs() {
    try {
        console.log('🔍 Checking user NIC values in database...\n');

        const [users] = await db.execute(
            'SELECT id, email, nic, first_name, last_name FROM users LIMIT 10'
        );

        console.log('📊 User NIC Status:');
        console.log('='.repeat(80));

        users.forEach(user => {
            const hasNic = user.nic && user.nic.trim() !== '';
            const status = hasNic ? '✅ HAS NIC' : '❌ NO NIC';
            console.log(`${status} | Email: ${user.email} | NIC: ${user.nic || 'NULL'}`);
        });

        console.log('='.repeat(80));

        const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN nic IS NOT NULL AND nic != '' THEN 1 ELSE 0 END) as users_with_nic,
        SUM(CASE WHEN nic IS NULL OR nic = '' THEN 1 ELSE 0 END) as users_without_nic
      FROM users
    `);

        console.log('\n📈 Statistics:');
        console.log(`Total users: ${stats[0].total_users}`);
        console.log(`Users with NIC: ${stats[0].users_with_nic}`);
        console.log(`Users without NIC: ${stats[0].users_without_nic}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

checkUserNICs();
