const RegionalOfficer = require('../models/regionalOfficerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const regionalOfficerController = {
    // Login for Regional Officer
    login: async (req, res) => {
        try {
            const { username, password, district } = req.body;

            if (!username || !password || !district) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const officer = await RegionalOfficer.findByUsername(username);

            if (!officer) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify district matches
            if (officer.district !== district) {
                return res.status(401).json({ message: 'Invalid district for this officer' });
            }

            const isMatch = await bcrypt.compare(password, officer.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: officer.id, role: 'regional_officer', district: officer.district },
                process.env.JWT_SECRET || 'secret_key',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: officer.id,
                    username: officer.username,
                    district: officer.district,
                    role: 'regional_officer'
                }
            });
        } catch (error) {
            console.error('Regional Officer Login Error:', error);
            res.status(500).json({ message: 'Server error during login' });
        }
    },

    // Admin: Create new officer
    createOfficer: async (req, res) => {
        try {
            const { username, password, district, email } = req.body;

            // Basic validation
            if (!username || !password || !district) {
                return res.status(400).json({ message: 'Username, password, and district are required' });
            }

            // Check if username exists
            const existingOfficer = await RegionalOfficer.findByUsername(username);
            if (existingOfficer) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const officerId = await RegionalOfficer.create({ username, password, district, email });

            res.status(201).json({
                message: 'Regional Officer created successfully',
                officerId
            });
        } catch (error) {
            console.error('Create Officer Error:', error);
            res.status(500).json({ message: 'Failed to create officer' });
        }
    },

    // Admin: Get all officers
    getOfficers: async (req, res) => {
        try {
            const officers = await RegionalOfficer.getAll();
            res.json(officers);
        } catch (error) {
            console.error('Get Officers Error:', error);
            res.status(500).json({ message: 'Failed to fetch officers' });
        }
    },

    // Admin: Update officer
    updateOfficer: async (req, res) => {
        try {
            const { id } = req.params;
            const { district, email, password } = req.body;

            const success = await RegionalOfficer.update(id, { district, email, password });

            if (!success) {
                return res.status(404).json({ message: 'Officer not found' });
            }

            res.json({ message: 'Officer updated successfully' });
        } catch (error) {
            console.error('Update Officer Error:', error);
            res.status(500).json({ message: 'Failed to update officer' });
        }
    },

    // Admin: Delete officer
    deleteOfficer: async (req, res) => {
        try {
            const { id } = req.params;
            const success = await RegionalOfficer.delete(id);

            if (!success) {
                return res.status(404).json({ message: 'Officer not found' });
            }

            res.json({ message: 'Officer deleted successfully' });
        } catch (error) {
            console.error('Delete Officer Error:', error);
            res.status(500).json({ message: 'Failed to delete officer' });
        }
    },

    // --- Regional Price Management ---


    getDistrictStock: async (req, res) => {
        try {
            const { district } = req.user;
            const StockModel = require('../models/stockModel');

            const overview = await StockModel.getDistrictStockOverview(district);

            res.json(overview);
        } catch (error) {
            console.error('Get District Stock Error:', error);
            res.status(500).json({ message: 'Failed to fetch stock overview' });
        }
    },

    // Get prices for the officer's district
    getRegionalPrices: async (req, res) => {
        try {
            const { district } = req.user; // From JWT token
            const db = require('../config/database');

            const [rows] = await db.execute(
                'SELECT * FROM paddy_prices WHERE district = ? ORDER BY updated_at DESC',
                [district]
            );

            // Transform to match frontend expectations
            const transformedRows = rows.map(row => ({
                id: row.id,
                paddy_type: row.variety, // Map 'variety' to 'paddy_type'
                paddy_condition: row.type, // Map 'type' to 'paddy_condition'
                price_per_kg: row.price_per_kg,
                effective_date: row.created_at, // Use created_at as effective_date
                status: row.status,
                district: row.district,
                updated_at: row.updated_at
            }));

            res.json(transformedRows);
        } catch (error) {
            console.error('Get Regional Prices Error:', error);
            res.status(500).json({ message: 'Failed to fetch prices' });
        }
    },

    // Add a new price
    addRegionalPrice: async (req, res) => {
        try {
            const { district } = req.user;
            const { paddy_type, paddy_condition, price_per_kg } = req.body;

            if (!paddy_type || !paddy_condition || !price_per_kg) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const db = require('../config/database');

            // Get province for the district
            const [districtRows] = await db.execute('SELECT province FROM sri_lanka_districts WHERE name = ?', [district]);
            const province = districtRows.length > 0 ? districtRows[0].province : 'Unknown';
            console.log('Found province:', province, 'for district:', district);

            // Calculate previous price (dummy logic for new entry)
            const previous_price = parseFloat(price_per_kg);
            const price_change = 0;
            const trend = 'flat';

            const params = [
                district,
                province,
                `${district} Market`, // Default market name
                paddy_type,
                paddy_condition,
                price_per_kg,
                previous_price,
                'LKR',
                trend,
                price_change,
                'Medium', // Default availability
                'Active',
                `Regional update for ${paddy_type}`
            ];
            console.log('Inserting params:', params);

            const [result] = await db.execute(
                `INSERT INTO paddy_prices (
                    district, province, market, variety, type, 
                    price_per_kg, previous_price, currency, trend, 
                    price_change, availability, status, description, 
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                params
            );

            res.status(201).json({
                message: 'Price added successfully',
                id: result.insertId
            });
        } catch (error) {
            console.error('Add Regional Price Error:', error);
            res.status(500).json({ message: 'Failed to add price' });
        }
    },

    // Update a price
    updateRegionalPrice: async (req, res) => {
        try {
            const { district } = req.user;
            const { id } = req.params;
            const { paddy_type, paddy_condition, price_per_kg, effective_date, status } = req.body;

            const db = require('../config/database');

            // Verify the price belongs to the officer's district
            const [check] = await db.execute('SELECT district, price_per_kg, variety, type FROM paddy_prices WHERE id = ?', [id]);
            if (check.length === 0) {
                return res.status(404).json({ message: 'Price entry not found' });
            }
            if (check[0].district !== district) {
                return res.status(403).json({ message: 'Unauthorized to update prices for other districts' });
            }

            const currentPrice = parseFloat(check[0].price_per_kg);
            const newPrice = parseFloat(price_per_kg);
            const priceChange = newPrice - currentPrice;
            const trend = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'flat';

            // Build update query dynamically based on what fields are provided
            const updates = [];
            const params = [];

            if (paddy_type) {
                updates.push('variety = ?');
                params.push(paddy_type);
            }
            if (paddy_condition) {
                updates.push('type = ?');
                params.push(paddy_condition);
            }
            if (price_per_kg) {
                updates.push('price_per_kg = ?');
                params.push(newPrice);
                updates.push('previous_price = ?');
                params.push(currentPrice);
                updates.push('price_change = ?');
                params.push(priceChange);
                updates.push('trend = ?');
                params.push(trend);
            }
            if (status) {
                updates.push('status = ?');
                params.push(status);
            }
            if (effective_date) {
                updates.push('created_at = ?');
                params.push(effective_date);
            }

            updates.push('updated_at = NOW()');
            params.push(id);

            await db.execute(
                `UPDATE paddy_prices SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            res.json({ message: 'Price updated successfully' });
        } catch (error) {
            console.error('Update Regional Price Error:', error);
            res.status(500).json({ message: 'Failed to update price' });
        }
    },

    // Delete a price
    deleteRegionalPrice: async (req, res) => {
        try {
            const { district } = req.user;
            const { id } = req.params;

            const db = require('../config/database');

            // Verify ownership
            const [check] = await db.execute('SELECT district FROM paddy_prices WHERE id = ?', [id]);
            if (check.length === 0) {
                return res.status(404).json({ message: 'Price entry not found' });
            }
            if (check[0].district !== district) {
                return res.status(403).json({ message: 'Unauthorized to delete prices for other districts' });
            }

            await db.execute('DELETE FROM paddy_prices WHERE id = ?', [id]);

            res.json({ message: 'Price deleted successfully' });
        } catch (error) {
            console.error('Delete Regional Price Error:', error);
            res.status(500).json({ message: 'Failed to delete price' });
        }
    },

    // --- Stock Monitoring ---

    deleteOfficer: async (req, res) => {
        try {
            const { id } = req.params;
            const success = await RegionalOfficer.delete(id);
            if (success) {
                res.json({ message: 'Officer deleted successfully' });
            } else {
                res.status(404).json({ message: 'Officer not found' });
            }
        } catch (error) {
            console.error('Delete Officer Error:', error);
            res.status(500).json({ message: 'Failed to delete officer' });
        }
    },

    // Submit District Report
    submitReport: async (req, res) => {
        try {
            const officerId = req.user.id; // From auth middleware
            const { district } = req.user;
            const { reportType, reportData } = req.body;
            const db = require('../config/database');

            // Insert into regional_reports
            const [result] = await db.execute(
                'INSERT INTO regional_reports (officer_id, district, report_type, report_data) VALUES (?, ?, ?, ?)',
                [officerId, district, reportType, JSON.stringify(reportData)]
            );

            res.status(201).json({
                message: 'Report submitted successfully',
                reportId: result.insertId
            });
        } catch (error) {
            console.error('Submit Regional Report Error:', error);
            res.status(500).json({ message: 'Failed to submit report', error: error.message });
        }
    },

    // Get Active Mills with Location for Map
    getMillsWithLocation: async (req, res) => {
        try {
            const db = require('../config/database');

            // TEMPORARY: Use token district directly for debugging
            const district = req.user.district;

            console.log('DEBUG: getMillsWithLocation called for user (ID):', req.user.id);
            console.log('DEBUG: District from token:', district);

            // Query to get mills in the same district that have an APPROVED license
            // We join users with mill_licenses on user_id
            // We select the latest approved license per user to ensure they are currently licensed
            const query = `
                SELECT 
                    u.id, 
                    u.business_name, 
                    u.business_type,
                    COALESCE(NULLIF(u.mill_district, ''), u.district) as district,
                    u.mill_latitude as latitude, 
                    u.mill_longitude as longitude, 
                    u.address, 
                    u.city, 
                    u.mill_capacity,
                    u.mill_location,
                    ml.license_number,
                    ml.approved_date
                FROM users u
                JOIN mill_licenses ml ON u.id = ml.user_id
                WHERE LOWER(COALESCE(NULLIF(u.mill_district, ''), u.district)) = LOWER(?) 
                AND ml.status = 'approved'
                AND u.mill_latitude IS NOT NULL 
                AND u.mill_longitude IS NOT NULL
                AND ml.created_at = (
                    SELECT MAX(created_at) 
                    FROM mill_licenses ml2 
                    WHERE ml2.user_id = u.id AND ml2.status = 'approved'
                )
            `;

            console.log('DEBUG: Executing query with district:', district);
            const [mills] = await db.execute(query, [district]);
            console.log('DEBUG: Query returned', mills.length, 'mills');
            if (mills.length > 0) {
                console.log('DEBUG: First mill:', mills[0]);
            }

            const mappedMills = mills
                .map(row => {
                    const rawLat = row.latitude; // Aliased in SQL
                    const rawLng = row.longitude; // Aliased in SQL

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
                        latitude,
                        longitude,
                        licenseNumber: row.license_number,
                        approvedDate: row.approved_date
                    };
                })
                .filter(Boolean);

            res.json({
                message: 'Active mills retrieved successfully',
                count: mappedMills.length,
                mills: mappedMills
            });

        } catch (error) {
            console.error('Get Mills With Location Error:', error);
            res.status(500).json({ message: 'Failed to fetch mill locations' });
        }
    }
};

module.exports = regionalOfficerController;
