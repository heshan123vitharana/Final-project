const db = require('../config/database');

// Get all paddy prices with filtering
const getAllPrices = async (req, res) => {
  try {
    console.log('📡 PriceController: getAllPrices called');
    console.log('📄 Query params:', req.query);

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

    // Add limit (use string interpolation instead of parameter binding for LIMIT)
    if (limit && !isNaN(limit) && parseInt(limit) > 0) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    const [rows] = await db.execute(query, params);

    // Transform data to match frontend expectations
    const transformedData = rows.map(row => ({
      id: row.id,
      district: row.district,
      province: row.province,
      market: row.market,
      variety: row.variety,
      type: row.type,
      pricePerKg: parseFloat(row.pricePerKg),
      previousPrice: parseFloat(row.previousPrice || 0),
      currency: row.currency || 'LKR',
      trend: row.trend === 'up' ? 'rising' : row.trend === 'down' ? 'falling' : 'stable',
      priceChange: parseFloat(row.priceChange || 0),
      availability: row.availability === 'High' ? 'Available' : row.availability === 'Medium' ? 'Available' : row.availability === 'Low' ? 'Limited' : 'Available',
      status: row.status,
      description: row.description,
      lastUpdated: row.lastUpdated,
      createdAt: row.createdAt,
      // Additional fields for frontend compatibility
      currentPrice: parseFloat(row.pricePerKg),
      unit: 'LKR/kg',
      qualityGrade: row.pricePerKg >= 260 ? 'Premium' : row.pricePerKg >= 240 ? 'Grade A+' : 'Grade A',
      collectionCenter: `${row.district} Center`
    }));

    console.log('✅ PriceController: Returning', transformedData.length, 'records');

    res.json({
      success: true,
      data: transformedData,
      count: transformedData.length
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

    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }

    const row = rows[0];
    const transformedData = {
      id: row.id,
      district: row.district,
      province: row.province,
      market: row.market,
      variety: row.variety,
      type: row.type,
      pricePerKg: parseFloat(row.pricePerKg),
      previousPrice: parseFloat(row.previousPrice || 0),
      currency: row.currency || 'LKR',
      trend: row.trend === 'up' ? 'rising' : row.trend === 'down' ? 'falling' : 'stable',
      priceChange: parseFloat(row.priceChange || 0),
      availability: row.availability === 'High' ? 'Available' : row.availability === 'Medium' ? 'Available' : row.availability === 'Low' ? 'Limited' : 'Available',
      status: row.status,
      description: row.description,
      lastUpdated: row.lastUpdated,
      createdAt: row.createdAt,
      currentPrice: parseFloat(row.pricePerKg),
      unit: 'LKR/kg',
      qualityGrade: row.pricePerKg >= 260 ? 'Premium' : row.pricePerKg >= 240 ? 'Grade A+' : 'Grade A',
      collectionCenter: `${row.district} Center`
    };

    res.json({
      success: true,
      data: transformedData
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
      price,
      currency = 'LKR',
      trend = 'flat',
      availability = 'Medium',
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
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

    const [result] = await db.execute(query, params);

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
    const { price } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }

    // First get the current price to set as previous
    const getCurrentQuery = 'SELECT price_per_kg, district, variety, type FROM paddy_prices WHERE id = ?';
    const [currentRows] = await db.execute(getCurrentQuery, [id]);

    if (currentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }

    const currentPrice = parseFloat(currentRows[0].price_per_kg);
    const newPrice = parseFloat(price);
    const priceChange = newPrice - currentPrice;
    const trend = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'flat';
    const { district, variety, type } = currentRows[0];

    const updateQuery = `
      UPDATE paddy_prices 
      SET price_per_kg = ?, previous_price = ?, price_change = ?, trend = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const [result] = await db.execute(updateQuery, [newPrice, currentPrice, priceChange, trend, id]);

    // Create notifications for all mills about price update
    console.log('🔔 Starting notification creation process...');
    try {
      const { createNotificationForAllMills } = require('./notificationController');
      console.log('✅ Notification controller loaded');

      const trendEmoji = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
      const priceChangeText = priceChange > 0 ? `+${priceChange.toFixed(2)}` : priceChange.toFixed(2);

      const notificationData = {
        title: `${trendEmoji} Paddy Price Updated`,
        message: `${variety} (${type}) price in ${district} updated from LKR ${currentPrice.toFixed(2)} to LKR ${newPrice.toFixed(2)} (${priceChangeText} LKR/kg)`,
        type: 'price_update',
        related_id: id,
        related_type: 'paddy_price'
      };
      console.log('📧 Notification data prepared:', JSON.stringify(notificationData, null, 2));

      await createNotificationForAllMills(notificationData);
      console.log(`✅ Notifications sent to all mills about price update`);
    } catch (notifError) {
      console.error('⚠️ Failed to send notifications:');
      console.error('Error message:', notifError.message);
      console.error('Error stack:', notifError.stack);
      // Don't fail the price update if notifications fail
    }

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

// Delete price
const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM paddy_prices WHERE id = ?';
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }

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

module.exports = {
  getAllPrices,
  getPriceById,
  addPrice,
  updatePrice,
  deletePrice
};