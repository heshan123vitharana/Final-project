const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkCategories() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management',
      connectionLimit: 10,
    });

    console.log('🔍 Checking categories...');
    const [rows] = await pool.execute('SELECT * FROM gallery_categories ORDER BY sort_order');
    console.log('Found categories:', rows.length);
    console.table(rows);
    
    // Test the API endpoint
    console.log('\n🔧 Testing API endpoint...');
    const response = await fetch('http://localhost:5000/api/categories?active=true');
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data);
    } else {
      console.log('API Error:', response.status, response.statusText);
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCategories();