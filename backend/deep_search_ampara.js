const db = require('./src/config/database');

async function findAmparaMill() {
    try {
        console.log('--- Deep Search for Ampara Mill ---');

        // 1. Search Users by District string
        const [users] = await db.execute(`
            SELECT id, business_name, district, mill_district, mill_latitude, mill_longitude 
            FROM users 
            WHERE district LIKE '%Ampara%' OR mill_district LIKE '%Ampara%'
        `);

        console.log(`Found ${users.length} users with 'Ampara' in district fields:`);

        for (const u of users) {
            console.log(`\n[User ${u.id}] ${u.business_name}`);
            console.log(`  - District: '${u.district}'`);
            console.log(`  - Mill District: '${u.mill_district}'`);
            console.log(`  - Location: ${u.mill_latitude}, ${u.mill_longitude}`);

            // Check License
            const [licenses] = await db.execute('SELECT * FROM mill_licenses WHERE user_id = ?', [u.id]);
            console.log(`  - Licenses: ${licenses.length}`);
            licenses.forEach(l => {
                console.log(`    > ID: ${l.id}, Status: '${l.status}', ApprovedDate: ${l.approved_date}`);
            });
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

findAmparaMill();
