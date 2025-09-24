require('dotenv').config();
const express = require('express');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const priceRoutes = require('./routes/priceRoutes');
const stockRoutes = require('./routes/stockRoutes');
const profileRoutes = require('./routes/profileRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const completenessRoutes = require('./routes/completenessRoutes');
const enhancedRoutes = require('./routes/enhancedRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const servicesExcellenceRoutes = require('./routes/servicesExcellenceRoutes');
const path = require('path');

const app = express();

// Database connection
const db = require('./database');
const PORT = process.env.PORT || 5000;

// Enhanced CORS middleware to fix cross-origin issues
app.use((req, res, next) => {
    // Get the origin from the request
    const origin = req.headers.origin;

    // Define allowed origins
    const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'http://localhost:3002',
        'http://127.0.0.1:3002',
        // Add production domain when available
    ];

    // Set CORS headers based on origin
    if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        console.log(`🔄 CORS preflight for ${req.path} from origin: ${origin}`);
        return res.status(200).end();
    }

    next();
});
// Increase payload limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database middleware - attach db to request
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Request logging middleware
app.use((req, _res, next) => {
    console.log(`📝 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
    next();
});

// Basic route
app.get('/', (_req, res) => {
    res.json({ message: 'Paddy Management System API' });
});

// Routes
console.log('📍 Registering routes...');
app.use('/api/admin', adminRoutes);
console.log('✅ Admin routes registered');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered');
app.use('/api/prices', priceRoutes);
console.log('✅ Price routes registered');
app.use('/api/stock', stockRoutes);
console.log('✅ Stock routes registered');
app.use('/api/profile', profileRoutes);
console.log('✅ Profile routes registered');
app.use('/api/licenses', licenseRoutes);
console.log('✅ License routes registered');
app.use('/api/completeness', completenessRoutes);
console.log('✅ Completeness routes registered');
app.use('/api/enhanced', enhancedRoutes);
console.log('✅ Enhanced features routes registered');
app.use('/api/gallery', galleryRoutes);
console.log('✅ Gallery routes registered');
app.use('/api/services-excellence', servicesExcellenceRoutes);
console.log('✅ Services & Excellence routes registered');

// 404 handler for undefined routes (must be after all other routes)
app.use((req, res, _next) => {
    res.status(404).json({ 
        message: 'Route not found', 
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((err, _req, res, _next) => {
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