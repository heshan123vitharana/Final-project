const mysql = require('mysql2/promise');
require('dotenv').config();

async function addMillDistrictColumn() {
  let connection;

  try {
    console.log('🔧 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management'
    });

    console.log('✅ Connected to database');

    // Check if mill_district column already exists
    console.log('🔍 Checking if mill_district column exists...');
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM users LIKE 'mill_district'
    `);

    if (columns.length > 0) {
      console.log('✅ mill_district column already exists');
      return;
    }

    // Add mill_district column
    console.log('📝 Adding mill_district column...');
    await connection.execute(`
      ALTER TABLE users
      ADD COLUMN mill_district VARCHAR(100) DEFAULT NULL
      AFTER mill_location
    `);

    console.log('✅ mill_district column added successfully');

    // Optionally update existing users with their district as mill_district
    console.log('🔄 Updating existing users with mill_district = district...');
    const [result] = await connection.execute(`
      UPDATE users
      SET mill_district = district
      WHERE mill_district IS NULL AND district IS NOT NULL
    `);

    console.log(`✅ Updated ${result.affectedRows} users with mill_district`);

  } catch (error) {
    console.error('❌ Error adding mill_district column:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the migration
addMillDistrictColumn()
  .then(() => {
    console.log('🎉 Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  });