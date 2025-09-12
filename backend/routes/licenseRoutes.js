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
            SELECT u.*, 
                   CASE WHEN upp.photo_data IS NOT NULL THEN 1 ELSE 0 END as has_photo
            FROM users u
            LEFT JOIN user_profile_photos upp ON u.id = upp.user_id
            WHERE u.id = ?
        `, [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult[0];

        // Calculate profile completeness
        const profileFields = [
            user.first_name, user.last_name, user.email, user.phone,
            user.business_name, user.business_type
        ];
        const filledFields = profileFields.filter(field => field && field.toString().trim() !== '').length;
        const completeness = Math.round(((filledFields + (user.has_photo ? 1 : 0)) / (profileFields.length + 1)) * 100);

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

        const [userResult] = await pool.execute(`
            SELECT u.*, 
                   CASE WHEN upp.photo_data IS NOT NULL THEN 1 ELSE 0 END as has_photo
            FROM users u
            LEFT JOIN user_profile_photos upp ON u.id = upp.user_id
            WHERE u.id = ?
        `, [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult[0];

        // Calculate profile completeness
        const profileFields = [
            user.first_name, user.last_name, user.email, user.phone,
            user.business_name, user.business_type
        ];
        const filledFields = profileFields.filter(field => field && field.toString().trim() !== '').length;
        const completeness = Math.round(((filledFields + (user.has_photo ? 1 : 0)) / (profileFields.length + 1)) * 100);

        // Get missing fields
        const missingFields = [];
        if (!user.first_name) missingFields.push('First Name');
        if (!user.last_name) missingFields.push('Last Name');
        if (!user.email) missingFields.push('Email');
        if (!user.phone) missingFields.push('Phone');
        if (!user.business_name) missingFields.push('Business Name');
        if (!user.business_type) missingFields.push('Business Type');
        if (!user.has_photo) missingFields.push('Profile Photo');

        res.status(200).json({
            message: 'Profile completeness checked',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                businessName: user.business_name,
                businessType: user.business_type,
                hasPhoto: !!user.has_photo,
                createdAt: user.created_at
            },
            completeness,
            canApplyForLicense: completeness === 100,
            missingFields
        });

    } catch (error) {
        console.error('Error checking profile completeness:', error);
        res.status(500).json({ 
            message: 'Failed to check profile completeness',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;