const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'paddy_management'
        });

        console.log('✅ Connected to database');

        // Check if table exists
        const [tables] = await connection.execute("SHOW TABLES LIKE 'paddy_prices'");
        console.log(`📋 Paddy prices table exists: ${tables.length > 0 ? 'YES' : 'NO'}`);

        if (tables.length > 0) {
            // Count records
            const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM paddy_prices');
            console.log(`📊 Total records: ${countResult[0].count}`);

            // Get first few records
            const [records] = await connection.execute('SELECT * FROM paddy_prices LIMIT 3');
            console.log('\n📄 Sample records:');
            records.forEach((record, index) => {
                console.log(`${index + 1}. ${record.district} - ${record.variety} ${record.type}: LKR ${record.price_per_kg}/kg`);
            });
        }

        await connection.end();
        console.log('\n✅ Database test completed');

    } catch (error) {
        console.error('❌ Database test failed:', error.message);
    }
}

testDatabase();
