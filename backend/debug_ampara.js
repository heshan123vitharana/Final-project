const db = require('./src/config/database');

async function debugAmpara() {
    try {
        console.log('--- Debugging Ampara Data ---');

        // 1. Find the Ampara Regional Officer
        const [officers] = await db.execute("SELECT * FROM regional_officers WHERE district LIKE '%Ampara%'");
        console.log(`\nFound ${officers.length} Officers for 'Ampara':`);
        officers.forEach(o => console.log(`- ID: ${o.id}, User: ${o.username}, District: '${o.district}'`));

        // 2. Find Approved Mills in Ampara with Location
        console.log('\n--- Checking Approved Mills in Ampara ---');
        const [mills] = await db.execute(`
            SELECT u.id, u.business_name, u.district, u.mill_latitude, ml.status 
            FROM users u
            JOIN mill_licenses ml ON u.id = ml.user_id
            WHERE u.district LIKE '%Ampara%'
        `);

        console.log(`Found ${mills.length} Mills in 'Ampara' (User table check):`);
        mills.forEach(m => {
            console.log(`- Mill: ${m.business_name}`);
            console.log(`  District: '${m.district}'`);
            console.log(`  License Status: ${m.status}`);
            console.log(`  Coordinates: ${m.mill_latitude ? 'Yes' : 'NULL'}`);
        });

        // 3. Simulate the EXACT query from the controller (with case insensitivity)
        console.log('\n--- Simulating Controller Query (LOWER match) ---');
        const testDistrict = 'Ampara';
        const [results] = await db.execute(`
            SELECT u.business_name 
            FROM users u
            JOIN mill_licenses ml ON u.id = ml.user_id
            WHERE LOWER(u.district) = LOWER(?) 
            AND ml.status = 'approved'
            AND u.mill_latitude IS NOT NULL
        `, [testDistrict]);

        console.log(`Controller Query Results for '${testDistrict}': ${results.length} matches`);
        results.forEach(r => console.log(`- Found: ${r.business_name}`));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugAmpara();
