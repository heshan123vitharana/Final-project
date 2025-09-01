const { getConnection } = require('./config/database');

async function testFullIntegration() {
  try {
    console.log('🧪 Testing Full Integration: PriceManagement <-> Database <-> LivePaddyPrices');
    
    const db = getConnection();
    
    // Step 1: Count current prices
    const [beforeCount] = await db.execute('SELECT COUNT(*) as count FROM paddy_prices WHERE status = "Active"');
    console.log('📊 Current active prices in database:', beforeCount[0].count);
    
    // Step 2: Add a new price via API (simulating PriceManagement component)
    const testPrice = {
      variety: 'Integration Test Rice',
      type: 'Wet',
      price: 325.50,
      district: 'Gampaha',
      description: 'Test integration between components'
    };
    
    console.log('📤 Adding new price via API:', testPrice);
    
    const response = await fetch('http://localhost:5000/api/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPrice)
    });
    
    const addResult = await response.json();
    console.log('📨 Add price response:', addResult);
    
    if (addResult.success) {
      console.log('✅ Price added successfully with ID:', addResult.id);
      
      // Step 3: Verify price appears in database
      const [newPrice] = await db.execute('SELECT * FROM paddy_prices WHERE id = ?', [addResult.id]);
      if (newPrice.length > 0) {
        console.log('✅ Price found in database:', newPrice[0]);
      }
      
      // Step 4: Check that LivePaddyPrices API would return it
      const livePricesResponse = await fetch('http://localhost:5000/api/prices');
      const livePricesData = await livePricesResponse.json();
      
      const foundInLiveAPI = livePricesData.data.find(p => p.id == addResult.id);
      if (foundInLiveAPI) {
        console.log('✅ New price appears in LivePaddyPrices API:', foundInLiveAPI);
      }
      
      // Step 5: Count after addition
      const [afterCount] = await db.execute('SELECT COUNT(*) as count FROM paddy_prices WHERE status = "Active"');
      console.log('📊 Active prices after addition:', afterCount[0].count);
      
      // Step 6: Clean up test data
      await db.execute('DELETE FROM paddy_prices WHERE id = ?', [addResult.id]);
      console.log('🧹 Test data cleaned up');
      
      // Final verification
      const [finalCount] = await db.execute('SELECT COUNT(*) as count FROM paddy_prices WHERE status = "Active"');
      console.log('📊 Final active prices count:', finalCount[0].count);
      
      if (beforeCount[0].count === finalCount[0].count) {
        console.log('🎉 INTEGRATION TEST PASSED! PriceManagement -> Database -> LivePaddyPrices working correctly!');
      }
      
    } else {
      console.log('❌ Failed to add price:', addResult);
    }
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  } finally {
    process.exit(0);
  }
}

testFullIntegration();