const db = require('./config/database');

async function addSamplePrices() {
  console.log('📈 Adding sample price data for testing...');

  const samplePrices = [
    // Colombo district prices (for test user)
    {
      district: 'Colombo',
      province: 'Western',
      market: 'Colombo Central Market',
      variety: 'Nadu',
      type: 'Wet',
      price: 195.50,
      currency: 'LKR',
      trend: 'up',
      availability: 'Available',
      description: 'Fresh Nadu wet paddy from Colombo region'
    },
    {
      district: 'Colombo',
      province: 'Western',
      market: 'Manning Market',
      variety: 'Nadu',
      type: 'Dry',
      price: 220.00,
      currency: 'LKR',
      trend: 'stable',
      availability: 'Available',
      description: 'Dried Nadu paddy for long-term storage'
    },
    {
      district: 'Colombo',
      province: 'Western',
      market: 'Pettah Wholesale',
      variety: 'Red Nadu',
      type: 'Wet',
      price: 235.75,
      currency: 'LKR',
      trend: 'up',
      availability: 'Limited',
      description: 'Premium red Nadu variety'
    },
    {
      district: 'Colombo',
      province: 'Western',
      market: 'Pettah Wholesale',
      variety: 'Red Nadu',
      type: 'Dry',
      price: 255.00,
      currency: 'LKR',
      trend: 'up',
      availability: 'Available',
      description: 'Dried red Nadu - premium quality'
    },
    {
      district: 'Colombo',
      province: 'Western',
      market: 'Colombo Port Market',
      variety: 'Samba',
      type: 'Wet',
      price: 275.25,
      currency: 'LKR',
      trend: 'down',
      availability: 'Available',
      description: 'High quality Samba variety'
    },
    {
      district: 'Colombo',
      province: 'Western',
      market: 'Colombo Port Market',
      variety: 'Samba',
      type: 'Dry',
      price: 295.50,
      currency: 'LKR',
      trend: 'stable',
      availability: 'Available',
      description: 'Dried Samba - export quality'
    },
    {
      district: 'Colombo',
      province: 'Western',
      market: 'Colombo Premium Center',
      variety: 'Keeri Samba',
      type: 'Wet',
      price: 320.00,
      currency: 'LKR',
      trend: 'up',
      availability: 'Limited',
      description: 'Premium Keeri Samba - specialty grade'
    },
    {
      district: 'Colombo',
      province: 'Western',
      market: 'Colombo Premium Center',
      variety: 'Keeri Samba',
      type: 'Dry',
      price: 345.75,
      currency: 'LKR',
      trend: 'up',
      availability: 'Available',
      description: 'Dried Keeri Samba - highest grade'
    }
  ];

  try {
    for (const priceData of samplePrices) {
      const {
        district,
        province,
        market,
        variety,
        type,
        price,
        currency,
        trend,
        availability,
        description
      } = priceData;

      const query = `
        INSERT INTO paddy_prices (
          district, province, market, variety, type,
          price_per_kg, previous_price, currency, trend,
          price_change, availability, status, description,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const previousPrice = parseFloat(price) - (Math.random() * 10 - 5); // Random previous price
      const priceChange = parseFloat(price) - previousPrice;

      const params = [
        district,
        province,
        market,
        variety,
        type,
        parseFloat(price),
        previousPrice,
        currency,
        trend,
        priceChange,
        availability,
        'Active',
        description
      ];

      await db.execute(query, params);
      console.log(`✅ Added price: ${variety} (${type}) - LKR ${price}/kg at ${market}`);
    }

    console.log('🎉 Sample price data added successfully!');
    console.log('📊 Total prices added:', samplePrices.length);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample price data:', error);
    process.exit(1);
  }
}

addSamplePrices();