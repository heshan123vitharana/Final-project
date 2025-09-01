const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'paddy_management.db');
const db = new sqlite3.Database(dbPath);

// Sample price data
const samplePrices = [
  {
    district: 'Colombo',
    province: 'Western Province',
    market: 'Colombo Center',
    variety: 'Nadu(Sudu)',
    type: 'Wet',
    price_per_kg: 150.00,
    previous_price: 145.00,
    currency: 'LKR',
    trend: 'rising',
    price_change: 5.00,
    availability: 'Available',
    status: 'Active',
    description: 'Premium white rice, highest quality grade'
  },
  {
    district: 'Gampaha',
    province: 'Western Province',
    market: 'Gampaha Center',
    variety: 'Nadu(Sudu)',
    type: 'Wet',
    price_per_kg: 138.00,
    previous_price: 135.00,
    currency: 'LKR',
    trend: 'rising',
    price_change: 3.00,
    availability: 'Available',
    status: 'Active',
    description: 'High quality white rice, Grade 1 standard'
  },
  {
    district: 'Kandy',
    province: 'Central Province',
    market: 'Kandy Center',
    variety: 'Nadu(Kekulu)',
    type: 'Dry',
    price_per_kg: 125.00,
    previous_price: 123.00,
    currency: 'LKR',
    trend: 'rising',
    price_change: 2.00,
    availability: 'Available',
    status: 'Active',
    description: 'Premium red rice variety'
  },
  {
    district: 'Anuradhapura',
    province: 'North Central Province',
    market: 'Anuradhapura Center',
    variety: 'Samba',
    type: 'Wet',
    price_per_kg: 160.00,
    previous_price: 155.00,
    currency: 'LKR',
    trend: 'rising',
    price_change: 5.00,
    availability: 'Available',
    status: 'Active',
    description: 'Traditional Samba variety, premium quality'
  },
  {
    district: 'Kurunegala',
    province: 'North Western Province',
    market: 'Kurunegala Center',
    variety: 'Kekululu',
    type: 'Dry',
    price_per_kg: 142.00,
    previous_price: 140.00,
    currency: 'LKR',
    trend: 'rising',
    price_change: 2.00,
    availability: 'Available',
    status: 'Active',
    description: 'Traditional red rice variety'
  }
];

// Insert sample data
const insertQuery = `
  INSERT INTO paddy_prices (
    district, province, market, variety, type, 
    price_per_kg, previous_price, currency, trend,
    price_change, availability, status, description,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`;

console.log('Adding sample price data...');

let count = 0;
samplePrices.forEach((price, index) => {
  const params = [
    price.district,
    price.province,
    price.market,
    price.variety,
    price.type,
    price.price_per_kg,
    price.previous_price,
    price.currency,
    price.trend,
    price.price_change,
    price.availability,
    price.status,
    price.description
  ];

  db.run(insertQuery, params, function(err) {
    if (err) {
      console.error(`Error inserting price ${index + 1}:`, err.message);
    } else {
      console.log(`✅ Inserted price ${index + 1}: ${price.variety} (${price.type}) - ${price.district} - LKR ${price.price_per_kg}/kg`);
      count++;
    }

    if (count === samplePrices.length) {
      console.log('\n✅ All sample prices added successfully!');
      db.close();
    }
  });
});
