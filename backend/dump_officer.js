const db = require('./src/config/database');

async function dumpOfficer() {
    try {
        console.log('--- Dumping Regional Officers ---');

        // 1. Regional Officers Table
        try {
            console.log('Querying `regional_officers`...');
            const [officers] = await db.execute("SELECT * FROM regional_officers");
            console.log(`Found ${officers.length} records in regional_officers:`);
            officers.forEach(o => {
                // Log all keys to see what we have
                console.log(JSON.stringify(o));
            });
        } catch (e) {
            console.log('Error querying `regional_officers`: ' + e.message);
        }

        // 2. Users Table
        try {
            console.log('\nQuerying `users` (role=regional_officer)...');
            const [users] = await db.execute("SELECT id, first_name, email, district, role FROM users WHERE role = 'regional_officer'");
            console.log(`Found ${users.length} records in users:`);
            users.forEach(u => {
                console.log(`ID: ${u.id}, Name: ${u.first_name}, Email: ${u.email}, District: '${u.district}'`);
            });
        } catch (e) {
            console.log('Error querying `users`: ' + e.message);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dumpOfficer();
