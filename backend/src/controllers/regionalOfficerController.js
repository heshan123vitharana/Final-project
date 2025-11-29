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
    }
};

module.exports = regionalOfficerController;
