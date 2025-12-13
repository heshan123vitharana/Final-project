const db = require('./src/config/database');

async function inspectUser() {
    try {
        console.log('--- Inspecting User Data ---');

        // 1. Get info about columns in 'users' table
        const [columns] = await db.execute("SHOW COLUMNS FROM users");
        console.log('Columns in `users` table:', columns.map(c => c.Field).join(', '));

        // 2. Find user "Heshan" (approximate match)
        const [users] = await db.execute("SELECT * FROM users WHERE business_name LIKE '%Heshan%' OR first_name LIKE '%Heshan%'");

        console.log(`\nFound ${users.length} users matching 'Heshan':`);
        users.forEach(u => {
            console.log('\nUser Record:');
            // Print all non-null fields
            Object.keys(u).forEach(key => {
                if (u[key] !== null && u[key] !== '') {
                    console.log(`  ${key}: "${u[key]}"`);
                }
            });
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

inspectUser();
