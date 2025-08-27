require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Manual CORS setup to ensure headers are properly set
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5174', 
        'http://localhost:5173', 
        'http://127.0.0.1:5173', 
        'http://localhost:3000', 
        'http://127.0.0.1:3000',
        'http://localhost:5175',
        'http://127.0.0.1:5175'
    ];
    
    const origin = req.headers.origin;
    console.log('🔍 CORS Request from origin:', origin);
    console.log('🔍 Request method:', req.method);
    console.log('🔍 Request path:', req.path);
    
    // Set CORS headers
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        console.log('✅ CORS allowed for:', origin);
    } else if (!origin) {
        // Allow requests with no origin (like Postman, curl)
        res.setHeader('Access-Control-Allow-Origin', '*');
        console.log('✅ CORS allowed for request with no origin');
    } else {
        console.log('❌ CORS blocked for:', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        console.log('✅ Handling OPTIONS preflight request');
        res.status(200).end();
        return;
    }
    
    next();
});
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
    next();
});

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Paddy Management System API' });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// 404 handler for undefined routes (must be after all other routes)
app.use((req, res, next) => {
    res.status(404).json({ 
        message: 'Route not found', 
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});