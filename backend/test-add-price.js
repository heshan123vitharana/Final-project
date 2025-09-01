const { getConnection } = require('./config/database');

async function testAddPriceAPI() {
  try {
    console.log('🧪 Testing Add Price API with frontend data format...');
    
    // Test data that matches what the frontend sends
    const testPriceData = {
      variety: 'Test Samba',
      type: 'Wet',
      price: 299.75, // Using 'price' field like frontend
      district: 'Colombo',
      description: 'Test price from API test'
    };

    console.log('📤 Sending test data:', testPriceData);

    // Test the API endpoint directly
    const response = await fetch('http://localhost:5000/api/prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPriceData)
    });

    const result = await response.json();
    console.log('📨 API Response:', result);

    if (response.ok) {
      console.log('✅ Price added successfully with ID:', result.id);
      
      // Verify the price was actually saved to database
      const db = getConnection();
      const [rows] = await db.execute('SELECT * FROM paddy_prices WHERE id = ?', [result.id]);
      
      if (rows.length > 0) {
        console.log('✅ Verified in database:', rows[0]);
      } else {
        console.log('❌ Price not found in database!');
      }

      // Clean up test data
      await db.execute('DELETE FROM paddy_prices WHERE id = ?', [result.id]);
      console.log('🧹 Test data cleaned up');
      
    } else {
      console.log('❌ API Error:', result);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testAddPriceAPI();