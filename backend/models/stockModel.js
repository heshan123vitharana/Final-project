// models/stockModel.js
const db = require('../database');

class StockModel {
  // Create stock entries table
  static async initializeStockTables() {
    try {
      // Stock entries table
      await db.execute(`
        CREATE TABLE IF NOT EXISTS stock_entries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          mill_id INT NOT NULL,
          farmer_id VARCHAR(50) NOT NULL,
          farmer_name VARCHAR(255) NOT NULL,
          paddy_type ENUM('Nadu - White', 'Nadu - Red', 'Samba', 'Kiri Samba') NOT NULL,
          paddy_condition ENUM('Wet', 'Dry') NOT NULL,
          quantity DECIMAL(10,2) NOT NULL,
          region ENUM('North', 'South', 'Central') NOT NULL,
          entry_date DATE NOT NULL,
          price_per_kg DECIMAL(8,2) NOT NULL,
          total_amount DECIMAL(12,2) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (mill_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Stock summary view for quick access
      await db.execute(`
        CREATE TABLE IF NOT EXISTS stock_summary (
          id INT AUTO_INCREMENT PRIMARY KEY,
          mill_id INT NOT NULL,
          paddy_type ENUM('Nadu - White', 'Nadu - Red', 'Samba', 'Kiri Samba') NOT NULL,
          paddy_condition ENUM('Wet', 'Dry') NOT NULL,
          region ENUM('North', 'South', 'Central') NOT NULL,
          total_quantity DECIMAL(12,2) DEFAULT 0,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (mill_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_stock (mill_id, paddy_type, paddy_condition, region)
        )
      `);

      console.log('✅ Stock tables initialized successfully');
    } catch (error) {
      console.error('❌ Stock table initialization error:', error);
      throw error;
    }
  }

  // Add new stock entry
  static async addStockEntry(stockData) {
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

      // Insert stock entry
      const [result] = await db.execute(`
        INSERT INTO stock_entries 
        (mill_id, farmer_id, farmer_name, paddy_type, paddy_condition, quantity, region, entry_date, price_per_kg, total_amount, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [mill_id, farmer_id, farmer_name, paddy_type, paddy_condition, quantity, region, entry_date, price_per_kg, total_amount, notes]);

      // Update stock summary
      await this.updateStockSummary(mill_id, paddy_type, paddy_condition, region, quantity);

      return {
        id: result.insertId,
        ...stockData,
        total_amount
      };
    } catch (error) {
      console.error('❌ Add stock entry error:', error);
      throw error;
    }
  }

  // Update stock summary
  static async updateStockSummary(mill_id, paddy_type, paddy_condition, region, quantity_change) {
    try {
      // Check if summary record exists
      const [existing] = await db.execute(`
        SELECT total_quantity FROM stock_summary 
        WHERE mill_id = ? AND paddy_type = ? AND paddy_condition = ? AND region = ?
      `, [mill_id, paddy_type, paddy_condition, region]);

      if (existing.length > 0) {
        // Update existing record
        const new_quantity = parseFloat(existing[0].total_quantity) + parseFloat(quantity_change);
        await db.execute(`
          UPDATE stock_summary 
          SET total_quantity = ?
          WHERE mill_id = ? AND paddy_type = ? AND paddy_condition = ? AND region = ?
        `, [new_quantity, mill_id, paddy_type, paddy_condition, region]);
      } else {
        // Create new summary record
        await db.execute(`
          INSERT INTO stock_summary (mill_id, paddy_type, paddy_condition, region, total_quantity)
          VALUES (?, ?, ?, ?, ?)
        `, [mill_id, paddy_type, paddy_condition, region, quantity_change]);
      }
    } catch (error) {
      console.error('❌ Update stock summary error:', error);
      throw error;
    }
  }

  // Get all stock entries for a mill
  static async getStockEntries(mill_id, filters = {}) {
    try {
      let query = `
        SELECT * FROM stock_entries 
        WHERE mill_id = ?
      `;
      let params = [mill_id];

      // Apply filters
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

      const [entries] = await db.execute(query, params);
      return entries;
    } catch (error) {
      console.error('❌ Get stock entries error:', error);
      throw error;
    }
  }

  // Get stock summary for a mill
  static async getStockSummary(mill_id) {
    try {
      const [summary] = await db.execute(`
        SELECT paddy_type, paddy_condition, region, total_quantity, last_updated
        FROM stock_summary 
        WHERE mill_id = ? AND total_quantity > 0
        ORDER BY paddy_type, paddy_condition, region
      `, [mill_id]);

      return summary;
    } catch (error) {
      console.error('❌ Get stock summary error:', error);
      throw error;
    }
  }

  // Get stock statistics for dashboard
  static async getStockStats(mill_id) {
    try {
      const [stats] = await db.execute(`
        SELECT 
          COUNT(*) as total_entries,
          SUM(quantity) as total_quantity,
          SUM(total_amount) as total_value,
          COUNT(DISTINCT farmer_id) as total_farmers
        FROM stock_entries 
        WHERE mill_id = ?
      `, [mill_id]);

      const [typeBreakdown] = await db.execute(`
        SELECT 
          paddy_type,
          paddy_condition,
          SUM(total_quantity) as quantity
        FROM stock_summary
        WHERE mill_id = ? AND total_quantity > 0
        GROUP BY paddy_type, paddy_condition
        ORDER BY paddy_type, paddy_condition
      `, [mill_id]);

      return {
        general: stats[0] || {},
        breakdown: typeBreakdown || []
      };
    } catch (error) {
      console.error('❌ Get stock stats error:', error);
      throw error;
    }
  }

  // Delete stock entry (and update summary)
  static async deleteStockEntry(id, mill_id) {
    try {
      // Get entry details before deletion
      const [entry] = await db.execute(`
        SELECT paddy_type, paddy_condition, region, quantity 
        FROM stock_entries 
        WHERE id = ? AND mill_id = ?
      `, [id, mill_id]);

      if (entry.length === 0) {
        throw new Error('Stock entry not found');
      }

      // Delete the entry
      await db.execute(`
        DELETE FROM stock_entries 
        WHERE id = ? AND mill_id = ?
      `, [id, mill_id]);

      // Update summary (subtract the quantity)
      const { paddy_type, paddy_condition, region, quantity } = entry[0];
      await this.updateStockSummary(mill_id, paddy_type, paddy_condition, region, -quantity);

      return { message: 'Stock entry deleted successfully' };
    } catch (error) {
      console.error('❌ Delete stock entry error:', error);
      throw error;
    }
  }
}

module.exports = StockModel;