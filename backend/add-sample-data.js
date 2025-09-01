const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSampleData() {
    try {
        // Create connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'paddy_management'
        });

        console.log('Connected to MySQL database');

        // Sample data
        const sampleData = [
            ['Colombo', 'Western', 'Colombo Center', 'Red Rice', 'Local', 250.00, 245.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'Red Rice - Local variety from Colombo'],
            ['Kandy', 'Central', 'Kandy Center', 'White Rice', 'Keeri Samba', 270.00, 265.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'White Rice - Premium Keeri Samba'],
            ['Gampaha', 'Western', 'Gampaha Center', 'Red Rice', 'Nadu', 240.00, 242.00, 'LKR', 'falling', -2.00, 'Available', 'Active', 'Red Rice - Nadu variety'],
            ['Matara', 'Southern', 'Matara Center', 'White Rice', 'Samba', 260.00, 255.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'White Rice - Samba variety'],
            ['Anuradhapura', 'North Central', 'Anuradhapura Center', 'Red Rice', 'Local', 235.00, 235.00, 'LKR', 'stable', 0.00, 'Available', 'Active', 'Red Rice - Local variety from Anuradhapura'],
            ['Kurunegala', 'North Western', 'Kurunegala Center', 'White Rice', 'Basmati', 290.00, 285.00, 'LKR', 'rising', 5.00, 'Limited', 'Active', 'White Rice - Premium Basmati'],
            ['Ratnapura', 'Sabaragamuwa', 'Ratnapura Center', 'Red Rice', 'Pachchaperumal', 280.00, 275.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'Red Rice - Pachchaperumal variety'],
            ['Badulla', 'Uva', 'Badulla Center', 'White Rice', 'Keeri Samba', 275.00, 270.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'White Rice - Premium Keeri Samba from Uva']
        ];

        // Insert query
        const insertQuery = `
            INSERT INTO paddy_prices (
                district, province, market, variety, type, 
                price_per_kg, previous_price, currency, trend,
                price_change, availability, status, description,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        // Insert each record
        for (let i = 0; i < sampleData.length; i++) {
            await connection.execute(insertQuery, sampleData[i]);
            console.log(`✅ Inserted record ${i + 1}: ${sampleData[i][0]} - ${sampleData[i][3]} ${sampleData[i][4]}`);
        }

        console.log('✅ All sample data inserted successfully!');
        
        // Verify data
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM paddy_prices');
        console.log(`📊 Total records in paddy_prices table: ${rows[0].count}`);

        await connection.end();
        console.log('Database connection closed');
        
    } catch (error) {
        console.error('Error adding sample data:', error);
        process.exit(1);
    }
}

// Run the function
addSampleData();
