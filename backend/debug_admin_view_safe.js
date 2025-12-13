const db = require('./src/config/database');

async function debugAdminViewSafe() {
    try {
        console.log('--- ADMIN VIEW: All Approved Mills ---');
        const [mills] = await db.execute(`
            SELECT u.id, u.business_name, u.district, u.mill_latitude, u.mill_longitude 
            FROM users u
            JOIN mill_licenses ml ON u.id = ml.user_id
            WHERE ml.status = 'approved'
            AND u.mill_latitude IS NOT NULL
        `);

        if (mills.length === 0) {
            console.log('No approved mills found.');
        } else {
            console.log(`Found ${mills.length} total mills.`);
            mills.forEach(m => {
                const lat = m.mill_latitude;
                console.log(`[${m.id}] "${m.business_name}" | District: "${m.district}"`);
                console.log(`   Location Type: ${typeof lat}, Value: ${lat}`);
            });
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugAdminViewSafe();
