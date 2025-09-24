const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTableStructure() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management',
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000
    });

    console.log('🔍 Checking gallery_images table structure...');
    
    // Check if table exists and get its structure
    const [rows] = await pool.execute('DESCRIBE gallery_images');
    
    console.log('Current table structure:');
    console.table(rows);
    
    // Check for missing columns and add them
    const currentColumns = rows.map(row => row.Field);
    
    if (!currentColumns.includes('image_url')) {
      console.log('⚠️ Missing image_url column, adding it...');
      await pool.execute('ALTER TABLE gallery_images ADD COLUMN image_url VARCHAR(500) DEFAULT NULL');
      console.log('✅ Added image_url column');
    }
    
    if (!currentColumns.includes('status')) {
      console.log('⚠️ Missing status column, adding it...');
      await pool.execute('ALTER TABLE gallery_images ADD COLUMN status ENUM("active", "inactive") DEFAULT "active"');
      console.log('✅ Added status column');
    }
    
    // Check final structure
    const [finalRows] = await pool.execute('DESCRIBE gallery_images');
    console.log('Final table structure:');
    console.table(finalRows);
    
    await pool.end();
    console.log('✅ Database check complete');
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
  }
}

checkTableStructure();