const express = require('express');
const router = express.Router();
const { adminLogin, getReport } = require('../controllers/adminController');

// Debug log to check if function is imported correctly
console.log('adminController import:', { adminLogin, getReport });

// POST route for admin login
router.post('/login', adminLogin);

// GET route for reports
router.get('/reports', getReport);

module.exports = router;