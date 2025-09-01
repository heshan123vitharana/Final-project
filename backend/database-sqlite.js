require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('Setting up SQLite database...');

const dbPath = path.join(__dirname, 'paddy_management.db');

// Create database connection with error handling
let db;
try {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Error opening database:', err.message);
      process.exit(1);
    } else {
      console.log('✅ Connected to SQLite database at:', dbPath);
    }
  });
  
  // Configure database settings for better performance and reliability
  db.configure("busyTimeout", 1000);
  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA synchronous = NORMAL");
  db.run("PRAGMA cache_size = 1000");
  db.run("PRAGMA temp_store = memory");
  
} catch (error) {
  console.error('❌ Failed to create database connection:', error);
  process.exit(1);
}

// Promisify database methods with better error handling
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('❌ Database run error:', err.message, 'SQL:', sql);
        reject(err);
      } else {
        console.log('✅ Database operation successful:', { lastID: this.lastID, changes: this.changes });
        resolve(this);
      }
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('❌ Database query error:', err.message, 'SQL:', sql);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('❌ Database get error:', err.message, 'SQL:', sql);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Improved pool interface
const pool = {
  promise: () => ({
    execute: async (sql, params = []) => {
      try {
        if (sql.toLowerCase().trim().startsWith('select')) {
          const rows = await dbAll(sql, params);
          return [rows];
        } else {
          const result = await dbRun(sql, params);
          return [result];
        }
      } catch (error) {
        console.error('❌ Pool execute error:', error.message);
        throw error;
      }
    }
  })
};

// Initialize tables
const initializeTables = async () => {
  try {
    console.log('🔧 Initializing database tables...');
    
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        business_name TEXT NOT NULL,
        business_type TEXT NOT NULL CHECK(business_type IN ('private', 'government')),
        phone TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Admin table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admin table ready');

    // Insert default admin
    await dbRun(`
      INSERT OR IGNORE INTO admin (username, email, password, status) 
      VALUES ('admin01', 'admin@paddy.lk', 'admin123', 'active')
    `);
    console.log('✅ Default admin user ready');

    console.log('✅ SQLite database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Graceful shutdown handling
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
        reject(err);
      } else {
        console.log('✅ Database connection closed');
        resolve();
      }
    });
  });
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🔄 Received SIGINT. Closing database connection...');
  try {
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Received SIGTERM. Closing database connection...');
  try {
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
});

// Initialize on import with timeout
const initWithTimeout = async () => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database initialization timeout')), 10000);
    });
    
    await Promise.race([initializeTables(), timeoutPromise]);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};

initWithTimeout();

module.exports = pool.promise();