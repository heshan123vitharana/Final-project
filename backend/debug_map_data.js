const db = require('./src/config/database');

async function debugMapData() {
    try {
        console.log('--- Debugging Map Data ---');

        // 1. Check users with location data
        const [usersWithLoc] = await db.execute(`
      SELECT id, first_name, business_name, district, mill_latitude, mill_longitude 
      FROM users 
      WHERE mill_latitude IS NOT NULL
    `);
        console.log(`\nUsers with location data: ${usersWithLoc.length}`);
        usersWithLoc.forEach(u => {
            console.log(`- ID: ${u.id}, Name: ${u.business_name}, District: ${u.district}, Lat: ${u.mill_latitude}`);
        });

        if (usersWithLoc.length === 0) {
            console.log('❌ NO USERS FOUND WITH LOCATION DATA. The map will be empty.');
            // Check a few users to see columns
            const [allUsers] = await db.execute('SELECT id, business_name, mill_latitude FROM users LIMIT 5');
            console.log('Sample users:', allUsers);
        }

        // 2. Check approved licenses
        const [licenses] = await db.execute(`
      SELECT id, user_id, status FROM mill_licenses WHERE status = 'approved'
    `);
        console.log(`\nApproved Licenses: ${licenses.length}`);
        licenses.forEach(l => console.log(`- License ID: ${l.id}, User ID: ${l.user_id}, Status: ${l.status}`));

        // 3. Check the intersection (The query used by controller)
        const query = `
        SELECT 
            u.id, 
            u.business_name, 
            u.district,
            ml.status as license_status
        FROM users u
        JOIN mill_licenses ml ON u.id = ml.user_id
        WHERE ml.status = 'approved'
        AND u.mill_latitude IS NOT NULL 
        AND u.mill_longitude IS NOT NULL
    `;
        const [activeMills] = await db.execute(query);
        console.log(`\nActive Mills (Should appear on map): ${activeMills.length}`);
        activeMills.forEach(m => {
            console.log(`- Mill: ${m.business_name}, District: ${m.district}`);
        });

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugMapData();
