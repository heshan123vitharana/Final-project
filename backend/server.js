/* global process */
/* eslint-env node */

import dotenv from 'dotenv';
import express from 'express';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use((req, res, next) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
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
    res.json({ message: 'PMB Admin Dashboard API' });
});

// Routes
app.use('/api/admin', adminRoutes);

// 404 handler for undefined routes (must be after all other routes)
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Route not found', 
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Admin Dashboard API running on port ${PORT}`);
});