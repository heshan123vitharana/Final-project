// backend/middleware/enhancedValidation.js
const pool = require('../config/database');

/**
 * Middleware to validate mill district
 */
const validateMillDistrict = async (req, res, next) => {
    try {
        const { mill_district } = req.body;
        
        if (mill_district) {
            const [validDistricts] = await pool.execute(
                'SELECT name FROM sri_lanka_districts WHERE name = ?',
                [mill_district]
            );

            if (validDistricts.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid mill district selected',
                    error: 'INVALID_DISTRICT'
                });
            }
        }
        
        next();
    } catch (error) {
        console.error('District validation error:', error);
        res.status(500).json({
            success: false,
            message: 'District validation failed',
            error: error.message
        });
    }
};

/**
 * Rate limiting for password-related operations
 */
const passwordOperationRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    const attempts = new Map();
    
    return (req, res, next) => {
        const key = req.ip + req.body.email || req.body.userId;
        const now = Date.now();
        const userAttempts = attempts.get(key) || { count: 0, resetTime: now + windowMs };
        
        if (now > userAttempts.resetTime) {
            userAttempts.count = 0;
            userAttempts.resetTime = now + windowMs;
        }
        
        if (userAttempts.count >= maxAttempts) {
            return res.status(429).json({
                success: false,
                message: `Too many password attempts. Try again in ${Math.ceil((userAttempts.resetTime - now) / 60000)} minutes.`,
                error: 'RATE_LIMIT_EXCEEDED'
            });
        }
        
        userAttempts.count++;
        attempts.set(key, userAttempts);
        next();
    };
};

/**
 * Validate certificate generation permissions
 */
const validateCertificateGeneration = async (req, res, next) => {
    try {
        const { licenseApplicationId } = req.params;
        
        // Check if license exists and is approved
        const [licenses] = await pool.execute(
            'SELECT status, user_id FROM mill_licenses WHERE id = ?',
            [licenseApplicationId]
        );
        
        if (licenses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'License application not found',
                error: 'LICENSE_NOT_FOUND'
            });
        }
        
        const license = licenses[0];
        
        if (license.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: 'Certificate can only be generated for approved licenses',
                error: 'LICENSE_NOT_APPROVED'
            });
        }
        
        // Add license data to request for use in controller
        req.licenseData = license;
        next();
        
    } catch (error) {
        console.error('Certificate validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Certificate validation failed',
            error: error.message
        });
    }
};

/**
 * Input sanitization for price queries
 */
const sanitizePriceQuery = (req, res, next) => {
    const { district, paddyType, condition } = req.query;
    
    // Whitelist allowed values
    const allowedDistricts = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
                              'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 
                              'Mullaitivu', 'Vavuniya', 'Puttalam', 'Kurunegala', 'Anuradhapura', 
                              'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle', 
                              'Ampara', 'Batticaloa', 'Trincomalee'];
    
    const allowedPaddyTypes = ['Nadu - White', 'Nadu - Red', 'Samba', 'Kiri Samba'];
    const allowedConditions = ['Wet', 'Dry'];
    
    if (district && district !== 'All Districts' && !allowedDistricts.includes(district)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid district parameter',
            error: 'INVALID_DISTRICT_PARAM'
        });
    }
    
    if (paddyType && paddyType !== 'All Types' && !allowedPaddyTypes.includes(paddyType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid paddy type parameter',
            error: 'INVALID_PADDY_TYPE_PARAM'
        });
    }
    
    if (condition && condition !== 'All Conditions' && !allowedConditions.includes(condition)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid condition parameter',
            error: 'INVALID_CONDITION_PARAM'
        });
    }
    
    next();
};

module.exports = {
    validateMillDistrict,
    passwordOperationRateLimit,
    validateCertificateGeneration,
    sanitizePriceQuery
};