// backend/controllers/priceController.js - Enhanced version
const pool = require('../config/database');

/**
 * Get prices filtered by district and paddy type
 * API: GET /api/prices/by-district-type?district=Colombo&paddyType=Nadu - White&condition=Dry
 */
const getPricesByDistrictAndType = async (req, res) => {
    try {
        const { district, paddyType, condition } = req.query;
        
        console.log('🏷️ Fetching prices for:', { district, paddyType, condition });
        
        let query = `
            SELECT 
                dpp.*,
                sd.province 
            FROM district_paddy_prices dpp
            JOIN sri_lanka_districts sd ON dpp.district_name = sd.name
            WHERE dpp.status = 'Active'
        `;
        const params = [];
        
        if (district && district !== 'All Districts') {
            query += ' AND dpp.district_name = ?';
            params.push(district);
        }
        
        if (paddyType && paddyType !== 'All Types') {
            query += ' AND dpp.paddy_type = ?';
            params.push(paddyType);
        }
        
        if (condition && condition !== 'All Conditions') {
            query += ' AND dpp.paddy_condition = ?';
            params.push(condition);
        }
        
        query += ' ORDER BY dpp.effective_date DESC, dpp.price_per_kg DESC';
        
        const [prices] = await pool.execute(query, params);
        
        // Group prices by type and condition for easier frontend handling
        const groupedPrices = prices.reduce((acc, price) => {
            const key = `${price.paddy_type}_${price.paddy_condition}`;
            if (!acc[key]) {
                acc[key] = {
                    paddyType: price.paddy_type,
                    condition: price.paddy_condition,
                    prices: []
                };
            }
            acc[key].prices.push({
                id: price.id,
                district: price.district_name,
                province: price.province,
                pricePerKg: parseFloat(price.price_per_kg),
                effectiveDate: price.effective_date,
                createdAt: price.created_at
            });
            return acc;
        }, {});
        
        res.json({
            success: true,
            data: prices.map(price => ({
                id: price.id,
                district: price.district_name,
                province: price.province,
                paddyType: price.paddy_type,
                condition: price.paddy_condition,
                pricePerKg: parseFloat(price.price_per_kg),
                effectiveDate: price.effective_date,
                createdAt: price.created_at
            })),
            grouped: groupedPrices,
            count: prices.length,
            filters: { district, paddyType, condition }
        });
        
    } catch (error) {
        console.error('Error fetching prices by district and type:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch prices',
            error: error.message
        });
    }
};

/**
 * Get available paddy types for a specific district
 * API: GET /api/prices/paddy-types?district=Colombo
 */
const getPaddyTypesByDistrict = async (req, res) => {
    try {
        const { district } = req.query;
        
        let query = `
            SELECT DISTINCT 
                paddy_type,
                COUNT(*) as price_count,
                MIN(price_per_kg) as min_price,
                MAX(price_per_kg) as max_price,
                AVG(price_per_kg) as avg_price
            FROM district_paddy_prices 
            WHERE status = 'Active'
        `;
        const params = [];
        
        if (district && district !== 'All Districts') {
            query += ' AND district_name = ?';
            params.push(district);
        }
        
        query += ' GROUP BY paddy_type ORDER BY paddy_type';
        
        const [types] = await pool.execute(query, params);
        
        res.json({
            success: true,
            data: types.map(type => ({
                paddyType: type.paddy_type,
                priceCount: type.price_count,
                priceRange: {
                    min: parseFloat(type.min_price),
                    max: parseFloat(type.max_price),
                    avg: parseFloat(type.avg_price)
                }
            })),
            district: district || 'All Districts'
        });
        
    } catch (error) {
        console.error('Error fetching paddy types by district:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch paddy types',
            error: error.message
        });
    }
};

/**
 * Real-time price validation for stock updates
 * API: POST /api/prices/validate
 */
const validatePriceSelection = async (req, res) => {
    try {
        const { district, paddyType, condition, selectedPriceId } = req.body;
        
        // Verify the selected price exists and is valid for the district/type combination
        const [priceResults] = await pool.execute(`
            SELECT * FROM district_paddy_prices 
            WHERE id = ? AND district_name = ? AND paddy_type = ? AND paddy_condition = ? AND status = 'Active'
        `, [selectedPriceId, district, paddyType, condition]);
        
        if (priceResults.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price selection for the specified district and paddy type',
                error: 'INVALID_PRICE_SELECTION'
            });
        }
        
        const price = priceResults[0];
        
        res.json({
            success: true,
            message: 'Price selection is valid',
            priceData: {
                id: price.id,
                district: price.district_name,
                paddyType: price.paddy_type,
                condition: price.paddy_condition,
                pricePerKg: parseFloat(price.price_per_kg),
                effectiveDate: price.effective_date
            }
        });
        
    } catch (error) {
        console.error('Error validating price selection:', error);
        res.status(500).json({
            success: false,
            message: 'Price validation failed',
            error: error.message
        });
    }
};

module.exports = {
    getPricesByDistrictAndType,
    getPaddyTypesByDistrict,
    validatePriceSelection
};