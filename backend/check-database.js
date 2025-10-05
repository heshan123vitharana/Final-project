const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'paddy_management.db');
console.log('🔍 Checking database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ SQLite connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
});

// Check if leadership table exists
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('❌ Error checking tables:', err.message);
    return;
  }
  
  console.log('📊 Available tables:');
  tables.forEach(table => console.log('  -', table.name));
  
  // Check leadership table structure
  db.all("PRAGMA table_info(leadership)", (err, columns) => {
    if (err) {
      console.error('❌ Error checking leadership table:', err.message);
      return;
    }
    
    console.log('\n📋 Leadership table structure:');
    columns.forEach(col => console.log(`  - ${col.name}: ${col.type}`));
    
    // Check data in leadership table
    db.all("SELECT * FROM leadership LIMIT 5", (err, rows) => {
      if (err) {
        console.error('❌ Error querying leadership:', err.message);
      } else {
        console.log('\n📊 Leadership data (first 5 rows):');
        rows.forEach(row => console.log('  -', row));
      }
      
      db.close();
    });
  });
});