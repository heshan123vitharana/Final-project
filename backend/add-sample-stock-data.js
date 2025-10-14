const db = require('./database');
const StockModel = require('./models/stockModel');

const sampleMills = [
  {
    key: 'private-colombo',
    first_name: 'Gayan',
    last_name: 'Fernando',
    business_name: 'Colombo Premium Mills',
    business_type: 'private',
    phone: '0771234567',
    email: 'demo-private-colombo@pmb.lk',
    mill_district: 'Colombo',
    district: 'Colombo',
    mill_capacity: '1500',
  },
  {
    key: 'private-galle',
    first_name: 'Sameera',
    last_name: 'Silva',
    business_name: 'Southern Grain Hub',
    business_type: 'private',
    phone: '0779876543',
    email: 'demo-private-galle@pmb.lk',
    mill_district: 'Galle',
    district: 'Galle',
    mill_capacity: '1100',
  },
  {
    key: 'government-kurunegala',
    first_name: 'Nuwan',
    last_name: 'Jayasinghe',
    business_name: 'Kurunegala State Mill',
    business_type: 'government',
    phone: '0112345678',
    email: 'demo-gov-kurunegala@pmb.lk',
    mill_district: 'Kurunegala',
    district: 'Kurunegala',
    mill_capacity: '1800',
  },
  {
    key: 'government-anuradhapura',
    first_name: 'Ishara',
    last_name: 'Perera',
    business_name: 'North Central Farm Services',
    business_type: 'government',
    phone: '0118765432',
    email: 'demo-gov-anuradhapura@pmb.lk',
    mill_district: 'Anuradhapura',
    district: 'Anuradhapura',
    mill_capacity: '1400',
  },
];

const sampleStockEntries = [
  {
    millKey: 'private-colombo',
    farmer_id: 'PC-F001',
    farmer_name: 'Saman Perera',
    paddy_type: 'Nadu - White',
    paddy_condition: 'Dry',
    quantity: 520,
    region: 'Western',
    entry_date: '2025-01-05',
    price_per_kg: 86.5,
    notes: 'Fresh Nadu white delivery from Western province',
  },
  {
    millKey: 'private-colombo',
    farmer_id: 'PC-F002',
    farmer_name: 'Kamal Silva',
    paddy_type: 'Samba',
    paddy_condition: 'Wet',
    quantity: 480,
    region: 'Western',
    entry_date: '2025-01-08',
    price_per_kg: 81.75,
    notes: 'Wet Samba batch awaiting drying process',
  },
  {
    millKey: 'private-galle',
    farmer_id: 'PG-F001',
    farmer_name: 'Ranjith Kumara',
    paddy_type: 'Nadu - Red',
    paddy_condition: 'Dry',
    quantity: 430,
    region: 'Southern',
    entry_date: '2025-01-03',
    price_per_kg: 89.2,
    notes: 'Southern province red Nadu variety',
  },
  {
    millKey: 'private-galle',
    farmer_id: 'PG-F002',
    farmer_name: 'Sunil Ratnaike',
    paddy_type: 'Kiri Samba',
    paddy_condition: 'Wet',
    quantity: 360,
    region: 'Southern',
    entry_date: '2025-01-10',
    price_per_kg: 92.8,
    notes: 'Premium Kiri Samba stock',
  },
  {
    millKey: 'government-kurunegala',
    farmer_id: 'GK-F001',
    farmer_name: 'Nimal Fernando',
    paddy_type: 'Nadu - White',
    paddy_condition: 'Dry',
    quantity: 680,
    region: 'North Western',
    entry_date: '2025-01-06',
    price_per_kg: 84.9,
    notes: 'Government collection from North Western',
  },
  {
    millKey: 'government-kurunegala',
    farmer_id: 'GK-F002',
    farmer_name: 'Pradeep Jayasinghe',
    paddy_type: 'Samba',
    paddy_condition: 'Wet',
    quantity: 540,
    region: 'North Western',
    entry_date: '2025-01-11',
    price_per_kg: 79.5,
    notes: 'Wet Samba shipment for drying facilities',
  },
  {
    millKey: 'government-anuradhapura',
    farmer_id: 'GA-F001',
    farmer_name: 'Upul Wickramasinghe',
    paddy_type: 'Nadu - Red',
    paddy_condition: 'Dry',
    quantity: 590,
    region: 'North Central',
    entry_date: '2025-01-07',
    price_per_kg: 87.3,
    notes: 'North Central Nadu red stock',
  },
  {
    millKey: 'government-anuradhapura',
    farmer_id: 'GA-F002',
    farmer_name: 'Mahesh Gunasekara',
    paddy_type: 'Kiri Samba',
    paddy_condition: 'Wet',
    quantity: 410,
    region: 'North Central',
    entry_date: '2025-01-12',
    price_per_kg: 90.4,
    notes: 'Wet Kiri Samba awaiting processing',
  },
];

async function ensureSampleMills() {
  const keyToId = new Map();

  for (const mill of sampleMills) {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [mill.email]);

    let millId;
    if (existing.length) {
      millId = existing[0].id;
      await db.execute(
        `UPDATE users
         SET business_type = ?, mill_district = ?, district = ?, mill_capacity = ?, business_name = ?
         WHERE id = ?`,
        [mill.business_type, mill.mill_district, mill.district, mill.mill_capacity, mill.business_name, millId]
      );
    } else {
      const [result] = await db.execute(
        `INSERT INTO users
          (first_name, last_name, business_name, business_type, phone, email, password, mill_district, district, mill_capacity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        , [
          mill.first_name,
          mill.last_name,
          mill.business_name,
          mill.business_type,
          mill.phone,
          mill.email,
          'password123',
          mill.mill_district,
          mill.district,
          mill.mill_capacity,
        ]
      );
      millId = result.insertId;
    }

    keyToId.set(mill.key, millId);
  }

  return keyToId;
}

async function addSampleStockData() {
  console.log('📊 Adding sample stock data for multiple mills...');

  try {
    const keyToId = await ensureSampleMills();

    for (const entry of sampleStockEntries) {
      const millId = keyToId.get(entry.millKey);
      if (!millId) {
        console.warn(`⚠️ Skipping entry for ${entry.millKey}; mill not found.`);
        continue;
      }

      await StockModel.addStockEntry({
        ...entry,
        mill_id: millId,
      });

      console.log(
        `✅ Added ${entry.quantity}kg ${entry.paddy_condition} ${entry.paddy_type} to mill ${entry.millKey}`
      );
    }

    console.log('🎉 Sample stock data added successfully!');
    console.log('📊 Summary by mill:');

    for (const [key, id] of keyToId.entries()) {
      const summary = await StockModel.getStockSummary(id);
      if (!summary.length) {
        console.log(`  • ${key}: no stock entries recorded.`);
        continue;
      }

      console.log(`  • ${key} (ID ${id})`);
      summary.forEach((item) => {
        console.log(
          `     - ${item.paddy_type} (${item.paddy_condition}) - ${item.region}: ${item.total_quantity} MT`
        );
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample stock data:', error);
    process.exit(1);
  }
}

addSampleStockData();