require('dotenv').config();
const db = require('./src/config/database');

async function listUsers() {
    try {
        const [users] = await db.execute('SELECT id, email, nic, first_name, last_name FROM users');

        console.log('\n📋 All Users in Database:\n');
        console.log('='.repeat(80));
        users.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email}`);
            console.log(`   NIC: ${user.nic || 'NULL'}`);
            console.log(`   Name: ${user.first_name} ${user.last_name}`);
            console.log('-'.repeat(80));
        });
        console.log(`\nTotal users: ${users.length}`);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit(0);
    }
}

listUsers();
