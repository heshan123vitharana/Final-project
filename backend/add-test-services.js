const db = require('./database');

async function addTestData() {
  try {
    console.log('Adding test services and excellence data...');
    
    // Add test services
    await db.execute(`
      INSERT INTO services (title, description, category, priority, is_active) 
      VALUES 
      ('Rice Quality Testing', 'Professional quality testing services for rice products', 'service', 3, 1),
      ('Mill Maintenance', 'Regular maintenance and repair services for rice mills', 'service', 2, 1),
      ('Storage Solutions', 'Advanced storage solutions to preserve rice quality', 'feature', 1, 1)
    `);
    console.log('✅ Test services added');
    
    // Add test excellence items
    await db.execute(`
      INSERT INTO excellence_items (title, description, type, priority, status) 
      VALUES 
      ('ISO 9001 Certification', 'International quality management certification', 'certification', 3, 'active'),
      ('Best Rice Mill Award 2024', 'Awarded for excellence in rice processing', 'award', 2, 'active'),
      ('5000+ Satisfied Customers', 'Milestone of serving over 5000 customers', 'milestone', 1, 'active')
    `);
    console.log('✅ Test excellence items added');
    
    // Verify data
    const [services] = await db.execute('SELECT * FROM services');
    const [excellence] = await db.execute('SELECT * FROM excellence_items');
    
    console.log('Services count:', services.length);
    console.log('Excellence items count:', excellence.length);
    
  } catch (error) {
    console.error('Error adding test data:', error);
  }
  
  process.exit();
}

addTestData();