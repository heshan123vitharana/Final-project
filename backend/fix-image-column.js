const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixImageUrlColumn() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management',
      connectionLimit: 10,
    });

    console.log('🔧 Fixing image_url column size...');
    
    // Change image_url column from VARCHAR(500) to LONGTEXT to handle Base64 images
    await pool.execute('ALTER TABLE gallery_images MODIFY COLUMN image_url LONGTEXT');
    console.log('✅ Changed image_url column to LONGTEXT');
    
    // Check the updated structure
    const [rows] = await pool.execute('DESCRIBE gallery_images');
    console.log('Updated table structure:');
    const imageUrlRow = rows.find(row => row.Field === 'image_url');
    if (imageUrlRow) {
      console.log(`image_url column type: ${imageUrlRow.Type}`);
    }

    await pool.end();
    console.log('✅ Column fix complete');
    
  } catch (error) {
    console.error('❌ Error fixing column:', error);
  }
}

fixImageUrlColumn();