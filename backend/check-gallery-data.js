const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkGalleryData() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management',
      connectionLimit: 10,
    });

    console.log('🔍 Checking gallery_images data...');
    
    // Get all data from gallery table
    const [rows] = await pool.execute('SELECT * FROM gallery_images ORDER BY created_at DESC');
    
    console.log(`Found ${rows.length} images in gallery_images table:`);
    
    if (rows.length > 0) {
      console.log('Gallery data:');
      rows.forEach((row, index) => {
        console.log(`\n--- Image ${index + 1} ---`);
        console.log(`ID: ${row.id}`);
        console.log(`Title: ${row.title}`);
        console.log(`Description: ${row.description}`);
        console.log(`Category: ${row.category}`);
        console.log(`File Name: ${row.file_name}`);
        console.log(`File Path: ${row.file_path}`);
        console.log(`Image URL: ${row.image_url ? 'Present (length: ' + row.image_url.length + ')' : 'NULL'}`);
        console.log(`Is Active: ${row.is_active}`);
        console.log(`Status: ${row.status}`);
        console.log(`Created: ${row.created_at}`);
        console.log(`Updated: ${row.updated_at}`);
        
        // Check if image_url contains valid data
        if (row.image_url) {
          const isBase64 = row.image_url.startsWith('data:image/');
          console.log(`Image URL Type: ${isBase64 ? 'Base64 Data URL' : 'Regular URL'}`);
        }
      });
    } else {
      console.log('No images found in the gallery table.');
      console.log('This might explain why uploaded images are not showing up.');
    }

    await pool.end();
    console.log('\n✅ Gallery data check complete');
    
  } catch (error) {
    console.error('❌ Error checking gallery data:', error);
  }
}

checkGalleryData();