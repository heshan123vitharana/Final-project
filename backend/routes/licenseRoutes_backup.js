const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Test route
router.get('/test', (req, res) => {
    console.log('🧪 License test route hit');
    res.json({ message: 'License routes are working' });
});

// Simple admin applications
router.get('/admin/applications', async (req, res) => {
    console.log('📋 Admin applications endpoint hit!');
    res.json({
        message: 'Success',
        applications: [],
        total: 0
    });
});

module.exports = router;