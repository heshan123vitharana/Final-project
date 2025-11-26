// models/stockModel.js
const db = require('../config/database');

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
          region ENUM('North', 'South', 'Central') DEFAULT 'Central',
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
          region ENUM('North', 'South', 'Central') DEFAULT 'Central',
          total_quantity DECIMAL(12,2) DEFAULT 0,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (mill_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_stock (mill_id, paddy_type, paddy_condition, region)
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS stock_reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          mill_id INT NOT NULL,
          report_type VARCHAR(50) NOT NULL,
          period_start DATE,
          period_end DATE,
          summary_payload LONGTEXT,
          total_entries INT DEFAULT 0,
          total_quantity DECIMAL(12,2) DEFAULT 0,
          total_value DECIMAL(14,2) DEFAULT 0,
          notes TEXT,
          status ENUM('submitted', 'acknowledged', 'rejected') DEFAULT 'submitted',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (mill_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_stock_reports_mill_created (mill_id, created_at)
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
      const finalRegion = region || 'Central'; // Default to Central if no region provided

      // Insert stock entry
      const [result] = await db.execute(`
        INSERT INTO stock_entries
        (mill_id, farmer_id, farmer_name, paddy_type, paddy_condition, quantity, region, entry_date, price_per_kg, total_amount, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [mill_id, farmer_id, farmer_name, paddy_type, paddy_condition, quantity, finalRegion, entry_date, price_per_kg, total_amount, notes]);

      // Update stock summary
      await this.updateStockSummary(mill_id, paddy_type, paddy_condition, finalRegion, quantity);

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

  static parseCapacity(value) {
    if (!value) return 0;

    const asString = String(value).trim();
    if (!asString) return 0;

    const match = asString.replace(',', '').match(/\d+(\.\d+)?/);
    if (!match) return 0;

    const parsed = parseFloat(match[0]);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  static async getAggregatedStockOverview() {
    try {
      console.log('📊 Starting aggregated stock overview query...');

      const [rows] = await db.execute(`
        SELECT 
          u.id AS mill_id,
          u.business_name,
          u.business_type,
          COALESCE(u.mill_district, u.district, 'Unknown') AS district,
          u.mill_capacity,
          COALESCE(SUM(ss.total_quantity), 0) AS total_quantity,
          MAX(ss.last_updated) AS last_updated
        FROM users u
        LEFT JOIN stock_summary ss ON ss.mill_id = u.id
        WHERE u.business_type IN ('private', 'government')
        GROUP BY u.id, u.business_name, u.business_type, u.mill_district, u.district, u.mill_capacity
      `);

      console.log(`✅ Found ${rows.length} mills in database`);

      let latestEntryUpdate = null;

      try {
        const [latestUpdateResult] = await db.execute(`
          SELECT MAX(updated_at) AS last_updated
          FROM stock_entries
        `);

        latestEntryUpdate = latestUpdateResult?.[0]?.last_updated || null;
      } catch (innerError) {
        console.warn('⚠️ Unable to retrieve last stock entry update:', innerError.message);
      }

      const overview = {
        privateVsGovernmentStock: [
          { name: 'Private Mills', current: 0, capacity: 0, percentage: 0 },
          { name: 'Government Mills', current: 0, capacity: 0, percentage: 0 }
        ],
        stockByDistrict: [],
        stockByMill: [],
        summary: {
          totalStock: 0,
          totalCapacity: 0,
          utilizationRate: 0,
          activeMills: 0
        },
        lastUpdated: latestEntryUpdate
      };

      if (!rows || rows.length === 0) {
        return overview;
      }

      const districtMap = new Map();

      rows.forEach((row) => {
        const quantity = parseFloat(row.total_quantity) || 0;
        const capacity = StockModel.parseCapacity(row.mill_capacity);
        const type = (row.business_type || '').toLowerCase();
        const district = row.district || 'Unknown';

        if (type === 'private') {
          overview.privateVsGovernmentStock[0].current += quantity;
          overview.privateVsGovernmentStock[0].capacity += capacity;
        } else if (type === 'government') {
          overview.privateVsGovernmentStock[1].current += quantity;
          overview.privateVsGovernmentStock[1].capacity += capacity;
        }

        overview.summary.totalStock += quantity;
        overview.summary.totalCapacity += capacity;

        if (quantity > 0) {
          overview.summary.activeMills += 1;
        }

        if (!districtMap.has(district)) {
          districtMap.set(district, {
            district,
            private: 0,
            government: 0,
            total: 0
          });
        }

        const districtTotals = districtMap.get(district);
        if (type === 'private') {
          districtTotals.private += quantity;
        } else if (type === 'government') {
          districtTotals.government += quantity;
        }
        districtTotals.total += quantity;

        const utilization = capacity > 0 ? Math.round((quantity / capacity) * 100) : 0;

        overview.stockByMill.push({
          mill: row.business_name || `Mill ${row.mill_id}`,
          stock: Math.round(quantity * 100) / 100,
          capacity: capacity ? Math.round(capacity * 100) / 100 : 0,
          utilization,
          type: type === 'government' ? 'Government' : 'Private'
        });
      });

      overview.privateVsGovernmentStock = overview.privateVsGovernmentStock.map((entry) => ({
        ...entry,
        current: Math.round(entry.current * 100) / 100,
        capacity: Math.round(entry.capacity * 100) / 100,
        percentage: entry.capacity > 0 ? Math.round((entry.current / entry.capacity) * 100) : 0
      }));

      overview.summary.totalStock = Math.round(overview.summary.totalStock * 100) / 100;
      overview.summary.totalCapacity = Math.round(overview.summary.totalCapacity * 100) / 100;
      overview.summary.utilizationRate = overview.summary.totalCapacity > 0
        ? Math.round((overview.summary.totalStock / overview.summary.totalCapacity) * 100)
        : 0;

      overview.stockByDistrict = Array.from(districtMap.values())
        .filter((district) => district.total > 0)
        .sort((a, b) => b.total - a.total)
        .map((district) => ({
          ...district,
          private: Math.round(district.private * 100) / 100,
          government: Math.round(district.government * 100) / 100,
          total: Math.round(district.total * 100) / 100
        }));

      overview.stockByMill.sort((a, b) => b.stock - a.stock);

      if (!overview.lastUpdated) {
        const maxLastUpdated = rows.reduce((latest, row) => {
          const current = row.last_updated ? new Date(row.last_updated) : null;
          if (!current) return latest;
          return !latest || current > latest ? current : latest;
        }, null);

        overview.lastUpdated = maxLastUpdated ? maxLastUpdated.toISOString() : null;
      }

      return overview;
    } catch (error) {
      console.error('❌ Aggregated stock overview error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  }

  static async getRecentStockEntries(limit) {
    try {
      // Ensure limit is always a valid integer for MySQL
      let sanitizedLimit = 10; // default

      if (limit !== undefined && limit !== null) {
        const parsed = parseInt(limit, 10);
        if (!isNaN(parsed) && parsed > 0) {
          sanitizedLimit = Math.min(Math.max(parsed, 1), 50);
        }
      }

      console.log(`📥 Fetching recent stock entries with limit: ${sanitizedLimit} (type: ${typeof sanitizedLimit})`);

      const query = `
        SELECT 
          se.id,
          se.mill_id,
          se.farmer_name,
          se.paddy_type,
          se.paddy_condition,
          se.quantity,
          se.region,
          se.entry_date,
          se.created_at,
          se.price_per_kg,
          se.total_amount,
          u.business_name,
          u.business_type,
          COALESCE(u.mill_district, u.district) AS district
        FROM stock_entries se
        JOIN users u ON se.mill_id = u.id
        ORDER BY se.created_at DESC
        LIMIT ${sanitizedLimit}
      `;

      const [rows] = await db.execute(query);

      console.log(`✅ Found ${rows.length} recent stock entries`);

      return rows.map((row) => ({
        id: row.id,
        millId: row.mill_id,
        millName: row.business_name || `Mill ${row.mill_id}`,
        businessType: row.business_type || 'private',
        district: row.district || 'Unknown',
        farmerName: row.farmer_name || null,
        paddyType: row.paddy_type,
        paddyCondition: row.paddy_condition,
        quantity: row.quantity ? parseFloat(row.quantity) : 0,
        region: row.region || 'Central',
        entryDate: row.entry_date,
        createdAt: row.created_at,
        pricePerKg: row.price_per_kg ? parseFloat(row.price_per_kg) : null,
        totalAmount: row.total_amount ? parseFloat(row.total_amount) : null
      }));
    } catch (error) {
      console.error('❌ Get recent stock entries error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
      throw error;
    }
  }

  static safeParseJson(value) {
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn('⚠️ Failed to parse JSON payload:', error.message);
      return null;
    }
  }

  static async getMillBasicInfo(mill_id) {
    const [rows] = await db.execute(`
      SELECT 
        id,
        business_name,
        business_type,
        COALESCE(mill_district, district) AS district,
        mill_capacity
      FROM users
      WHERE id = ?
      LIMIT 1
    `, [mill_id]);

    return rows.length ? rows[0] : null;
  }

  static async createStockReport({
    mill_id,
    report_type,
    period_start = null,
    period_end = null,
    summary,
    totals,
    notes = null
  }) {
    try {
      const payloadString = summary ? JSON.stringify(summary) : null;
      const totalEntries = totals?.entries ? parseInt(totals.entries, 10) : 0;
      const totalQuantity = totals?.quantityKg ? parseFloat(totals.quantityKg) : 0;
      const totalValue = totals?.value ? parseFloat(totals.value) : 0;

      const [result] = await db.execute(`
        INSERT INTO stock_reports
          (mill_id, report_type, period_start, period_end, summary_payload, total_entries, total_quantity, total_value, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        mill_id,
        report_type,
        period_start,
        period_end,
        payloadString,
        totalEntries,
        totalQuantity,
        totalValue,
        notes && notes.trim() ? notes.trim() : null
      ]);

      const insertedId = result.insertId;

      const [rows] = await db.execute(`
        SELECT 
          sr.*,
          u.business_name,
          u.business_type,
          COALESCE(u.mill_district, u.district) AS district
        FROM stock_reports sr
        JOIN users u ON sr.mill_id = u.id
        WHERE sr.id = ?
        LIMIT 1
      `, [insertedId]);

      if (rows.length > 0) {
        return StockModel.formatReportRow(rows[0]);
      }

      return {
        id: insertedId,
        mill_id,
        report_type,
        period_start,
        period_end,
        summary: summary || null,
        totals: {
          entries: totalEntries,
          quantityKg: totalQuantity,
          value: totalValue
        },
        notes: notes || null,
        status: 'submitted'
      };
    } catch (error) {
      console.error('❌ Create stock report error:', error);
      throw error;
    }
  }

  static formatReportRow(row) {
    return {
      id: row.id,
      mill_id: row.mill_id,
      mill_name: row.business_name || null,
      district: row.district || null,
      business_type: row.business_type || null,
      report_type: row.report_type,
      period_start: row.period_start,
      period_end: row.period_end,
      summary: StockModel.safeParseJson(row.summary_payload),
      totals: {
        entries: row.total_entries || 0,
        quantityKg: row.total_quantity ? parseFloat(row.total_quantity) : 0,
        value: row.total_value ? parseFloat(row.total_value) : 0
      },
      notes: row.notes,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  static async getReportsForMill(mill_id, limit = 10) {
    try {
      const sanitizedLimit = Number.isFinite(limit)
        ? Math.min(Math.max(parseInt(limit, 10), 1), 100)
        : 10;

      const [rows] = await db.execute(`
        SELECT 
          sr.*,
          u.business_name,
          COALESCE(u.mill_district, u.district) AS district,
          u.business_type
        FROM stock_reports sr
        JOIN users u ON sr.mill_id = u.id
        WHERE sr.mill_id = ?
        ORDER BY sr.created_at DESC
        LIMIT ${sanitizedLimit}
      `, [mill_id]);

      return rows.map(StockModel.formatReportRow);
    } catch (error) {
      console.error('❌ Get stock reports for mill error:', error);
      throw error;
    }
  }

  static async getAllStockReports({ limit = 50, district } = {}) {
    try {
      const sanitizedLimit = Number.isFinite(limit)
        ? Math.min(Math.max(parseInt(limit, 10), 1), 200)
        : 50;

      let query = `
        SELECT 
          sr.*,
          u.business_name,
          u.business_type,
          COALESCE(u.mill_district, u.district) AS district
        FROM stock_reports sr
        JOIN users u ON sr.mill_id = u.id
      `;

      const params = [];

      if (district) {
        query += ' WHERE COALESCE(u.mill_district, u.district) = ?';
        params.push(district);
      }

      query += ` ORDER BY sr.created_at DESC LIMIT ${sanitizedLimit}`;

      const [rows] = await db.execute(query, params);
      return rows.map(StockModel.formatReportRow);
    } catch (error) {
      console.error('❌ Get all stock reports error:', error);
      throw error;
    }
  }
}

module.exports = StockModel;