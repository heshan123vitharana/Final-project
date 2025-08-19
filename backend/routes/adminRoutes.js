const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminController');

// Debug log to check if function is imported correctly
console.log('adminController import:', { adminLogin });

// POST route for admin login
router.post('/login', adminLogin);

module.exports = router;