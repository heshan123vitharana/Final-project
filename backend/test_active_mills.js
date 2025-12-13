const db = require('./src/config/database');

async function testActiveMills() {
    try {
        console.log('=== Testing Active Mills Query ===\n');

        // First, check what district the Ampara officer has
        const [officers] = await db.execute("SELECT id, username, district FROM regional_officers WHERE username = 'ampara'");
        console.log('Ampara Officer:', officers[0]);
        const district = officers[0]?.district;

        if (!district) {
            console.log('ERROR: No district found for Ampara officer');
            process.exit(1);
        }

        console.log(`\nQuerying for mills in district: "${district}"\n`);

        // Run the exact query from the controller
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

        const [mills] = await db.execute(query, [district]);

        console.log(`Found ${mills.length} mills\n`);

        if (mills.length > 0) {
            mills.forEach(mill => {
                console.log('Mill:', {
                    id: mill.id,
                    name: mill.business_name,
                    district: mill.district,
                    latitude: mill.latitude,
                    longitude: mill.longitude
                });
            });

            // Show the mapped output
            console.log('\n=== Mapped Output (as sent to frontend) ===\n');
            const mapped = mills.map(row => ({
                id: row.id,
                name: row.business_name,
                businessType: row.business_type,
                district: row.district,
                latitude: typeof row.latitude === 'string' ? parseFloat(row.latitude) : row.latitude,
                longitude: typeof row.longitude === 'string' ? parseFloat(row.longitude) : row.longitude
            }));
            console.log(JSON.stringify(mapped, null, 2));
        } else {
            console.log('No mills found. Checking why...\n');

            // Debug: Check if there are ANY approved mills
            const [allApproved] = await db.execute(`
                SELECT u.business_name, u.district, u.mill_district, ml.status
                FROM users u
                JOIN mill_licenses ml ON u.id = ml.user_id
                WHERE ml.status = 'approved'
            `);
            console.log(`Total approved mills in system: ${allApproved.length}`);
            allApproved.forEach(m => {
                console.log(`- ${m.business_name}: district="${m.district}", mill_district="${m.mill_district}"`);
            });
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testActiveMills();
