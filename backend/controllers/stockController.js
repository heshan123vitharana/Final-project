// controllers/stockController.js
const StockModel = require('../models/stockModel');

const validateStockData = (data) => {
  const errors = [];
  
  const required = ['farmer_id', 'farmer_name', 'paddy_type', 'paddy_condition', 'quantity', 'region', 'entry_date', 'price_per_kg'];
  
  required.forEach(field => {
    if (!data[field] || String(data[field]).trim() === '') {
      errors.push(`${field} is required`);
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

  // Validate region
  const validRegions = ['North', 'South', 'Central'];
  if (data.region && !validRegions.includes(data.region)) {
    errors.push('Invalid region');
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

    // Validate input
    const errors = validateStockData(stockData);
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

    const result = await StockModel.deleteStockEntry(parseInt(id), mill_id);

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

module.exports = {
  addStock,
  getStockEntries,
  getStockSummary,
  getStockStats,
  deleteStock
};