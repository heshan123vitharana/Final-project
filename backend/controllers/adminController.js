const bcrypt = require('bcrypt');
const db = require('../database');
const StockModel = require('../models/stockModel');
const stockUpdateEmitter = require('../utils/stockUpdateEmitter');

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
       
        // First, let's test if we can query the table at all
        try {
            const testQuery = 'SELECT COUNT(*) as total FROM admin';
            const [countResult] = await db.execute(testQuery);
            console.log('Total admin records:', countResult[0].total);
        } catch (testError) {
            console.log('Count query failed:', testError.message);
            return res.status(500).json({ message: 'Database connection error', error: testError.message });
        }
       
        // Query to get admin by email - ONLY select columns that exist
        const query = 'SELECT id, username, email, password, status FROM admin WHERE email = ? AND status = ?';
        console.log('Executing query:', query);
        console.log('With parameters:', [email, 'active']);
       
        const [rows] = await db.execute(query, [email, 'active']);
        console.log('Query successful, found records:', rows.length);
       
        if (rows.length === 0) {
            console.log('No admin found with email:', email);
            return res.status(401).json({
                message: 'Login error',
                error: 'Invalid email or password'
            });
        }
       
        const admin = rows[0];
        console.log('Found admin:', { id: admin.id, username: admin.username, email: admin.email });

        const passwordMatches = await bcrypt.compare(password, admin.password);
        if (!passwordMatches) {
            console.log('Password mismatch for email:', email);
            return res.status(401).json({
                message: 'Login error',
                error: 'Invalid email or password'
            });
        }
       
        console.log('Login successful for:', admin.email);
       
        // Return success response
        res.status(200).json({
            message: 'Login successful',
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                status: admin.status
            }
        });
       
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login error',
            error: error.message
        });
    }
};

const getReport = async (req, res) => {
    try {
        const { reportType, from, to, region } = req.query;

        // Basic validation
        if (!reportType || !from || !to) {
            return res.status(400).json({ message: 'Missing required query parameters: reportType, from, to' });
        }

    let query = '';
    let params = [];

        switch (reportType) {
            case 'licenses':
                query = `
                    SELECT 
                        ml.status, 
                        COUNT(*) as value,
                        (SELECT COUNT(*) FROM mill_licenses WHERE applied_date BETWEEN ? AND ?) as total
                    FROM mill_licenses ml
                    WHERE ml.applied_date BETWEEN ? AND ?
                `;
                params = [from, to, from, to];

                const normalizedRegion = region ? region.toLowerCase() : null;
                if (normalizedRegion && normalizedRegion !== 'all' && normalizedRegion !== 'all-regions' && normalizedRegion !== 'all regions') {
                    query += ' AND EXISTS (SELECT 1 FROM users u WHERE u.id = ml.user_id AND u.district = ?)';
                    const districtFilter = region.replace(/ Province$/i, '');
                    params.push(districtFilter);
                }
                query += ' GROUP BY ml.status';
                break;
            
            case 'stock':
                query = `
                    SELECT 
                        se.paddy_type as category, 
                        SUM(se.quantity) as value,
                        (SELECT SUM(quantity) FROM stock_entries WHERE created_at BETWEEN ? AND ?) as total
                    FROM stock_entries se
                    WHERE se.created_at BETWEEN ? AND ?
                `;
                params = [from, to, from, to];

                const normalizedRegionStock = region ? region.toLowerCase() : null;
                if (normalizedRegionStock && normalizedRegionStock !== 'all' && normalizedRegionStock !== 'all-regions' && normalizedRegionStock !== 'all regions') {
                    query += ' AND EXISTS (SELECT 1 FROM users u WHERE u.id = se.mill_id AND u.district = ?)';
                    const districtFilter = region.replace(/ Province$/i, '');
                    params.push(districtFilter);
                }
                
                query += ' GROUP BY se.paddy_type';
                break;

            default: {
                console.warn(`No query implemented for report type: ${reportType}. Returning empty dataset.`);
                return res.status(200).json({ summary: {}, breakdown: [] });
            }
        }

        const [rows] = await db.execute(query, params);

        if (rows.length === 0) {
            return res.status(200).json({ summary: {}, breakdown: [] });
        }

        const total = rows[0].total || rows.reduce((sum, row) => sum + row.value, 0);

        const breakdown = rows.map(row => ({
            category: row.status || row.category,
            value: row.value,
            percentage: total > 0 ? ((row.value / total) * 100).toFixed(2) : 0
        }));

        const summary = breakdown.reduce((acc, item) => {
            acc[item.category.toLowerCase()] = item.value;
            return acc;
        }, { totalApplications: total });
        
        res.status(200).json({ summary, breakdown });

    } catch (error) {
        console.error('❌ Error in getReport:', error);
        console.error('Query details:', { reportType: req.query.reportType, from: req.query.from, to: req.query.to, region: req.query.region });
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Failed to generate report',
            error: error.message,
            details: error.sqlMessage || error.toString()
        });
    }
};

const getStockOverview = async (req, res) => {
    try {
        const providedKey = req.headers['x-admin-key'] || req.query.key;
        const configuredKey = process.env.ADMIN_API_KEY;

        if (configuredKey && (!providedKey || providedKey !== configuredKey)) {
            return res.status(401).json({
                message: 'Unauthorized access to stock overview'
            });
        }

        console.log('📊 Fetching stock overview...');

        // Fetch overview
        const overview = await StockModel.getAggregatedStockOverview();
        console.log('✅ Overview fetched successfully');

        // Fetch recent entries with error handling
        let recentEntries = [];
        try {
            recentEntries = await StockModel.getRecentStockEntries(10);
            console.log(`✅ Recent entries fetched: ${recentEntries.length} items`);
        } catch (recentError) {
            console.error('⚠️ Error fetching recent entries:', recentError);
            // Continue without recent entries rather than failing the entire request
        }

        overview.recentEntries = recentEntries;

        res.status(200).json({
            message: 'Stock overview retrieved successfully',
            data: overview
        });
    } catch (error) {
        console.error('❌ Error in getStockOverview:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Failed to retrieve stock overview',
            error: error.message
        });
    }
};

const getStockReports = async (req, res) => {
    try {
        const providedKey = req.headers['x-admin-key'] || req.query.key;
        const configuredKey = process.env.ADMIN_API_KEY;

        if (configuredKey && (!providedKey || providedKey !== configuredKey)) {
            return res.status(401).json({
                message: 'Unauthorized access to stock reports'
            });
        }

        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const district = req.query.district || null;

        const reports = await StockModel.getAllStockReports({
            limit: Number.isFinite(limit) ? limit : 50,
            district: district && district !== 'All' ? district : null
        });

        res.status(200).json({
            message: 'Stock reports retrieved successfully',
            data: reports
        });
    } catch (error) {
        console.error('Error in getStockReports:', error);
        res.status(500).json({
            message: 'Failed to retrieve stock reports',
            error: error.message
        });
    }
};

const subscribeStockUpdates = async (req, res) => {
    const providedKey = req.headers['x-admin-key'] || req.query.key;
    const configuredKey = process.env.ADMIN_API_KEY;

    if (configuredKey && (!providedKey || providedKey !== configuredKey)) {
        return res.status(401).json({
            message: 'Unauthorized access to stock updates'
        });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
    }

    let streamOpen = true;

    const pushUpdate = async (payload = {}) => {
        if (!streamOpen || res.writableEnded) {
            return;
        }

        try {
            const overview = payload.overview || await StockModel.getAggregatedStockOverview();

            if (!overview.recentEntries) {
                overview.recentEntries = await StockModel.getRecentStockEntries(10);
            }

            const data = {
                overview,
                recentEntries: overview.recentEntries,
                timestamp: payload.at || new Date().toISOString(),
                source: payload.type || 'stock-update'
            };

            res.write('event: stock-update\n');
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (error) {
            console.error('Error pushing stock update to SSE stream:', error);
            res.write('event: stock-update-error\n');
            res.write(`data: ${JSON.stringify({ error: 'Failed to refresh stock overview' })}\n\n`);
        }
    };

    // Send initial snapshot
    pushUpdate({ type: 'initial-sync' }).catch((error) => {
        console.error('Initial stock overview push failed:', error);
    });

    const heartbeat = setInterval(() => {
        if (!streamOpen || res.writableEnded) {
            return;
        }
        res.write('event: heartbeat\n');
        res.write('data: {}\n\n');
    }, 25000);

    const listener = (payload) => {
        pushUpdate(payload);
    };

    stockUpdateEmitter.on('update', listener);

    req.on('close', () => {
        streamOpen = false;
        clearInterval(heartbeat);
        stockUpdateEmitter.off('update', listener);
    });
};


const getStockEntries = async (req, res) => {
    try {
        const providedKey = req.headers['x-admin-key'] || req.query.key;
        const configuredKey = process.env.ADMIN_API_KEY;

        if (configuredKey && (!providedKey || providedKey !== configuredKey)) {
            return res.status(401).json({
                message: 'Unauthorized access to stock entries'
            });
        }

        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;

        const entries = await StockModel.getRecentStockEntries(limit);

        res.status(200).json({
            message: 'Stock entries retrieved successfully',
            data: entries
        });
    } catch (error) {
        console.error('Error in getStockEntries:', error);
        res.status(500).json({
            message: 'Failed to retrieve stock entries',
            error: error.message
        });
    }
};

// Generate comprehensive stock report
const generateStockReport = async (req, res) => {
    try {
        const apiKey = req.headers['x-admin-key'];
        if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
            return res.status(403).json({
                message: 'Unauthorized access to stock reports'
            });
        }

        const { reportType = 'total', district } = req.query;
        const normalizedDistrict = district ? district.toLowerCase() : null;
        const shouldFilterByDistrict = normalizedDistrict && normalizedDistrict !== 'all' && normalizedDistrict !== 'all districts';
        const districtFilterValue = shouldFilterByDistrict
            ? district.replace(/ District$/i, '').replace(/ Province$/i, '')
            : null;

        let query = '';
        let params = [];

        switch (reportType) {
            case 'total':
                // Current total stock across all mills
                query = `
                    SELECT 
                        SUM(se.quantity) as totalStock,
                        COUNT(DISTINCT se.mill_id) as totalMills,
                        SUM(se.total_amount) as totalValue,
                        COUNT(se.id) as totalEntries
                    FROM stock_entries se
                    JOIN users u ON se.mill_id = u.id
                    WHERE LOWER(u.business_type) IN ('private', 'government')
                `;
                
                if (districtFilterValue) {
                    query += ' AND COALESCE(u.mill_district, u.district) = ?';
                    params.push(districtFilterValue);
                }
                break;

            case 'private':
                // Current total private stock
                query = `
                    SELECT 
                        SUM(se.quantity) as totalStock,
                        COUNT(DISTINCT se.mill_id) as totalMills,
                        SUM(se.total_amount) as totalValue,
                        COUNT(se.id) as totalEntries
                    FROM stock_entries se
                    JOIN users u ON se.mill_id = u.id
                    WHERE LOWER(u.business_type) = 'private'
                `;
                
                if (districtFilterValue) {
                    query += ' AND COALESCE(u.mill_district, u.district) = ?';
                    params.push(districtFilterValue);
                }
                break;

            case 'government':
                // Current total government stock
                query = `
                    SELECT 
                        SUM(se.quantity) as totalStock,
                        COUNT(DISTINCT se.mill_id) as totalMills,
                        SUM(se.total_amount) as totalValue,
                        COUNT(se.id) as totalEntries
                    FROM stock_entries se
                    JOIN users u ON se.mill_id = u.id
                    WHERE LOWER(u.business_type) = 'government'
                `;
                
                if (districtFilterValue) {
                    query += ' AND COALESCE(u.mill_district, u.district) = ?';
                    params.push(districtFilterValue);
                }
                break;

            case 'by-district':
                // Stock by district
                query = `
                    SELECT 
                        COALESCE(u.mill_district, u.district, 'Unknown') as district,
                        SUM(se.quantity) as totalStock,
                        COUNT(DISTINCT se.mill_id) as totalMills,
                        SUM(se.total_amount) as totalValue,
                        COUNT(se.id) as totalEntries,
                        SUM(CASE WHEN LOWER(u.business_type) = 'private' THEN se.quantity ELSE 0 END) as privateStock,
                        SUM(CASE WHEN LOWER(u.business_type) = 'government' THEN se.quantity ELSE 0 END) as governmentStock
                    FROM stock_entries se
                    JOIN users u ON se.mill_id = u.id
                    WHERE LOWER(u.business_type) IN ('private', 'government')
                `;
                
                if (districtFilterValue) {
                    query += ' AND COALESCE(u.mill_district, u.district) = ?';
                    params.push(districtFilterValue);
                }
                
                query += ' GROUP BY COALESCE(u.mill_district, u.district, \'Unknown\') ORDER BY totalStock DESC';
                break;

            case 'combined':
                // Get all reports in one response
                const [totalResult] = await db.execute(`
                    SELECT 
                        SUM(se.quantity) as totalStock,
                        COUNT(DISTINCT se.mill_id) as totalMills,
                        SUM(se.total_amount) as totalValue
                    FROM stock_entries se
                    JOIN users u ON se.mill_id = u.id
                    WHERE LOWER(u.business_type) IN ('private', 'government')
                `);

                const [privateResult] = await db.execute(`
                    SELECT 
                        SUM(se.quantity) as totalStock,
                        COUNT(DISTINCT se.mill_id) as totalMills,
                        SUM(se.total_amount) as totalValue
                    FROM stock_entries se
                    JOIN users u ON se.mill_id = u.id
                    WHERE LOWER(u.business_type) = 'private'
                `);

                const [governmentResult] = await db.execute(`
                    SELECT 
                        SUM(se.quantity) as totalStock,
                        COUNT(DISTINCT se.mill_id) as totalMills,
                        SUM(se.total_amount) as totalValue
                    FROM stock_entries se
                    JOIN users u ON se.mill_id = u.id
                    WHERE LOWER(u.business_type) = 'government'
                `);

                const [districtResult] = await db.execute(`
                    SELECT 
                        COALESCE(u.mill_district, u.district, 'Unknown') as district,
                        SUM(se.quantity) as totalStock,
                        COUNT(DISTINCT se.mill_id) as totalMills,
                        SUM(se.total_amount) as totalValue,
                        SUM(CASE WHEN LOWER(u.business_type) = 'private' THEN se.quantity ELSE 0 END) as privateStock,
                        SUM(CASE WHEN LOWER(u.business_type) = 'government' THEN se.quantity ELSE 0 END) as governmentStock
                    FROM stock_entries se
                    JOIN users u ON se.mill_id = u.id
                    WHERE LOWER(u.business_type) IN ('private', 'government')
                    GROUP BY COALESCE(u.mill_district, u.district, 'Unknown')
                    ORDER BY totalStock DESC
                `);

                return res.status(200).json({
                    message: 'Combined stock report generated successfully',
                    data: {
                        total: {
                            summary: totalResult[0] || {},
                            breakdown: []
                        },
                        private: {
                            summary: privateResult[0] || {},
                            breakdown: []
                        },
                        government: {
                            summary: governmentResult[0] || {},
                            breakdown: []
                        },
                        byDistrict: {
                            summary: {
                                totalDistricts: districtResult.length,
                                totalStock: districtResult.reduce((sum, d) => sum + parseFloat(d.totalStock || 0), 0)
                            },
                            breakdown: districtResult
                        }
                    },
                    generatedAt: new Date().toISOString()
                });

            default:
                return res.status(400).json({
                    message: 'Invalid report type. Use: total, private, government, by-district, or combined'
                });
        }

        const [rows] = await db.execute(query, params);

        const summary = reportType === 'by-district' ? {
            totalDistricts: rows.length,
            totalStock: rows.reduce((sum, row) => sum + parseFloat(row.totalStock || 0), 0),
            totalMills: rows.reduce((sum, row) => sum + parseInt(row.totalMills || 0, 10), 0)
        } : (rows[0] || {});

        const breakdown = reportType === 'by-district' ? rows : [];

        res.status(200).json({
            message: 'Stock report generated successfully',
            data: {
                summary,
                breakdown
            },
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in generateStockReport:', error);
        res.status(500).json({
            message: 'Failed to generate stock report',
            error: error.message
        });
    }
};

const getApprovedMills = async (req, res) => {
    try {
        const { businessType, district } = req.query;

        let query = `
            SELECT 
                u.id,
                u.business_name,
                u.business_type,
                COALESCE(u.mill_district, u.district) AS district,
                u.mill_location,
                u.mill_capacity,
                u.phone,
                u.email,
                u.address,
                u.city,
                u.first_name,
                u.last_name,
                u.registration_date,
                u.mill_latitude,
                u.mill_longitude,
                ml.license_number,
                ml.approved_date
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE LOWER(ml.status) = 'approved'
              AND u.mill_latitude IS NOT NULL
              AND u.mill_longitude IS NOT NULL
              AND u.mill_latitude <> ''
              AND u.mill_longitude <> ''
        `;

        const params = [];

        if (businessType && businessType !== 'all') {
            query += ' AND LOWER(u.business_type) = ?';
            params.push(String(businessType).toLowerCase());
        }

        if (district && district !== 'all') {
            query += ' AND LOWER(COALESCE(u.mill_district, u.district)) = ?';
            params.push(String(district).toLowerCase());
        }

    query += ' ORDER BY (ml.approved_date IS NULL), ml.approved_date DESC, u.business_name ASC';

        const [rows] = await db.execute(query, params);

        const mills = rows
            .map((row) => {
                const rawLat = row.mill_latitude;
                const rawLng = row.mill_longitude;

                const latitude = typeof rawLat === 'string' ? Number.parseFloat(rawLat) : rawLat;
                const longitude = typeof rawLng === 'string' ? Number.parseFloat(rawLng) : rawLng;

                if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
                    return null;
                }

                return {
                    id: row.id,
                    name: row.business_name,
                    businessType: row.business_type,
                    district: row.district,
                    millLocation: row.mill_location,
                    millCapacity: row.mill_capacity,
                    phone: row.phone,
                    email: row.email,
                    address: row.address,
                    city: row.city,
                    contactFirstName: row.first_name,
                    contactLastName: row.last_name,
                    registrationDate: row.registration_date,
                    latitude,
                    longitude,
                    licenseNumber: row.license_number,
                    approvedDate: row.approved_date,
                };
            })
            .filter(Boolean);

        res.status(200).json({
            message: 'Approved mills retrieved successfully',
            count: mills.length,
            mills,
        });
    } catch (error) {
        console.error('Error fetching approved mills:', error);
        res.status(500).json({
            message: 'Failed to fetch approved mills',
            error: error.message,
        });
    }
};


module.exports = {
    adminLogin,
    getReport,
    getStockOverview,
    getStockReports,
    subscribeStockUpdates,
    getStockEntries,
    generateStockReport,
    getApprovedMills
};