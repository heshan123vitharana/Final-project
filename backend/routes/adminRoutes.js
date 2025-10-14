const express = require('express');
const router = express.Router();
const { adminLogin, getReport, getStockOverview, getStockReports, subscribeStockUpdates, getStockEntries } = require('../controllers/adminController');

// Debug log to check if function is imported correctly
console.log('adminController import:', { adminLogin, getReport });

// POST route for admin login
router.post('/login', adminLogin);

// GET route for reports
router.get('/reports', getReport);

// GET route for live stock overview
router.get('/stock-overview', getStockOverview);

// Server-sent events stream for live stock updates
router.get('/stock-stream', subscribeStockUpdates);

// GET route for submitted stock reports
router.get('/stock-reports', getStockReports);

// GET route for all stock entries (for history view)
router.get('/stock-entries', getStockEntries);

module.exports = router;