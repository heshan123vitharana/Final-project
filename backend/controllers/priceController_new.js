const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Database connection
const getDbConnection = () => {
  const dbPath = path.join(__dirname, '..', 'paddy_management.db');
  return new sqlite3.Database(dbPath);
};

// Get all paddy prices with filtering
const getAllPrices = async (req, res) => {
  try {
    const db = getDbConnection();
    
    const {
      district,
      province,
      variety,
      type,
      status = 'Active',
      sortBy = 'updated_at',
      sortOrder = 'DESC',
      limit = 100
    } = req.query;

    let query = `
      SELECT 
        id,
        district,
        province,
        market,
        variety,
        type,
        price_per_kg as pricePerKg,
        previous_price as previousPrice,
        currency,
        trend,
        price_change as priceChange,
        availability,
        status,
        description,
        created_at as createdAt,
        updated_at as lastUpdated
      FROM paddy_prices 
      WHERE status = ?
    `;
    
    const params = [status];

    // Add filters
    if (district && district !== 'All Districts') {
      query += ' AND district = ?';
      params.push(district);
    }
    
    if (province && province !== 'All Provinces') {
      query += ' AND province = ?';
      params.push(province);
    }

    if (variety && variety !== 'All Varieties') {
      query += ' AND variety = ?';
      params.push(variety);
    }

    if (type && type !== 'All Types') {
      query += ' AND type = ?';
      params.push(type);
    }

    // Add sorting
    const validSortFields = ['district', 'variety', 'price_per_kg', 'updated_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'updated_at';
    const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    
    query += ` ORDER BY ${sortField} ${order}`;
    
    // Add limit
    if (limit && !isNaN(limit)) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch paddy prices',
          error: err.message
        });
      }

      // Transform data to match frontend expectations
      const transformedData = rows.map(row => ({
        id: row.id,
        district: row.district,
        province: row.province,
        market: row.market,
        variety: row.variety,
        type: row.type,
        pricePerKg: row.pricePerKg,
        previousPrice: row.previousPrice,
        currency: row.currency || 'LKR',
        trend: row.trend,
        priceChange: row.priceChange,
        availability: row.availability,
        status: row.status,
        description: row.description,
        lastUpdated: row.lastUpdated,
        createdAt: row.createdAt,
        // Additional fields for frontend compatibility
        currentPrice: row.pricePerKg,
        unit: 'LKR/kg',
        qualityGrade: row.pricePerKg >= 260 ? 'Premium' : row.pricePerKg >= 240 ? 'Grade A+' : 'Grade A',
        collectionCenter: `${row.district} Center`
      }));

      db.close();
      
      res.json({
        success: true,
        data: transformedData,
        count: transformedData.length
      });
    });

  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paddy prices',
      error: error.message
    });
  }
};

// Get price by ID
const getPriceById = async (req, res) => {
  try {
    const db = getDbConnection();
    const { id } = req.params;
    
    const query = `
      SELECT 
        id,
        district,
        province,
        market,
        variety,
        type,
        price_per_kg as pricePerKg,
        previous_price as previousPrice,
        currency,
        trend,
        price_change as priceChange,
        availability,
        status,
        description,
        created_at as createdAt,
        updated_at as lastUpdated
      FROM paddy_prices 
      WHERE id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch price',
          error: err.message
        });
      }

      if (!row) {
        db.close();
        return res.status(404).json({
          success: false,
          message: 'Price not found'
        });
      }

      db.close();
      
      res.json({
        success: true,
        data: row
      });
    });

  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price',
      error: error.message
    });
  }
};

// Add new price
const addPrice = async (req, res) => {
  try {
    const db = getDbConnection();
    const {
      district,
      province,
      market,
      variety,
      type,
      price,
      currency = 'LKR',
      trend = 'stable',
      availability = 'Available',
      description
    } = req.body;

    // Validation
    if (!district || !variety || !type || !price) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: district, variety, type, price'
      });
    }

    const query = `
      INSERT INTO paddy_prices (
        district, province, market, variety, type, 
        price_per_kg, previous_price, currency, trend,
        price_change, availability, status, description,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const previousPrice = parseFloat(price) - 1; // Simple calculation
    const priceChange = 1.00; // Default change

    const params = [
      district,
      province || '',
      market || `${district} Center`,
      variety,
      type,
      parseFloat(price),
      previousPrice,
      currency,
      trend,
      priceChange,
      availability,
      'Active',
      description || `${variety} - ${type}`
    ];

    db.run(query, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Failed to add price',
          error: err.message
        });
      }

      db.close();
      
      res.status(201).json({
        success: true,
        message: 'Price added successfully',
        id: this.lastID
      });
    });

  } catch (error) {
    console.error('Error adding price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add price',
      error: error.message
    });
  }
};

// Update price
const updatePrice = async (req, res) => {
  try {
    const db = getDbConnection();
    const { id } = req.params;
    const { price } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }

    // First get the current price to set as previous
    const getCurrentQuery = 'SELECT price_per_kg FROM paddy_prices WHERE id = ?';
    
    db.get(getCurrentQuery, [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Failed to get current price',
          error: err.message
        });
      }

      if (!row) {
        db.close();
        return res.status(404).json({
          success: false,
          message: 'Price not found'
        });
      }

      const currentPrice = row.price_per_kg;
      const newPrice = parseFloat(price);
      const priceChange = newPrice - currentPrice;
      const trend = priceChange > 0 ? 'rising' : priceChange < 0 ? 'falling' : 'stable';

      const updateQuery = `
        UPDATE paddy_prices 
        SET price_per_kg = ?, previous_price = ?, price_change = ?, trend = ?, updated_at = datetime('now')
        WHERE id = ?
      `;

      db.run(updateQuery, [newPrice, currentPrice, priceChange, trend, id], function(err) {
        if (err) {
          console.error('Database error:', err);
          db.close();
          return res.status(500).json({
            success: false,
            message: 'Failed to update price',
            error: err.message
          });
        }

        db.close();
        
        res.json({
          success: true,
          message: 'Price updated successfully',
          changes: this.changes
        });
      });
    });

  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update price',
      error: error.message
    });
  }
};

// Delete price
const deletePrice = async (req, res) => {
  try {
    const db = getDbConnection();
    const { id } = req.params;

    const query = 'DELETE FROM paddy_prices WHERE id = ?';
    
    db.run(query, [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        db.close();
        return res.status(500).json({
          success: false,
          message: 'Failed to delete price',
          error: err.message
        });
      }

      if (this.changes === 0) {
        db.close();
        return res.status(404).json({
          success: false,
          message: 'Price not found'
        });
      }

      db.close();
      
      res.json({
        success: true,
        message: 'Price deleted successfully'
      });
    });

  } catch (error) {
    console.error('Error deleting price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete price',
      error: error.message
    });
  }
};

module.exports = {
  getAllPrices,
  getPriceById,
  addPrice,
  updatePrice,
  deletePrice
};
