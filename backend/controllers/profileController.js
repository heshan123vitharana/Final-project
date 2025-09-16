// backend/controllers/profileController.js
const pool = require('../config/database');

/**
 * Get list of valid Sri Lankan districts
 */
const getValidDistricts = async (req, res) => {
    try {
        const [districts] = await pool.execute(
            'SELECT name, province FROM sri_lanka_districts ORDER BY name'
        );
        
        res.json({
            success: true,
            districts: districts.map(d => ({ name: d.name, province: d.province }))
        });
    } catch (error) {
        console.error('Error fetching districts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch districts',
            error: error.message
        });
    }
};

/**
 * Enhanced profile completeness calculation with mill_district validation
 */
const calculateProfileCompleteness = async (userId) => {
    try {
        // Get user data
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            throw new Error('User not found');
        }
        
        const user = users[0];
        
        // Get valid districts for validation
        const [validDistricts] = await pool.execute(
            'SELECT name FROM sri_lanka_districts'
        );
        const validDistrictNames = validDistricts.map(d => d.name);
        
        // Personal Information Fields (50%)
        const personalFields = [
            { field: user.first_name, name: 'First Name', required: true },
            { field: user.last_name, name: 'Last Name', required: true },
            { field: user.nic, name: 'NIC', required: true },
            { field: user.email, name: 'Email', required: true },
            { field: user.phone, name: 'Phone', required: true },
            { field: user.address, name: 'Address', required: true },
            { field: user.city, name: 'City', required: true },
            { field: user.district, name: 'District', required: true },
            { field: user.postal_code, name: 'Postal Code', required: true }
        ];
        
        // Business Information Fields (50%) - Enhanced mill_district validation
        const businessFields = [
            { field: user.business_name, name: 'Business Name', required: true },
            { field: user.business_type, name: 'Business Type', required: true },
            { field: user.mill_capacity, name: 'Mill Capacity', required: true },
            { field: user.mill_location, name: 'Mill Location', required: true },
            { 
                field: user.mill_district, 
                name: 'Mill District', 
                required: true,
                validator: (value) => validDistrictNames.includes(value)
            },
            { field: user.registration_date, name: 'Registration Date', required: false }
        ];
        
        // Calculate filled fields with validation
        const validateField = (item) => {
            if (!item.field || (typeof item.field === 'string' && item.field.trim() === '')) {
                return false;
            }
            
            // Custom validation for specific fields
            if (item.validator) {
                return item.validator(item.field);
            }
            
            // Date validation
            if (item.field instanceof Date) {
                return true;
            }
            
            return true;
        };
        
        const filledPersonalFields = personalFields.filter(validateField);
        const filledBusinessFields = businessFields.filter(validateField);
        
        // Calculate completeness percentages
        const personalCompleteness = (filledPersonalFields.length / personalFields.length) * 50;
        const businessCompleteness = (filledBusinessFields.length / businessFields.length) * 50;
        const totalCompleteness = Math.round(personalCompleteness + businessCompleteness);
        
        // Get missing required fields
        const missingFields = [
            ...personalFields.filter(f => f.required && !validateField(f)),
            ...businessFields.filter(f => f.required && !validateField(f))
        ].map(f => f.name);
        
        // Check if mill_district is specifically invalid
        const millDistrictError = user.mill_district && 
            !validDistrictNames.includes(user.mill_district) ? 
            'Invalid mill district selected' : null;
        
        return {
            completeness: totalCompleteness,
            personalCompleteness: Math.round(personalCompleteness * 2), // Convert to 100% scale
            businessCompleteness: Math.round(businessCompleteness * 2), // Convert to 100% scale
            missingFields,
            millDistrictError,
            fieldStatus: {
                personalInfo: filledPersonalFields.map(f => f.name),
                businessInfo: filledBusinessFields.map(f => f.name),
                completedCount: filledPersonalFields.length + filledBusinessFields.length,
                totalCount: personalFields.length + businessFields.length
            },
            canApplyForLicense: totalCompleteness >= 100 && !millDistrictError
        };
    } catch (error) {
        throw new Error(`Profile completeness calculation failed: ${error.message}`);
    }
};

module.exports = {
    getValidDistricts,
    calculateProfileCompleteness
};