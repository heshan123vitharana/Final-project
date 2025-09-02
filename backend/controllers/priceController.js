console.log('🔧 PriceController: Starting module load');

const { getConnection } = require('../config/database');

// Initialize database connection
const db = getConnection();

console.log('🔧 PriceController: Database connection loaded');

// Helper function to map districts to provinces
const getProvinceFromDistrict = (district) => {
  const districtProvinceMap = {
    // Western Province
    'Colombo': 'Western',
    'Gampaha': 'Western', 
    'Kalutara': 'Western',
    
    // Central Province
    'Kandy': 'Central',
    'Matale': 'Central',
    'Nuwara Eliya': 'Central',
    
    // Southern Province
    'Galle': 'Southern',
    'Matara': 'Southern',
    'Hambantota': 'Southern',
    
    // Northern Province
    'Jaffna': 'Northern',
    'Kilinochchi': 'Northern',
    'Mannar': 'Northern',
    'Mullaitivu': 'Northern',
    'Vavuniya': 'Northern',
    
    // Eastern Province
    'Batticaloa': 'Eastern',
    'Ampara': 'Eastern',
    'Trincomalee': 'Eastern',
    
    // North Western Province
    'Kurunegala': 'North Western',
    'Puttalam': 'North Western',
    
    // North Central Province
    'Anuradhapura': 'North Central',
    'Polonnaruwa': 'North Central',
    
    // Uva Province
    'Badulla': 'Uva',
    'Moneragala': 'Uva',
    
    // Sabaragamuwa Province
    'Ratnapura': 'Sabaragamuwa',
    'Kegalle': 'Sabaragamuwa'
  };
  
  return districtProvinceMap[district];
};

// Get all paddy prices with filtering
const getAllPrices = async (req, res) => {
  try {
    console.log('📡 PriceController: getAllPrices called');
    console.log('📄 Query params:', req.query);
    
    // Special case: if statistics are requested
    if (req.query.stats === 'true') {
      return getPriceStatistics(req, res);
    }
    
    const {
      district,
      province,
      variety,
      type,
      status = 'Active'
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
        updated_at as lastUpdated,
        price_per_kg as currentPrice,
        CONCAT(currency, '/kg') as unit,
        CASE 
          WHEN price_per_kg >= 260 THEN 'Premium'
          WHEN price_per_kg >= 240 THEN 'Grade A+'
          ELSE 'Grade A'
        END as qualityGrade,
        CONCAT(district, ' Center') as collectionCenter
      FROM paddy_prices 
      WHERE status = ?
    `;

    const params = [status];

    // Apply filters
    if (district) {
      query += ' AND district LIKE ?';
      params.push(`%${district}%`);
    }

    if (province) {
      query += ' AND province LIKE ?';
      params.push(`%${province}%`);
    }

    if (variety) {
      query += ' AND variety LIKE ?';
      params.push(`%${variety}%`);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY updated_at DESC';

    console.log('📡 Executing query:', query);
    console.log('📡 Query parameters:', params);

    const [rows] = await db.execute(query, params);
    
    console.log('✅ PriceController: Returning', rows.length, 'records from database');
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
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
    const { id } = req.params;
    console.log('🔍 getPriceById called with ID:', id);
    console.log('🔍 Request path:', req.path);
    console.log('🔍 Request URL:', req.url);
    
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
        updated_at as lastUpdated,
        price_per_kg as currentPrice,
        CONCAT(currency, '/kg') as unit,
        CASE 
          WHEN price_per_kg >= 260 THEN 'Premium'
          WHEN price_per_kg >= 240 THEN 'Grade A+'
          ELSE 'Grade A'
        END as qualityGrade,
        CONCAT(district, ' Center') as collectionCenter
      FROM paddy_prices 
      WHERE id = ? AND status = 'Active'
    `;

    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
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
    const {
      district,
      province,
      market,
      variety,
      type,
      pricePerKg,
      price, // Alternative field name from frontend
      currency = 'LKR',
      availability = 'Medium',
      description
    } = req.body;

    // Handle both pricePerKg and price field names
    const finalPrice = pricePerKg || price;

    // Validation
    if (!district || !variety || !type || !finalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: district, variety, type, price (or pricePerKg)',
        received: { district, variety, type, price: finalPrice }
      });
    }

    console.log('📝 Adding new price:', { district, province, variety, type, price: finalPrice });

    const query = `
      INSERT INTO paddy_prices (
        district, province, market, variety, type, price_per_kg, 
        previous_price, currency, trend, price_change, availability, 
        status, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)
    `;

    // Auto-generate missing fields with intelligent defaults
    const inferredProvince = province || getProvinceFromDistrict(district) || 'Unknown Province';
    const inferredMarket = market || `${district} Center`;
    
    const params = [
      district,
      inferredProvince,
      inferredMarket,
      variety,
      type || 'Wet', // Default to Wet if not specified
      finalPrice,
      finalPrice, // Set previous_price same as current initially
      currency,
      'flat', // Initial trend
      0, // Initial price change
      availability,
      description || `${variety} - ${type || 'Wet'} paddy from ${district}`
    ];

    const [result] = await db.execute(query, params);
    
    console.log('✅ Price added to database with ID:', result.insertId);
    
    res.status(201).json({
      success: true,
      message: 'Price added successfully',
      id: result.insertId
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
    const { id } = req.params;
    const { price, pricePerKg } = req.body;

    const newPrice = pricePerKg || price;

    if (!newPrice || isNaN(newPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }

    console.log('📝 Updating price for ID:', id, 'New price:', newPrice);

    // First get the current price to calculate change
    const [currentRows] = await db.execute(
      'SELECT price_per_kg FROM paddy_prices WHERE id = ? AND status = "Active"',
      [id]
    );

    if (currentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Price record not found'
      });
    }

    const currentPrice = currentRows[0].price_per_kg;
    const priceChange = newPrice - currentPrice;
    
    let trend = 'flat';
    if (priceChange > 0) trend = 'up';
    else if (priceChange < 0) trend = 'down';

    const updateQuery = `
      UPDATE paddy_prices 
      SET 
        price_per_kg = ?,
        previous_price = ?,
        price_change = ?,
        trend = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'Active'
    `;

    const [result] = await db.execute(updateQuery, [newPrice, currentPrice, priceChange, trend, id]);
    
    console.log('✅ Price updated in database, affected rows:', result.affectedRows);
    
    res.json({
      success: true,
      message: 'Price updated successfully',
      changes: result.affectedRows
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

// Delete price (soft delete by setting status to Inactive)
const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Soft deleting price ID:', id);

    const query = `
      UPDATE paddy_prices 
      SET status = 'Inactive', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Price record not found'
      });
    }
    
    console.log('✅ Price soft deleted from database');
    
    res.json({
      success: true,
      message: 'Price deleted successfully'
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

// Get database-wide price statistics
const getPriceStatistics = async (req, res) => {
  try {
    console.log('📊 PriceController: getPriceStatistics called - CORRECT ENDPOINT HIT!');
    console.log('📊 Request path:', req.path);
    console.log('📊 Request URL:', req.url);
    
    const query = `
      SELECT 
        COUNT(*) as totalEntries,
        AVG(price_per_kg) as averagePrice,
        MAX(price_per_kg) as highestPrice,
        MIN(price_per_kg) as lowestPrice,
        COUNT(CASE WHEN type = 'Wet' THEN 1 END) as wetCount,
        COUNT(CASE WHEN type = 'Dry' THEN 1 END) as dryCount
      FROM paddy_prices 
      WHERE status = 'Active'
    `;

    const [rows] = await db.execute(query);
    const stats = rows[0];
    
    console.log('📊 Database statistics:', stats);
    
    res.json({
      success: true,
      data: {
        totalEntries: parseInt(stats.totalEntries) || 0,
        averagePrice: parseFloat(stats.averagePrice?.toFixed(2)) || 0,
        highestPrice: parseFloat(stats.highestPrice) || 0,
        lowestPrice: parseFloat(stats.lowestPrice) || 0,
        wetCount: parseInt(stats.wetCount) || 0,
        dryCount: parseInt(stats.dryCount) || 0
      }
    });

  } catch (error) {
    console.error('Error fetching price statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price statistics',
      error: error.message
    });
  }
};

console.log('🔧 PriceController: Functions defined, preparing exports');

module.exports = {
  getAllPrices,
  getPriceById,
  addPrice,
  updatePrice,
  deletePrice,
  getPriceStatistics
};

console.log('🔧 PriceController: Module exports completed');
