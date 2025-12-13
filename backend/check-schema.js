require('dotenv').config();
const db = require('./src/config/database');

async function checkSchema() {
    try {
        const [columns] = await db.execute('DESCRIBE users');
        console.log('📋 Users Table Columns:\n');
        columns.forEach(col => {
            console.log(`  ${col.Field.padEnd(25)} ${col.Type}`);
        });

        console.log('\n🔍 Checking for NIC column...');
        const nicColumn = columns.find(c => c.Field.toLowerCase().includes('nic'));
        if (nicColumn) {
            console.log(`✅ Found NIC column: "${nicColumn.Field}" (${nicColumn.Type})`);
        } else {
            console.log('❌ No NIC column found!');
        }

        // Check actual data
        console.log('\n📊 Sample user data:');
        const [users] = await db.execute('SELECT id, email, nic, Nic FROM users LIMIT 3');
        console.table(users);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit(0);
    }
}

checkSchema();
