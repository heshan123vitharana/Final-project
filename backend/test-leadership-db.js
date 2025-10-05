const mysql = require('mysql2/promise');
require('dotenv').config();

async function testLeadershipTable() {
  let connection;
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management'
    });

    console.log('🔗 Connected to database');

    // Check if leadership table exists and get its structure
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'leadership'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Leadership table does not exist');
      return;
    }
    
    console.log('✅ Leadership table exists');

    // Get table structure
    const [columns] = await connection.execute('DESCRIBE leadership');
    console.log('📋 Table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });

    // Check existing data
    const [rows] = await connection.execute('SELECT * FROM leadership');
    console.log(`\n📊 Found ${rows.length} existing leadership records:`);
    
    if (rows.length > 0) {
      rows.forEach((row, index) => {
        console.log(`\n${index + 1}. ${row.name} - ${row.position}`);
        console.log(`   Email: ${row.email || 'N/A'}`);
        console.log(`   LinkedIn: ${row.linkedin_url || 'N/A'}`);
        console.log(`   Twitter: ${row.twitter_url || 'N/A'}`);
        console.log(`   Order: ${row.order_index || 0}`);
        console.log(`   Active: ${row.is_active ? 'Yes' : 'No'}`);
        console.log(`   Image: ${row.image_url || 'N/A'}`);
        console.log(`   Created: ${row.created_at}`);
      });
    } else {
      console.log('   No existing data found');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testLeadershipTable();