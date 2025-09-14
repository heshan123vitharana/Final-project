const StockModel = require('./models/stockModel');

async function addSampleStockData() {
  console.log('📊 Adding sample stock data...');

  const sampleStockEntries = [
    // Dry paddy entries
    {
      mill_id: 1, // Test user ID
      farmer_id: 'F001',
      farmer_name: 'Saman Perera',
      paddy_type: 'Nadu - White',
      paddy_condition: 'Dry',
      quantity: 500,
      region: 'Central',
      entry_date: '2024-09-10',
      price_per_kg: 85.50,
      notes: 'High quality Nadu white paddy from Central province'
    },
    {
      mill_id: 1,
      farmer_id: 'F002',
      farmer_name: 'Kamal Silva',
      paddy_type: 'Samba',
      paddy_condition: 'Dry',
      quantity: 750,
      region: 'South',
      entry_date: '2024-09-11',
      price_per_kg: 88.00,
      notes: 'Premium Samba variety'
    },
    {
      mill_id: 1,
      farmer_id: 'F003',
      farmer_name: 'Nimal Fernando',
      paddy_type: 'Nadu - Red',
      paddy_condition: 'Dry',
      quantity: 300,
      region: 'North',
      entry_date: '2024-09-12',
      price_per_kg: 92.25,
      notes: 'Organic Nadu red paddy'
    },
    {
      mill_id: 1,
      farmer_id: 'F004',
      farmer_name: 'Pradeep Jayasinghe',
      paddy_type: 'Kiri Samba',
      paddy_condition: 'Dry',
      quantity: 425,
      region: 'Central',
      entry_date: '2024-09-13',
      price_per_kg: 95.00,
      notes: 'Premium Kiri Samba variety'
    },

    // Wet paddy entries
    {
      mill_id: 1,
      farmer_id: 'F005',
      farmer_name: 'Ranjith Kumara',
      paddy_type: 'Nadu - White',
      paddy_condition: 'Wet',
      quantity: 600,
      region: 'South',
      entry_date: '2024-09-09',
      price_per_kg: 78.50,
      notes: 'Fresh wet Nadu white paddy'
    },
    {
      mill_id: 1,
      farmer_id: 'F006',
      farmer_name: 'Sunil Ratnaike',
      paddy_type: 'Samba',
      paddy_condition: 'Wet',
      quantity: 800,
      region: 'Central',
      entry_date: '2024-09-10',
      price_per_kg: 80.75,
      notes: 'Good quality wet Samba'
    },
    {
      mill_id: 1,
      farmer_id: 'F007',
      farmer_name: 'Chaminda Perera',
      paddy_type: 'Nadu - Red',
      paddy_condition: 'Wet',
      quantity: 350,
      region: 'North',
      entry_date: '2024-09-11',
      price_per_kg: 83.25,
      notes: 'Wet Nadu red variety'
    },
    {
      mill_id: 1,
      farmer_id: 'F008',
      farmer_name: 'Mahesh Gunasekara',
      paddy_type: 'Kiri Samba',
      paddy_condition: 'Wet',
      quantity: 275,
      region: 'South',
      entry_date: '2024-09-12',
      price_per_kg: 87.50,
      notes: 'Premium wet Kiri Samba'
    },

    // Additional entries for variety
    {
      mill_id: 1,
      farmer_id: 'F009',
      farmer_name: 'Lalith Mendis',
      paddy_type: 'Nadu - White',
      paddy_condition: 'Dry',
      quantity: 450,
      region: 'South',
      entry_date: '2024-09-13',
      price_per_kg: 86.00,
      notes: 'Additional Nadu white stock'
    },
    {
      mill_id: 1,
      farmer_id: 'F010',
      farmer_name: 'Upul Wickramasinghe',
      paddy_type: 'Samba',
      paddy_condition: 'Wet',
      quantity: 650,
      region: 'North',
      entry_date: '2024-09-14',
      price_per_kg: 81.25,
      notes: 'Fresh Samba delivery'
    }
  ];

  try {
    for (const entry of sampleStockEntries) {
      await StockModel.addStockEntry(entry);
      console.log(`✅ Added stock entry: ${entry.quantity}MT ${entry.paddy_condition} ${entry.paddy_type} from ${entry.farmer_name}`);
    }

    console.log('🎉 Sample stock data added successfully!');
    console.log('📊 Summary:');

    // Get summary to verify
    const summary = await StockModel.getStockSummary(1);
    summary.forEach(item => {
      console.log(`- ${item.paddy_type} (${item.paddy_condition}) - ${item.region}: ${item.total_quantity} MT`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample stock data:', error);
    process.exit(1);
  }
}

addSampleStockData();