const express = require('express');
const router = express.Router();
const { adminLogin, getReport, getStockOverview, getStockReports } = require('../controllers/adminController');

// Debug log to check if function is imported correctly
console.log('adminController import:', { adminLogin, getReport });

// POST route for admin login
router.post('/login', adminLogin);

// GET route for reports
router.get('/reports', getReport);

// GET route for live stock overview
router.get('/stock-overview', getStockOverview);

// GET route for submitted stock reports
router.get('/stock-reports', getStockReports);

module.exports = router;