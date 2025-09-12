const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Apply for mill license
router.post('/apply', async (req, res) => {
    try {
        console.log('📋 License application request received');
        const { 
            userId, 
            paymentReceipt, 
            brDocument, 
            licenseType, 
            comments 
        } = req.body;

        console.log('Application data:', {
            userId,
            licenseType,
            hasPaymentReceipt: !!paymentReceipt,
            hasBrDocument: !!brDocument,
            comments: comments?.substring(0, 50) + '...'
        });

        if (!userId || !paymentReceipt || !brDocument) {
            return res.status(400).json({ 
                message: 'Missing required fields: userId, paymentReceipt, brDocument' 
            });
        }

        // Check if user exists and get profile completeness
        const [userResult] = await pool.execute(`
            SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.business_name, u.business_type, 
                   u.address, u.city, u.district, u.postal_code, u.mill_capacity, u.mill_location, 
                   u.license_number, u.registration_date, u.created_at,
                   CASE WHEN upp.photo_data IS NOT NULL THEN 1 ELSE 0 END as has_photo
            FROM users u
            LEFT JOIN user_profile_photos upp ON u.id = upp.user_id
            WHERE u.id = ?
        `, [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult[0];

        // Calculate profile completeness with weighted categories
        // Personal Information (50%): first_name, last_name, email, phone, address, city, district, postal_code
        const personalFields = [
            user.first_name, user.last_name, user.email, user.phone,
            user.address, user.city, user.district, user.postal_code
        ];
        const filledPersonalFields = personalFields.filter(field => field && field.toString().trim() !== '').length;
        const personalCompleteness = (filledPersonalFields / personalFields.length) * 50;
        
        // Business Information (50%): business_name, business_type, mill_capacity, mill_location, license_number, registration_date
        const businessFields = [
            user.business_name, user.business_type, user.mill_capacity, 
            user.mill_location, user.license_number, user.registration_date
        ];
        const filledBusinessFields = businessFields.filter(field => field && field.toString().trim() !== '').length;
        const businessCompleteness = (filledBusinessFields / businessFields.length) * 50;
        
        const completeness = Math.round(personalCompleteness + businessCompleteness);

        console.log('Profile completeness:', completeness);

        if (completeness < 100) {
            return res.status(400).json({ 
                message: 'Profile must be 100% complete to apply for license',
                currentCompleteness: completeness,
                requiresCompletion: true
            });
        }

        // Check if user already has a pending or active license application
        const [existingLicense] = await pool.execute(
            'SELECT * FROM mill_licenses WHERE user_id = ? AND status IN ("pending", "approved") ORDER BY created_at DESC LIMIT 1',
            [userId]
        );

        if (existingLicense.length > 0) {
            const license = existingLicense[0];
            if (license.status === 'pending') {
                return res.status(400).json({ 
                    message: 'You already have a pending license application',
                    existingApplication: license
                });
            } else if (license.status === 'approved') {
                return res.status(400).json({ 
                    message: 'You already have an active license',
                    existingLicense: license
                });
            }
        }

        // Generate license application number
        const applicationNumber = `ML${Date.now()}${userId}`;

        // Insert license application
        const [result] = await pool.execute(`
            INSERT INTO mill_licenses (
                user_id, application_number, license_type, 
                payment_receipt, br_document, comments, 
                status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
        `, [userId, applicationNumber, licenseType, paymentReceipt, brDocument, comments]);

        console.log(`✅ License application submitted for user ${userId}, application: ${applicationNumber}`);
        
        res.status(201).json({ 
            message: 'License application submitted successfully',
            applicationNumber: applicationNumber,
            applicationId: result.insertId,
            status: 'pending'
        });

    } catch (error) {
        console.error('Error processing license application:', error);
        res.status(500).json({ 
            message: 'Failed to process license application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get user's license applications
router.get('/applications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const [applications] = await pool.execute(`
            SELECT ml.*, u.first_name, u.last_name, u.business_name
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE ml.user_id = ?
            ORDER BY ml.created_at DESC
        `, [userId]);

        res.status(200).json({
            message: 'License applications retrieved successfully',
            applications
        });

    } catch (error) {
        console.error('Error retrieving license applications:', error);
        res.status(500).json({ 
            message: 'Failed to retrieve license applications',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get user profile with completeness check
router.get('/profile-check/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`🔍 Profile check requested for user ID: ${userId}`);

        const [userResult] = await pool.execute(`
            SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.business_name, u.business_type, 
                   u.address, u.city, u.district, u.postal_code, u.mill_capacity, u.mill_location, 
                   u.license_number, u.registration_date, u.created_at,
                   CASE WHEN upp.photo_data IS NOT NULL THEN 1 ELSE 0 END as has_photo
            FROM users u
            LEFT JOIN user_profile_photos upp ON u.id = upp.user_id
            WHERE u.id = ?
        `, [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult[0];
        console.log(`👤 User data retrieved:`, JSON.stringify(user, null, 2));

        // Calculate profile completeness with weighted categories
        // Personal Information Fields (50%)
        const personalFields = [
            { field: user.first_name, name: 'First Name' },
            { field: user.last_name, name: 'Last Name' },
            { field: user.email, name: 'Email' },
            { field: user.phone, name: 'Phone' },
            { field: user.address, name: 'Address' },
            { field: user.city, name: 'City' },
            { field: user.district, name: 'District' },
            { field: user.postal_code, name: 'Postal Code' }
        ];
        
        // Business Information Fields (50%)
        const businessFields = [
            { field: user.business_name, name: 'Business Name' },
            { field: user.business_type, name: 'Business Type' },
            { field: user.mill_capacity, name: 'Mill Capacity' },
            { field: user.mill_location, name: 'Mill Location' },
            { field: user.license_number, name: 'License Number' },
            { field: user.registration_date, name: 'Registration Date' }
        ];
        
        // Calculate filled fields for each category
        const filledPersonalFields = personalFields.filter(item => 
            item.field && item.field.toString().trim() !== ''
        );
        const filledBusinessFields = businessFields.filter(item => 
            item.field && item.field.toString().trim() !== ''
        );
        
        // Calculate weighted completeness
        const personalCompleteness = (filledPersonalFields.length / personalFields.length) * 50;
        const businessCompleteness = (filledBusinessFields.length / businessFields.length) * 50;
        const completeness = Math.round(personalCompleteness + businessCompleteness);
        
        console.log(`👤 Personal fields: ${filledPersonalFields.length}/${personalFields.length} = ${personalCompleteness}%`);
        console.log(`🏢 Business fields: ${filledBusinessFields.length}/${businessFields.length} = ${businessCompleteness}%`);
        console.log(`📊 Total completeness: ${completeness}%`);

        // Get missing fields for detailed feedback
        const missingFields = [];
        personalFields.forEach(item => {
            if (!item.field || item.field.toString().trim() === '') {
                missingFields.push(item.name);
            }
        });
        businessFields.forEach(item => {
            if (!item.field || item.field.toString().trim() === '') {
                missingFields.push(item.name);
            }
        });

        // Detailed field status for frontend with expanded fields
        const fieldStatus = {
            personalInfo: {
                firstName: !!user.first_name,
                lastName: !!user.last_name,
                email: !!user.email,
                phone: !!user.phone,
                address: !!user.address,
                city: !!user.city,
                district: !!user.district,
                postalCode: !!user.postal_code
            },
            businessInfo: {
                businessName: !!user.business_name,
                businessType: !!user.business_type,
                millCapacity: !!user.mill_capacity,
                millLocation: !!user.mill_location,
                licenseNumber: !!user.license_number,
                registrationDate: !!user.registration_date
            },
            completedCount: filledPersonalFields.length + filledBusinessFields.length,
            totalCount: personalFields.length + businessFields.length,
            personalCompleteness: Math.round(personalCompleteness),
            businessCompleteness: Math.round(businessCompleteness)
        };

        res.status(200).json({
            message: 'Profile completeness checked',
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
            completeness,
            canApplyForLicense: completeness === 100,
            missingFields,
            fieldStatus
        });

    } catch (error) {
        console.error('Error checking profile completeness:', error);
        res.status(500).json({ 
            message: 'Failed to check profile completeness',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Test endpoint to verify code changes
router.get('/test-update', (req, res) => {
    res.json({ message: 'Updated code is working', timestamp: new Date().toISOString() });
});

module.exports = router;