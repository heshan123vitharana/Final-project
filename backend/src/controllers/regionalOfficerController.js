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
    }
};

module.exports = regionalOfficerController;
