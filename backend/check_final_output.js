const fetch = require('node-fetch'); // Ensure node-fetch is available or use native fetch if Node 18+
// If node-fetch isn't available, we use http module
const http = require('http');

const token = "YOUR_TOKEN_HERE"; // flexible placeholder, but we need a real token. 
// Since we can't easily get a real token without login, let's login first.

const loginData = JSON.stringify({
    username: 'regional_ampara', // Based on previous check
    password: 'password123' // Assumption: default test password. If fails, we can't test.
    // Wait, let's check dump_officer.js output for username. It was 'regional_ampara'.
    // If password fails, we depend on logs.
});

// We can just use the verify_fix.js approach but with the CONTROLLER logic called directly? No, that requires mocking req/res.

// Better: Just use `verify_fix.js` but updated to output the EXACT column names that the frontend expects.
const db = require('./src/config/database');

async function checkFinalOutput() {
    try {
        console.log('--- Simulating Controller Final Output ---');
        const district = 'Ampara';

        // This query matches the CURRENT controller code perfectly
        const query = `
                SELECT 
                    u.id, 
                    u.business_name, 
                    u.business_type,
                    COALESCE(NULLIF(u.mill_district, ''), u.district) as district,
                    u.mill_latitude as latitude, 
                    u.mill_longitude as longitude,
                    u.address, 
                    u.city, 
                    u.mill_capacity,
                    u.mill_location,
                    ml.license_number,
                    ml.approved_date
                FROM users u
                JOIN mill_licenses ml ON u.id = ml.user_id
                WHERE LOWER(COALESCE(NULLIF(u.mill_district, ''), u.district)) = LOWER(?) 
                AND ml.status = 'approved'
                AND u.mill_latitude IS NOT NULL 
                AND u.mill_longitude IS NOT NULL
                AND ml.created_at = (
                    SELECT MAX(created_at) 
                    FROM mill_licenses ml2 
                    WHERE ml2.user_id = u.id AND ml2.status = 'approved'
                )
        `;

        const [rows] = await db.execute(query, [district]);
        console.log(`Rows found: ${rows.length}`);
        if (rows.length > 0) {
            console.log('First row keys:', Object.keys(rows[0]));
            console.log('Sample Row:', rows[0]);
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkFinalOutput();
