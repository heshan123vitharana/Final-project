// controllers/stockController.js
const StockModel = require('../models/stockModel');
const stockUpdateEmitter = require('../utils/stockUpdateEmitter');

const validateStockData = (data) => {
  const errors = [];

  const required = ['farmer_id', 'farmer_name', 'paddy_type', 'paddy_condition', 'quantity', 'entry_date', 'price_per_kg'];

  required.forEach(field => {
    // Special handling for numeric fields
    if (field === 'price_per_kg' || field === 'quantity') {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push(`${field} is required`);
      }
    } else {
      // String fields
      if (!data[field] || String(data[field]).trim() === '') {
        errors.push(`${field} is required`);
      }
    }
  });

  // Validate paddy_type
  const validPaddyTypes = ['Nadu - White', 'Nadu - Red', 'Samba', 'Kiri Samba'];
  if (data.paddy_type && !validPaddyTypes.includes(data.paddy_type)) {
    errors.push('Invalid paddy type');
  }

  // Validate paddy_condition
  const validConditions = ['Wet', 'Dry'];
  if (data.paddy_condition && !validConditions.includes(data.paddy_condition)) {
    errors.push('Invalid paddy condition');
  }


  // Validate quantity
  if (data.quantity && (isNaN(data.quantity) || parseFloat(data.quantity) <= 0)) {
    errors.push('Quantity must be a positive number');
  }

  // Validate price
  if (data.price_per_kg && (isNaN(data.price_per_kg) || parseFloat(data.price_per_kg) <= 0)) {
    errors.push('Price per kg must be a positive number');
  }

  // Validate date
  if (data.entry_date && isNaN(Date.parse(data.entry_date))) {
    errors.push('Invalid entry date format');
  }

  return errors;
};

const addStock = async (req, res) => {
  try {
    const mill_id = req.user.sub; // From JWT token
    const stockData = { ...req.body, mill_id };

    console.log('📦 Stock data received:', stockData);

    // Validate input
    const errors = validateStockData(stockData);
    console.log('🔍 Validation errors:', errors);
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    // Convert numeric fields
    stockData.quantity = parseFloat(stockData.quantity);
    stockData.price_per_kg = parseFloat(stockData.price_per_kg);

    // Add stock entry
    const result = await StockModel.addStockEntry(stockData);

    try {
      const [overview, recentEntries] = await Promise.all([
        StockModel.getAggregatedStockOverview(),
        StockModel.getRecentStockEntries(10)
      ]);

      stockUpdateEmitter.emit('update', {
        type: 'stock-update',
        millId: mill_id,
        at: new Date().toISOString(),
        overview: { ...overview, recentEntries }
      });
    } catch (broadcastError) {
      console.error('Broadcast stock update error:', broadcastError);
    }

    // Send notification to admin about new stock entry
    try {
      const { createNotification } = require('./notificationController');
      const db = require('../config/database');

      // Get mill info
      const [millRows] = await db.execute('SELECT business_name FROM users WHERE id = ?', [mill_id]);
      const millName = millRows[0]?.business_name || `Mill #${mill_id}`;

      // Get all admin users
      const [adminRows] = await db.execute('SELECT id FROM admin WHERE status = "active"');

      // Create notification for each admin
      for (const admin of adminRows) {
        await createNotification({
          user_id: admin.id,
          user_type: 'admin',
          title: '📦 New Stock Entry Added',
          message: `${millName} added new stock: ${stockData.quantity}kg of ${stockData.paddy_type} (${stockData.paddy_condition}) at LKR ${stockData.price_per_kg}/kg`,
          type: 'stock_update',
          related_id: result.insertId || result.id,
          related_type: 'stock_entry'
        });
      }
      console.log(`✅ Notifications sent to admins about new stock entry`);
    } catch (notifError) {
      console.error('⚠️ Failed to send admin notifications:', notifError);
      // Don't fail the stock addition if notifications fail
    }

    res.status(201).json({
      message: 'Stock entry added successfully',
      data: result
    });
  } catch (error) {
    console.error('Add stock error:', error);
    res.status(500).json({
      message: 'Failed to add stock entry',
      error: error.message
    });
  }
};

const getStockEntries = async (req, res) => {
  try {
    const mill_id = req.user.sub;
    const filters = {
      paddy_type: req.query.paddy_type,
      paddy_condition: req.query.paddy_condition,
      region: req.query.region,
      date_from: req.query.date_from,
      date_to: req.query.date_to
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const entries = await StockModel.getStockEntries(mill_id, filters);

    res.json({
      message: 'Stock entries retrieved successfully',
      data: entries,
      total: entries.length
    });
  } catch (error) {
    console.error('Get stock entries error:', error);
    res.status(500).json({
      message: 'Failed to retrieve stock entries',
      error: error.message
    });
  }
};

const getStockSummary = async (req, res) => {
  try {
    const mill_id = req.user.sub;
    const summary = await StockModel.getStockSummary(mill_id);

    res.json({
      message: 'Stock summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    console.error('Get stock summary error:', error);
    res.status(500).json({
      message: 'Failed to retrieve stock summary',
      error: error.message
    });
  }
};

const getStockStats = async (req, res) => {
  try {
    const mill_id = req.user.sub;
    const stats = await StockModel.getStockStats(mill_id);

    res.json({
      message: 'Stock statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Get stock stats error:', error);
    res.status(500).json({
      message: 'Failed to retrieve stock statistics',
      error: error.message
    });
  }
};

const deleteStock = async (req, res) => {
  try {
    const mill_id = req.user.sub;
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: 'Valid stock entry ID is required'
      });
    }

    // Get stock entry details before deletion for notification
    let stockDetails = null;
    try {
      const db = require('../config/database');
      const [stockRows] = await db.execute(
        'SELECT paddy_type, paddy_condition, quantity FROM stock_entries WHERE id = ? AND mill_id = ?',
        [id, mill_id]
      );
      if (stockRows.length > 0) {
        stockDetails = stockRows[0];
      }
    } catch (err) {
      console.error('Error fetching stock details:', err);
    }

    const result = await StockModel.deleteStockEntry(parseInt(id, 10), mill_id);

    try {
      const [overview, recentEntries] = await Promise.all([
        StockModel.getAggregatedStockOverview(),
        StockModel.getRecentStockEntries(10)
      ]);

      stockUpdateEmitter.emit('update', {
        type: 'stock-update',
        millId: mill_id,
        at: new Date().toISOString(),
        overview: { ...overview, recentEntries }
      });
    } catch (broadcastError) {
      console.error('Broadcast stock update error:', broadcastError);
    }

    // Send notification to admin about stock deletion
    if (stockDetails) {
      try {
        const { createNotification } = require('./notificationController');
        const db = require('../database');

        // Get mill info
        const [millRows] = await db.execute('SELECT business_name FROM users WHERE id = ?', [mill_id]);
        const millName = millRows[0]?.business_name || `Mill #${mill_id}`;

        // Get all admin users
        const [adminRows] = await db.execute('SELECT id FROM admin WHERE status = "active"');

        // Create notification for each admin
        for (const admin of adminRows) {
          await createNotification({
            user_id: admin.id,
            user_type: 'admin',
            title: '🗑️ Stock Entry Deleted',
            message: `${millName} deleted stock entry: ${stockDetails.quantity}kg of ${stockDetails.paddy_type} (${stockDetails.paddy_condition})`,
            type: 'stock_update',
            related_id: null,
            related_type: 'stock_entry'
          });
        }
        console.log(`✅ Notifications sent to admins about stock deletion`);
      } catch (notifError) {
        console.error('⚠️ Failed to send admin notifications:', notifError);
        // Don't fail the deletion if notifications fail
      }
    }

    res.json({
      message: 'Stock entry deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Delete stock error:', error);
    if (error.message === 'Stock entry not found') {
      return res.status(404).json({
        message: 'Stock entry not found'
      });
    }
    res.status(500).json({
      message: 'Failed to delete stock entry',
      error: error.message
    });
  }
};

const submitStockReport = async (req, res) => {
  try {
    const mill_id = req.user.sub;
    const {
      reportType = 'stock-update',
      periodStart = null,
      periodEnd = null,
      notes = ''
    } = req.body || {};

    const [summary, stats, millInfo] = await Promise.all([
      StockModel.getStockSummary(mill_id),
      StockModel.getStockStats(mill_id),
      StockModel.getMillBasicInfo(mill_id)
    ]);

    const generalStats = stats?.general || {};

    const totals = {
      entries: generalStats.total_entries ? parseInt(generalStats.total_entries, 10) : 0,
      quantityKg: generalStats.total_quantity ? parseFloat(generalStats.total_quantity) : 0,
      value: generalStats.total_value ? parseFloat(generalStats.total_value) : 0
    };

    const breakdown = Array.isArray(summary)
      ? summary.map((item) => ({
        paddyType: item.paddy_type,
        condition: item.paddy_condition,
        region: item.region,
        quantity: item.total_quantity ? parseFloat(item.total_quantity) : 0,
        lastUpdated: item.last_updated
      }))
      : [];

    const varietyStats = Array.isArray(stats?.breakdown)
      ? stats.breakdown.map((item) => ({
        paddyType: item.paddy_type,
        condition: item.paddy_condition,
        quantity: item.quantity ? parseFloat(item.quantity) : 0
      }))
      : [];

    const summaryPayload = {
      generatedAt: new Date().toISOString(),
      period: {
        start: periodStart,
        end: periodEnd
      },
      mill: millInfo
        ? {
          id: millInfo.id,
          name: millInfo.business_name,
          businessType: millInfo.business_type,
          district: millInfo.district,
          capacity: StockModel.parseCapacity(millInfo.mill_capacity)
        }
        : { id: mill_id },
      totals,
      breakdown,
      varietyStats
    };

    const reportRecord = await StockModel.createStockReport({
      mill_id,
      report_type: reportType,
      period_start: periodStart || null,
      period_end: periodEnd || null,
      summary: summaryPayload,
      totals,
      notes
    });

    res.status(201).json({
      message: 'Stock report sent to admin successfully',
      data: reportRecord
    });
  } catch (error) {
    console.error('Submit stock report error:', error);
    res.status(500).json({
      message: 'Failed to submit stock report',
      error: error.message
    });
  }
};

const getSubmittedReports = async (req, res) => {
  try {
    const mill_id = req.user.sub;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const reports = await StockModel.getReportsForMill(mill_id, Number.isFinite(limit) ? limit : 10);

    res.json({
      message: 'Stock reports retrieved successfully',
      data: reports
    });
  } catch (error) {
    console.error('Get submitted reports error:', error);
    res.status(500).json({
      message: 'Failed to retrieve stock reports',
      error: error.message
    });
  }
};

module.exports = {
  addStock,
  getStockEntries,
  getStockSummary,
  getStockStats,
  deleteStock,
  submitStockReport,
  getSubmittedReports
};