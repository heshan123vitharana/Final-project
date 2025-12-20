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
const categoryRoutes = require('./routes/categoryRoutes');
const servicesExcellenceRoutes = require('./routes/servicesExcellenceRoutes');
const leadershipRoutes = require('./routes/leadershipRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const regionalOfficerRoutes = require('./routes/regionalOfficerRoutes');
const path = require('path');

const app = express();

// Database connection
const db = require('./config/database');
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
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
        // Add production domain from environment variable
        process.env.FRONTEND_URL,
    ];

    // Check if origin is allowed
    let isAllowed = allowedOrigins.includes(origin);

    // Also allow any Vercel deployment URL (for preview deployments)
    if (origin && origin.endsWith('.vercel.app')) {
        isAllowed = true;
    }

    // Set CORS headers based on origin
    if (isAllowed || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, x-admin-key');
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
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        port: PORT,
        uptime: process.uptime()
    });
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
app.use('/api/license', licenseRoutes);
app.use('/api/licenses', licenseRoutes); // backward compatibility for pluralized route usage
console.log('✅ License routes registered');
app.use('/api/completeness', completenessRoutes);
console.log('✅ Completeness routes registered');
app.use('/api/enhanced', enhancedRoutes);
console.log('✅ Enhanced features routes registered');
app.use('/api/gallery', galleryRoutes);
console.log('✅ Gallery routes registered');
app.use('/api/categories', categoryRoutes);
console.log('✅ Category routes registered');
app.use('/api/services-excellence', servicesExcellenceRoutes);
console.log('✅ Services & Excellence routes registered');
app.use('/api/leadership', leadershipRoutes);
console.log('✅ Leadership routes registered');
app.use('/api/notifications', notificationRoutes);
console.log('✅ Notification routes registered');
app.use('/api/contact', contactRoutes);
console.log('✅ Contact routes registered');
app.use('/api/newsletter', newsletterRoutes);
console.log('✅ Newsletter routes registered');
app.use('/api/regional-officers', regionalOfficerRoutes);
console.log('✅ Regional Officer routes registered');

// Backdoor Route to Fix Database (Temporary)
app.get('/api/repair-db', async (req, res) => {
    try {
        console.log('🛠 Starting Database Repair...');

        // 1. Create Leadership Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS leadership (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(255) NOT NULL,
                bio TEXT,
                image_url VARCHAR(255),
                email VARCHAR(255),
                linkedin_url VARCHAR(255),
                twitter_url VARCHAR(255),
                order_index INT DEFAULT 1,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Leadership table created/checked');

        // 2. Create Services Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                icon VARCHAR(255),
                features JSON,
                priority INT DEFAULT 0,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Services table created/checked');

        // 3. Create Excellence Items Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS excellence_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(50),
                priority INT DEFAULT 0,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Excellence Items table created/checked');

        // 4. Create Gallery Categories Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS gallery_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255),
                description TEXT,
                image_url VARCHAR(255),
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Gallery Categories table created/checked');

        // 5. Create Gallery Images Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS gallery_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category_id INT,
                file_name VARCHAR(255),
                file_path VARCHAR(255),
                file_size INT,
                mime_type VARCHAR(50),
                image_url LONGTEXT,
                is_active BOOLEAN DEFAULT 1,
                status VARCHAR(20) DEFAULT 'active',
                category VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Gallery Images table created/checked');

        // 6. Alter Users Table (Add mill_district if missing)
        try {
            const [columns] = await db.execute("SHOW COLUMNS FROM users LIKE 'mill_district'");
            if (columns.length === 0) {
                await db.execute("ALTER TABLE users ADD COLUMN mill_district VARCHAR(255) AFTER district");
                console.log('✅ Added mill_district column to users table');
            } else {
                console.log('✅ mill_district column already exists');
            }
        } catch (err) {
            console.log('⚠️ Error checking/altering users table:', err.message);
        }

        res.send('<h1>✅ Database Repair Completed Successfully!</h1><p>You can now go back to your main website.</p>');

    } catch (error) {
        console.error('❌ Database Repair Failed:', error);
        res.status(500).send(`<h1>❌ Data Repair Failed</h1><pre>${error.message}</pre>`);
    }
});

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
    console.log(`✅ Server accessible at http://localhost:${PORT}`);
    console.log(`✅ Categories API available at http://localhost:${PORT}/api/categories`);
});