const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUserData() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management'
    });

    console.log('🔍 Checking user data for user ID 1...');
    const [rows] = await connection.execute(`
      SELECT id, first_name, last_name, district, mill_district,
             business_name, business_type, mill_capacity, mill_location, registration_date
      FROM users WHERE id = 1
    `);

    if (rows.length > 0) {
      const user = rows[0];
      console.log('👤 User data:', JSON.stringify(user, null, 2));

      // Count fields
      const personalFields = [
        user.first_name, user.last_name, null, // nic is null
        'test@mill.lk', '0123456789', '123 Test Street',
        'Colombo', user.district, '10100'
      ];

      const businessFields = [
        user.business_name, user.business_type, user.mill_capacity,
        user.mill_location, user.mill_district, user.registration_date
      ];

      const filledPersonal = personalFields.filter(f => f && f.toString().trim() !== '').length;
      const filledBusiness = businessFields.filter(f => f && f.toString().trim() !== '').length;

      console.log('📊 Field analysis:');
      console.log('Personal fields (9 total):', filledPersonal, 'filled');
      console.log('Business fields (6 total):', filledBusiness, 'filled');
      console.log('Total fields (15):', filledPersonal + filledBusiness, 'filled');
      console.log('Mill district value:', user.mill_district);
    } else {
      console.log('❌ User not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkUserData();