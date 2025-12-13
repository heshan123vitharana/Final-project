const db = require('./src/config/database');

async function verifyFix() {
    try {
        console.log('--- Verifying Fix for Ampara Mill ---');
        const testDistrict = 'Ampara';

        // This validates if the database has ANY match for 'Ampara' using the new logic
        // We check if (mill_district OR district) matches 'Ampara' (case-insensitive)
        const [results] = await db.execute(`
            SELECT u.business_name, u.mill_district, u.district 
            FROM users u
            JOIN mill_licenses ml ON u.id = ml.user_id
            WHERE LOWER(COALESCE(u.mill_district, u.district)) = LOWER(?) 
            AND ml.status = 'approved'
            AND u.mill_latitude IS NOT NULL
        `, [testDistrict]);

        console.log(`Query Results for '${testDistrict}' using COALESCE: ${results.length} matches`);
        results.forEach(r => {
            console.log(`- Found: ${r.business_name}`);
            console.log(`  mill_district: '${r.mill_district}'`);
            console.log(`  district: '${r.district}'`);
        });

        if (results.length > 0) {
            console.log('✅ SUCCESS: The updated query successfully finds the mill!');
        } else {
            console.log('❌ FAILURE: Still no match. Is the district spelled correctly in DB?');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verifyFix();
