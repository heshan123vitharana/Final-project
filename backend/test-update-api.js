const mysql = require('mysql2/promise');
const http = require('http');
require('dotenv').config();

async function testUpdateAPI() {
  try {
    console.log('🧪 Testing gallery update API...');
    
    // Test data
    const testUpdate = {
      title: "Updated Test Title",
      description: "Updated test description", 
      category: "Test Category",
      is_active: true,
      status: "active"
    };

    // Test with http module since fetch might not be available
    const postData = JSON.stringify(testUpdate);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/gallery/5',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const responseData = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });

    console.log('📥 Response status:', responseData.statusCode);
    console.log('📥 Response body:', responseData.body);

    // Check database directly
    console.log('\n🔍 Checking database directly...');
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paddy_management',
      connectionLimit: 10,
    });

    const [rows] = await pool.execute('SELECT id, title, description, category, is_active, status FROM gallery_images WHERE id = ?', [5]);
    console.log('📋 Database record after update:', rows[0]);

    await pool.end();

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testUpdateAPI();