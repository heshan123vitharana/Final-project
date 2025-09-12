const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Profile completeness check endpoint - CLEAN IMPLEMENTATION
router.get('/check/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`🔍 NEW COMPLETENESS CHECK for user ID: ${userId}`);

        // Get user data from database
        const [userResult] = await pool.execute(`
            SELECT u.id, u.first_name, u.last_name, u.email, u.phone, 
                   u.address, u.city, u.district, u.postal_code, 
                   u.business_name, u.business_type, u.mill_capacity, 
                   u.mill_location, u.license_number, u.registration_date, 
                   u.created_at,
                   CASE WHEN upp.photo_data IS NOT NULL THEN 1 ELSE 0 END as has_photo
            FROM users u
            LEFT JOIN user_profile_photos upp ON u.id = upp.user_id
            WHERE u.id = ?
        `, [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult[0];
        
        // Log the raw user data to debug
        console.log('🔍 Raw database data:');
        console.log(`   First Name: "${user.first_name}"`);
        console.log(`   Last Name: "${user.last_name}"`);
        console.log(`   Email: "${user.email}"`);
        console.log(`   Phone: "${user.phone}"`);
        console.log(`   Address: "${user.address}"`);
        console.log(`   City: "${user.city}"`);
        console.log(`   District: "${user.district}"`);
        console.log(`   Postal Code: "${user.postal_code}"`);
        console.log(`   Business Name: "${user.business_name}"`);
        console.log(`   Business Type: "${user.business_type}"`);
        console.log(`   Mill Capacity: "${user.mill_capacity}"`);
        console.log(`   Mill Location: "${user.mill_location}"`);
        console.log(`   License Number: "${user.license_number}"`);
        console.log(`   Registration Date: "${user.registration_date}"`);

        // Personal Information Fields (50% weight)
        const personalFields = [
            { key: 'first_name', name: 'First Name', value: user.first_name },
            { key: 'last_name', name: 'Last Name', value: user.last_name },
            { key: 'email', name: 'Email', value: user.email },
            { key: 'phone', name: 'Phone', value: user.phone },
            { key: 'address', name: 'Address', value: user.address },
            { key: 'city', name: 'City', value: user.city },
            { key: 'district', name: 'District', value: user.district },
            { key: 'postal_code', name: 'Postal Code', value: user.postal_code }
        ];
        
        // Business Information Fields (50% weight)
        const businessFields = [
            { key: 'business_name', name: 'Business Name', value: user.business_name },
            { key: 'business_type', name: 'Business Type', value: user.business_type },
            { key: 'mill_capacity', name: 'Mill Capacity', value: user.mill_capacity },
            { key: 'mill_location', name: 'Mill Location', value: user.mill_location },
            { key: 'license_number', name: 'License Number', value: user.license_number },
            { key: 'registration_date', name: 'Registration Date', value: user.registration_date }
        ];
        
        // Check which fields are filled
        const isFieldFilled = (value) => {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        };
        
        const filledPersonalFields = personalFields.filter(field => {
            const filled = isFieldFilled(field.value);
            console.log(`🔍 ${field.name}: "${field.value}" -> ${filled ? 'FILLED ✅' : 'EMPTY ❌'}`);
            return filled;
        });
        
        const filledBusinessFields = businessFields.filter(field => {
            const filled = isFieldFilled(field.value);
            console.log(`🔍 ${field.name}: "${field.value}" -> ${filled ? 'FILLED ✅' : 'EMPTY ❌'}`);
            return filled;
        });
        
        // Calculate weighted completeness (50% personal + 50% business)
        const personalCompleteness = (filledPersonalFields.length / personalFields.length) * 50;
        const businessCompleteness = (filledBusinessFields.length / businessFields.length) * 50;
        const totalCompleteness = Math.round(personalCompleteness + businessCompleteness);

        console.log(`🔍 COMPLETENESS CALCULATION:`);
        console.log(`   Personal: ${filledPersonalFields.length}/${personalFields.length} = ${personalCompleteness}%`);
        console.log(`   Business: ${filledBusinessFields.length}/${businessFields.length} = ${businessCompleteness}%`);
        console.log(`   TOTAL: ${totalCompleteness}%`);

        // Get missing fields
        const missingFields = [];
        personalFields.forEach(field => {
            if (!isFieldFilled(field.value)) {
                missingFields.push(field.name);
            }
        });
        businessFields.forEach(field => {
            if (!isFieldFilled(field.value)) {
                missingFields.push(field.name);
            }
        });

        // Create field status for frontend
        const fieldStatus = {
            personalInfo: {},
            businessInfo: {},
            completedCount: filledPersonalFields.length + filledBusinessFields.length,
            totalCount: personalFields.length + businessFields.length,
            personalCompleteness: Math.round(personalCompleteness),
            businessCompleteness: Math.round(businessCompleteness)
        };

        // Map personal fields to frontend format
        personalFields.forEach(field => {
            const frontendKey = field.key === 'first_name' ? 'firstName' :
                              field.key === 'last_name' ? 'lastName' :
                              field.key === 'postal_code' ? 'postalCode' :
                              field.key;
            fieldStatus.personalInfo[frontendKey] = isFieldFilled(field.value);
        });

        // Map business fields to frontend format
        businessFields.forEach(field => {
            const frontendKey = field.key === 'business_name' ? 'businessName' :
                              field.key === 'business_type' ? 'businessType' :
                              field.key === 'mill_capacity' ? 'millCapacity' :
                              field.key === 'mill_location' ? 'millLocation' :
                              field.key === 'license_number' ? 'licenseNumber' :
                              field.key === 'registration_date' ? 'registrationDate' :
                              field.key;
            fieldStatus.businessInfo[frontendKey] = isFieldFilled(field.value);
        });

        res.status(200).json({
            message: 'Profile completeness checked successfully',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                city: user.city,
                district: user.district,
                postalCode: user.postal_code,
                businessName: user.business_name,
                businessType: user.business_type,
                millCapacity: user.mill_capacity,
                millLocation: user.mill_location,
                licenseNumber: user.license_number,
                registrationDate: user.registration_date,
                hasPhoto: !!user.has_photo,
                createdAt: user.created_at
            },
            completeness: totalCompleteness,
            canApplyForLicense: totalCompleteness === 100,
            missingFields,
            fieldStatus
        });

    } catch (error) {
        console.error('❌ Completeness check error:', error);
        res.status(500).json({ 
            message: 'Failed to check profile completeness',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Clear test user fields for testing
router.get('/reset-test-user', async (req, res) => {
    try {
        console.log('🧹 Clearing test user fields for testing...');
        
        await pool.execute(`
            UPDATE users 
            SET address = NULL, city = NULL, district = NULL, postal_code = NULL,
                mill_capacity = NULL, mill_location = NULL, license_number = NULL, registration_date = NULL
            WHERE id = 1
        `);

        console.log('✅ Test user fields reset');
        res.json({ 
            message: 'Test user profile fields cleared successfully - completeness should now be 50%',
            timestamp: new Date().toISOString() 
        });
        
    } catch (error) {
        console.error('❌ Error clearing test user fields:', error);
        res.status(500).json({ message: 'Failed to clear fields', error: error.message });
    }
});

module.exports = router;