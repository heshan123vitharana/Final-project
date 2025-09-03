const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const setupSQLiteDatabase = () => {
  const dbPath = path.join(__dirname, 'paddy_management.db');
  const db = new sqlite3.Database(dbPath);

  console.log('🔄 Setting up SQLite database...');

  db.serialize(() => {
    // Create paddy_prices table
    db.run(`
      CREATE TABLE IF NOT EXISTS paddy_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district TEXT NOT NULL,
        province TEXT NOT NULL,
        market TEXT NOT NULL,
        variety TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'Wet',
        price_per_kg REAL NOT NULL,
        previous_price REAL,
        currency TEXT DEFAULT 'LKR',
        trend TEXT DEFAULT 'stable',
        price_change REAL DEFAULT 0,
        availability TEXT DEFAULT 'Available',
        status TEXT DEFAULT 'Active',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('❌ Error creating paddy_prices table:', err.message);
      } else {
        console.log('✅ Paddy prices table created successfully');
      }
    });

    // Insert sample paddy price data
    const paddyPrices = [
      [1, 'Colombo', 'Western', 'Pettah', 'Nadu', 'Wet', 210.00, 205.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'Premium white rice, highest quality grade'],
      [2, 'Kandy', 'Central', 'Good Shed', 'Samba', 'Wet', 245.00, 248.00, 'LKR', 'falling', -3.00, 'Available', 'Active', 'High quality samba rice'],
      [3, 'Galle', 'Southern', 'Galle Town', 'Nadu', 'Wet', 205.00, 205.00, 'LKR', 'stable', 0.00, 'Available', 'Active', 'Standard quality nadu rice'],
      [4, 'Kurunegala', 'North Western', 'Kurunegala City', 'Keeri Samba', 'Wet', 270.00, 262.00, 'LKR', 'rising', 8.00, 'Available', 'Active', 'Premium keeri samba variety'],
      [5, 'Anuradhapura', 'North Central', 'Central Market', 'Nadu', 'Wet', 195.00, 192.00, 'LKR', 'rising', 3.00, 'Available', 'Active', 'Good quality nadu rice'],
      [6, 'Badulla', 'Uva', 'Badulla Market', 'Red Nadu', 'Wet', 220.00, 225.00, 'LKR', 'falling', -5.00, 'Available', 'Active', 'Traditional red rice variety'],
      [7, 'Colombo', 'Western', 'Manning Market', 'Samba', 'Dry', 280.00, 275.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'Dry samba rice for storage'],
      [8, 'Gampaha', 'Western', 'Negombo', 'Nadu', 'Wet', 200.00, 198.00, 'LKR', 'rising', 2.00, 'Available', 'Active', 'Fresh nadu rice from coastal region'],
      [9, 'Kalutara', 'Western', 'Kalutara Market', 'Basmati', 'Dry', 350.00, 345.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'Imported basmati quality rice'],
      [10, 'Ratnapura', 'Sabaragamuwa', 'Gem City Market', 'Samba', 'Wet', 230.00, 235.00, 'LKR', 'falling', -5.00, 'Available', 'Active', 'Local samba variety'],
      [11, 'Matara', 'Southern', 'Matara Center', 'White Rice', 'Wet', 260.00, 255.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'White rice variety'],
      [12, 'Hambantota', 'Southern', 'Hambantota Market', 'Red Rice', 'Wet', 240.00, 242.00, 'LKR', 'falling', -2.00, 'Available', 'Active', 'Red rice variety'],
      [13, 'Jaffna', 'Northern', 'Jaffna Central', 'Basmati', 'Dry', 380.00, 375.00, 'LKR', 'rising', 5.00, 'Available', 'Active', 'Premium basmati variety'],
      [14, 'Trincomalee', 'Eastern', 'Trinco Market', 'Nadu', 'Wet', 190.00, 188.00, 'LKR', 'rising', 2.00, 'Available', 'Active', 'Coastal nadu rice'],
      [15, 'Puttalam', 'North Western', 'Puttalam Market', 'Samba', 'Wet', 235.00, 240.00, 'LKR', 'falling', -5.00, 'Available', 'Active', 'Local samba variety']
    ];

    const insertPriceStmt = db.prepare(`
      INSERT OR IGNORE INTO paddy_prices (
        id, district, province, market, variety, type, 
        price_per_kg, previous_price, currency, trend, 
        price_change, availability, status, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    paddyPrices.forEach((price, index) => {
      insertPriceStmt.run(price, (err) => {
        if (err) {
          console.error(`❌ Error inserting price ${index + 1}:`, err.message);
        }
      });
    });

    insertPriceStmt.finalize((err) => {
      if (err) {
        console.error('❌ Error finalizing price insert:', err.message);
      } else {
        console.log('✅ Sample paddy prices inserted successfully');
      }
    });

    // Create trigger to update updated_at timestamp
    db.run(`
      CREATE TRIGGER IF NOT EXISTS update_paddy_prices_updated_at 
      AFTER UPDATE ON paddy_prices
      BEGIN
        UPDATE paddy_prices SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `, (err) => {
      if (err) {
        console.error('❌ Error creating trigger:', err.message);
      } else {
        console.log('✅ Updated timestamp trigger created');
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('🎉 SQLite database setup completed successfully!');
    }
  });
};

if (require.main === module) {
  setupSQLiteDatabase();
}

module.exports = setupSQLiteDatabase;