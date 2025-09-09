
import { getDB } from '../db.js';

// Helper: run SQL with Promise
function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function getAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function allAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function initializeStockTables() {
  const db = getDB();
  try {
    await runAsync(db, `CREATE TABLE IF NOT EXISTS stock_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mill_id INTEGER NOT NULL,
      farmer_id TEXT NOT NULL,
      farmer_name TEXT NOT NULL,
      paddy_type TEXT NOT NULL,
      paddy_condition TEXT NOT NULL,
      quantity REAL NOT NULL,
      region TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      price_per_kg REAL NOT NULL,
      total_amount REAL NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    await runAsync(db, `CREATE TABLE IF NOT EXISTS stock_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mill_id INTEGER NOT NULL,
      paddy_type TEXT NOT NULL,
      paddy_condition TEXT NOT NULL,
      region TEXT NOT NULL,
      total_quantity REAL DEFAULT 0,
      last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (mill_id, paddy_type, paddy_condition, region)
    )`);
    console.log('Stock tables initialized successfully');
  } catch (error) {
    console.error('Stock table initialization error:', error);
    throw error;
  }
}

export async function addStockEntry(stockData) {
  const db = getDB();
  try {
    const {
      mill_id,
      farmer_id,
      farmer_name,
      paddy_type,
      paddy_condition,
      quantity,
      region,
      entry_date,
      price_per_kg,
      notes
    } = stockData;
    const total_amount = quantity * price_per_kg;
    await runAsync(db, `INSERT INTO stock_entries (mill_id, farmer_id, farmer_name, paddy_type, paddy_condition, quantity, region, entry_date, price_per_kg, total_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [mill_id, farmer_id, farmer_name, paddy_type, paddy_condition, quantity, region, entry_date, price_per_kg, total_amount, notes]);
    await updateStockSummary(mill_id, paddy_type, paddy_condition, region, quantity);
    return { ...stockData, total_amount };
  } catch (error) {
    console.error('Add stock entry error:', error);
    throw error;
  }
}

export async function updateStockSummary(mill_id, paddy_type, paddy_condition, region, quantity_change) {
  const db = getDB();
  try {
    const existing = await getAsync(db, `SELECT total_quantity FROM stock_summary WHERE mill_id = ? AND paddy_type = ? AND paddy_condition = ? AND region = ?`, [mill_id, paddy_type, paddy_condition, region]);
    if (existing) {
      const new_quantity = parseFloat(existing.total_quantity) + parseFloat(quantity_change);
      await runAsync(db, `UPDATE stock_summary SET total_quantity = ? WHERE mill_id = ? AND paddy_type = ? AND paddy_condition = ? AND region = ?`, [new_quantity, mill_id, paddy_type, paddy_condition, region]);
    } else {
      await runAsync(db, `INSERT INTO stock_summary (mill_id, paddy_type, paddy_condition, region, total_quantity) VALUES (?, ?, ?, ?, ?)`, [mill_id, paddy_type, paddy_condition, region, quantity_change]);
    }
  } catch (error) {
    console.error('Update stock summary error:', error);
    throw error;
  }
}

export async function getStockEntries(mill_id, filters = {}) {
  const db = getDB();
  try {
    let query = `SELECT * FROM stock_entries WHERE mill_id = ?`;
    let params = [mill_id];
    if (filters.paddy_type) {
      query += ' AND paddy_type = ?';
      params.push(filters.paddy_type);
    }
    if (filters.paddy_condition) {
      query += ' AND paddy_condition = ?';
      params.push(filters.paddy_condition);
    }
    if (filters.region) {
      query += ' AND region = ?';
      params.push(filters.region);
    }
    if (filters.date_from) {
      query += ' AND entry_date >= ?';
      params.push(filters.date_from);
    }
    if (filters.date_to) {
      query += ' AND entry_date <= ?';
      params.push(filters.date_to);
    }
    query += ' ORDER BY entry_date DESC, created_at DESC';
    const rows = await allAsync(db, query, params);
    return rows;
  } catch (error) {
    console.error('Get stock entries error:', error);
    throw error;
  }
}

export async function getStockSummary(mill_id) {
  const db = getDB();
  try {
    const rows = await allAsync(db, `SELECT paddy_type, paddy_condition, region, total_quantity, last_updated FROM stock_summary WHERE mill_id = ? AND total_quantity > 0 ORDER BY paddy_type, paddy_condition, region`, [mill_id]);
    return rows;
  } catch (error) {
    console.error('Get stock summary error:', error);
    throw error;
  }
}

export async function getStockStats(mill_id) {
  const db = getDB();
  try {
    const stats = await getAsync(db, `SELECT COUNT(*) as total_entries, SUM(quantity) as total_quantity, SUM(total_amount) as total_value, COUNT(DISTINCT farmer_id) as total_farmers FROM stock_entries WHERE mill_id = ?`, [mill_id]);
    const breakdown = await allAsync(db, `SELECT paddy_type, paddy_condition, SUM(total_quantity) as quantity FROM stock_summary WHERE mill_id = ? AND total_quantity > 0 GROUP BY paddy_type, paddy_condition ORDER BY paddy_type, paddy_condition`, [mill_id]);
    return { general: stats || {}, breakdown: breakdown || [] };
  } catch (error) {
    console.error('Get stock stats error:', error);
    throw error;
  }
}

export async function deleteStockEntry(id, mill_id) {
  const db = getDB();
  try {
    const entry = await getAsync(db, `SELECT paddy_type, paddy_condition, region, quantity FROM stock_entries WHERE id = ? AND mill_id = ?`, [id, mill_id]);
    if (!entry) {
      throw new Error('Stock entry not found');
    }
    await runAsync(db, `DELETE FROM stock_entries WHERE id = ? AND mill_id = ?`, [id, mill_id]);
    const { paddy_type, paddy_condition, region, quantity } = entry;
    await updateStockSummary(mill_id, paddy_type, paddy_condition, region, -quantity);
    return { message: 'Stock entry deleted successfully' };
  } catch (error) {
    console.error('Delete stock entry error:', error);
    throw error;
  }
}