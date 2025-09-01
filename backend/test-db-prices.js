const { getConnection } = require('./config/database');

async function testDatabasePrices() {
  try {
    console.log('🔧 Testing database price operations...');
    
    const db = getConnection();
    
    // Test fetching all prices
    console.log('📡 Testing getAllPrices...');
    const [rows] = await db.execute(`
      SELECT 
        id,
        district,
        province,
        market,
        variety,
        type,
        price_per_kg as pricePerKg,
        previous_price as previousPrice,
        currency,
        trend,
        price_change as priceChange,
        availability,
        status,
        description,
        created_at as createdAt,
        updated_at as lastUpdated,
        price_per_kg as currentPrice,
        CONCAT(currency, '/kg') as unit,
        CASE 
          WHEN price_per_kg >= 260 THEN 'Premium'
          WHEN price_per_kg >= 240 THEN 'Grade A+'
          ELSE 'Grade A'
        END as qualityGrade,
        CONCAT(district, ' Center') as collectionCenter
      FROM paddy_prices 
      WHERE status = 'Active'
      ORDER BY updated_at DESC
    `);
    
    console.log('✅ Found', rows.length, 'price records:');
    rows.forEach(row => {
      console.log(`  - ${row.district}: ${row.variety} (${row.type}) = Rs. ${row.pricePerKg}/kg`);
    });
    
    // Test adding a new price
    console.log('\n📝 Testing addPrice...');
    const [result] = await db.execute(`
      INSERT INTO paddy_prices (
        district, province, market, variety, type, price_per_kg, 
        previous_price, currency, trend, price_change, availability, 
        status, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)
    `, [
      'Test District',
      'Test Province', 
      'Test Market',
      'Test Variety',
      'Wet',
      299.50,
      295.00,
      'LKR',
      'up',
      4.50,
      'Medium',
      'Test price entry from database test'
    ]);
    
    console.log('✅ Price added with ID:', result.insertId);
    
    // Verify the new price was added
    const [newRows] = await db.execute(`
      SELECT * FROM paddy_prices WHERE id = ?
    `, [result.insertId]);
    
    console.log('✅ Verified new price:', newRows[0]);
    
    // Clean up test data
    await db.execute('DELETE FROM paddy_prices WHERE id = ?', [result.insertId]);
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 Database price operations test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabasePrices();