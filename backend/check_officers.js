const db = require('./src/config/database');

async function checkRegionalOfficers() {
    try {
        console.log('--- Checking Regional Officers and Districts ---');

        // Check all regional officers
        const [officers] = await db.execute('SELECT * FROM regional_officers'); // Adjust table name if different
        console.log(`\nFound ${officers.length} Regional Officers:`);
        officers.forEach(o => {
            console.log(`- ID: ${o.id}, Username: ${o.username}, District: ${o.district}`);
        });

        console.log('\n--- Comparing with Active Mills ---');
        // Re-run the active mills query briefly
        const [activeMills] = await db.execute(`
            SELECT u.business_name, u.district 
            FROM users u
            JOIN mill_licenses ml ON u.id = ml.user_id
            WHERE ml.status = 'approved' AND u.mill_latitude IS NOT NULL
        `);
        activeMills.forEach(m => {
            console.log(`- Active Mill District: "${m.district}"`);
        });

        // Check for mismatch (case sensitivity, whitespace)
        if (officers.length > 0 && activeMills.length > 0) {
            const officerDistrict = officers[0].district;
            const millDistrict = activeMills[0].district;

            console.log(`\nComparison: "${officerDistrict}" vs "${millDistrict}"`);
            console.log(`Match? ${officerDistrict === millDistrict}`);
            console.log(`Case-insensitive Match? ${officerDistrict.toLowerCase() === millDistrict.toLowerCase()}`);
        }

        process.exit();
    } catch (error) {
        // Fallback: table might be named differently
        try {
            const [users] = await db.execute("SELECT * FROM users WHERE role = 'regional_officer' OR role = 'admin'");
            console.log(`\nFound Users (checking for officers):`);
            users.forEach(u => console.log(`- ID: ${u.id}, Role: ${u.role}, District: ${u.district}, Username: ${u.username}`));
            process.exit();
        } catch (e) {
            console.error('Error:', error);
            process.exit(1);
        }
    }
}

checkRegionalOfficers();
