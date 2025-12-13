const db = require('./src/config/database');

async function listAllMills() {
    try {
        console.log('--- Listing ALL Approved Mills with Location ---');
        const [mills] = await db.execute(`
            SELECT u.id, u.business_name, u.district, u.mill_latitude, u.mill_longitude 
            FROM users u
            JOIN mill_licenses ml ON u.id = ml.user_id
            WHERE ml.status = 'approved'
        `);

        if (mills.length === 0) {
            console.log('No approved mills with location found.');
        } else {
            mills.forEach(m => {
                console.log(`- ID: ${m.id}`);
                console.log(`  Name: "${m.business_name}"`);
                console.log(`  District: "${m.district}"`); // Quote to see whitespace
                console.log(`  Location: ${m.mill_latitude}, ${m.mill_longitude}`);
                console.log('---');
            });
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listAllMills();
