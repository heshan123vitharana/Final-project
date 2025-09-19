const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { generateLicense, saveLicenseToDatabase } = require('../utils/licenseGenerator');
const CertificateDataGenerator = require('../utils/certificateDataGenerator');
const UnifiedCertificateGenerator = require('../utils/unifiedCertificateGenerator');

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

        // Extract base64 data from file objects
        let paymentReceiptData, brDocumentData;

        if (typeof paymentReceipt === 'object' && paymentReceipt.data) {
            paymentReceiptData = paymentReceipt.data;
            console.log('📎 Payment receipt file:', paymentReceipt.name, paymentReceipt.size, 'bytes');

            // Validate file size (10MB limit)
            if (paymentReceipt.size > 10 * 1024 * 1024) {
                return res.status(400).json({ message: 'Payment receipt file size should be less than 10MB' });
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(paymentReceipt.type)) {
                return res.status(400).json({ message: 'Payment receipt must be an image (JPG, PNG) or PDF file' });
            }
        } else if (typeof paymentReceipt === 'string') {
            paymentReceiptData = paymentReceipt;
        } else {
            return res.status(400).json({ message: 'Invalid payment receipt format' });
        }

        if (typeof brDocument === 'object' && brDocument.data) {
            brDocumentData = brDocument.data;
            console.log('📎 BR document file:', brDocument.name, brDocument.size, 'bytes');

            // Validate file size (10MB limit)
            if (brDocument.size > 10 * 1024 * 1024) {
                return res.status(400).json({ message: 'BR document file size should be less than 10MB' });
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(brDocument.type)) {
                return res.status(400).json({ message: 'BR document must be an image (JPG, PNG) or PDF file' });
            }
        } else if (typeof brDocument === 'string') {
            brDocumentData = brDocument;
        } else {
            return res.status(400).json({ message: 'Invalid BR document format' });
        }

        // Check if user exists and get profile completeness
        const [userResult] = await pool.execute(`
            SELECT u.id, u.first_name, u.last_name, u.nic, u.email, u.phone, u.business_name, u.business_type,
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
        // Personal Information (50%): first_name, last_name, nic, email, phone, address, city, district, postal_code
        const personalFields = [
            user.first_name, user.last_name, user.nic, user.email, user.phone,
            user.address, user.city, user.district, user.postal_code
        ];
        const filledPersonalFields = personalFields.filter(field => field && field.toString().trim() !== '').length;
        const personalCompleteness = (filledPersonalFields / personalFields.length) * 50;
        
        // Business Information (50%): business_name, business_type, mill_capacity, mill_location, registration_date
        const businessFields = [
            user.business_name, user.business_type, user.mill_capacity,
            user.mill_location, user.registration_date
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
        `, [userId, applicationNumber, licenseType, paymentReceiptData, brDocumentData, comments]);

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
        console.log(`🔍 UPDATED PROFILE CHECK requested for user ID: ${userId}`);

        const [userResult] = await pool.execute(`
            SELECT u.id, u.first_name, u.last_name, u.nic, u.email, u.phone, u.business_name, u.business_type,
                   u.address, u.city, u.district, u.postal_code, u.mill_capacity, u.mill_location, u.mill_district,
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
        console.log('🔍 Mill district value:', user.mill_district);

        // Calculate profile completeness with weighted categories
        // Personal Information Fields (50%)
        const personalFields = [
            { field: user.first_name, name: 'First Name' },
            { field: user.last_name, name: 'Last Name' },
            { field: user.nic, name: 'NIC' },
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
            { field: user.mill_district, name: 'Mill District' },
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
                nic: !!user.nic,
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
                millDistrict: !!user.mill_district,
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
                nic: user.nic,
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
                millDistrict: user.mill_district,
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

// Get license application document
router.get('/document/:applicationId/:documentType', async (req, res) => {
    try {
        const { applicationId, documentType } = req.params;

        // Validate document type
        if (!['payment_receipt', 'br_document'].includes(documentType)) {
            return res.status(400).json({ message: 'Invalid document type' });
        }

        console.log(`📄 Fetching ${documentType} for application ${applicationId}`);

        const [result] = await pool.execute(`
            SELECT ${documentType}, application_number
            FROM mill_licenses
            WHERE id = ?
        `, [applicationId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'License application not found' });
        }

        const document = result[0];
        const documentData = document[documentType];

        if (!documentData) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({
            message: 'Document retrieved successfully',
            documentData: documentData,
            applicationNumber: document.application_number
        });

    } catch (error) {
        console.error('Error retrieving document:', error);
        res.status(500).json({
            message: 'Failed to retrieve document',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Test endpoint to verify code changes
router.get('/test-update', (_req, res) => {
    res.json({ message: 'Updated code is working', timestamp: new Date().toISOString() });
});

// ADMIN ENDPOINTS

// Test route
router.get('/test', (_req, res) => {
    console.log('🧪 License test route hit');
    res.json({ message: 'License routes are working' });
});

// Simple statistics test route
router.get('/admin/stats-test', (_req, res) => {
    console.log('📊 Simple stats test route hit');
    res.json({ message: 'Statistics test route working' });
});

// Get all license applications for admin (with filtering) - enhanced version
router.get('/admin/applications', async (req, res) => {
    console.log('📋 Admin fetching all license applications - ENHANCED VERSION');
    try {
        const { status, search } = req.query;

        let query = `
            SELECT
                ml.id,
                ml.application_number,
                ml.license_type,
                ml.status,
                ml.created_at,
                ml.approved_date,
                ml.rejected_date,
                ml.rejection_reason,
                ml.license_number,
                ml.approval_comments,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.business_name,
                u.business_type,
                u.address,
                u.city,
                u.district,
                u.mill_capacity,
                u.mill_location
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
        `;

        const queryParams = [];
        const conditions = [];

        if (status && status !== 'all') {
            conditions.push('ml.status = ?');
            queryParams.push(status);
        }

        if (search && search.trim()) {
            conditions.push(`(
                u.business_name LIKE ? OR
                u.first_name LIKE ? OR
                u.last_name LIKE ? OR
                ml.application_number LIKE ?
            )`);
            const searchTerm = `%${search.trim()}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY ml.created_at DESC';

        console.log('Executing query:', query);
        console.log('With params:', queryParams);

        const [applications] = await pool.execute(query, queryParams);

        console.log(`✅ Retrieved ${applications.length} applications`);

        res.status(200).json({
            message: 'License applications retrieved successfully',
            applications,
            total: applications.length
        });
    } catch (error) {
        console.error('Error retrieving license applications for admin:', error);
        res.status(500).json({
            message: 'Failed to retrieve license applications',
            error: error.message
        });
    }
});

// Approve a license application
router.put('/admin/approve/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { approvedBy: _approvedBy, comments } = req.body;

        console.log(`📋 Admin approving license application: ${applicationId}`);

        // Get the application details with full user information for license generation
        const [applicationResult] = await pool.execute(`
            SELECT ml.*, u.first_name, u.last_name, u.email, u.business_name, u.nic,
                   u.address, u.city, u.district, u.postal_code, u.mill_capacity,
                   u.mill_location, u.business_type
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE ml.id = ?
        `, [applicationId]);

        if (applicationResult.length === 0) {
            return res.status(404).json({ message: 'License application not found' });
        }

        const application = applicationResult[0];

        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending applications can be approved' });
        }

        // Generate license number
        const currentYear = new Date().getFullYear();
        const licenseNumber = `PMB/ML/${currentYear}/${application.application_number}`;

        // Update application status to approved
        const [updateResult] = await pool.execute(`
            UPDATE mill_licenses
            SET status = 'approved',
                approved_date = CURRENT_TIMESTAMP,
                license_number = ?,
                approval_comments = ?
            WHERE id = ?
        `, [licenseNumber, comments || '', applicationId]);

        if (updateResult.affectedRows === 0) {
            return res.status(500).json({ message: 'Failed to update application status' });
        }

        console.log(`✅ License application ${applicationId} approved with license number: ${licenseNumber}`);

        // Generate the license document automatically using UNIFIED generator
        try {
            console.log('📄 Generating unified license document...');

            // Create user object from application data
            const user = {
                first_name: application.first_name,
                last_name: application.last_name,
                business_name: application.business_name,
                business_type: application.business_type,
                city: application.city,
                district: application.district,
                mill_district: application.mill_district,
                address: application.address,
                mill_location: application.mill_location,
                mill_capacity: application.mill_capacity,
                email: application.email,
                phone: application.phone,
                nic: application.nic,
                postal_code: application.postal_code
            };

            // Create application object with license number
            const applicationWithLicense = {
                ...application,
                license_number: licenseNumber,
                approved_date: new Date().toISOString()
            };

            // Use UNIFIED certificate generator for consistency
            const unifiedGenerator = new UnifiedCertificateGenerator();
            const certificateData = unifiedGenerator.generateStandardizedCertificateData(applicationWithLicense, user);

            // Validate certificate data before generation
            const validation = unifiedGenerator.validateCertificateData(certificateData);
            if (!validation.isValid) {
                console.warn('⚠️ Certificate validation warnings:', validation.errors);
            }

            // Generate PDF using unified system
            const licenseBuffer = await unifiedGenerator.generatePDFLicense(certificateData);
            await unifiedGenerator.saveLicenseToDatabase(applicationId, licenseBuffer, pool);

            console.log('✅ Unified license document generated and saved successfully');
        } catch (licenseError) {
            console.error('⚠️ Warning: Failed to generate unified license document:', licenseError.message);
            // Don't fail the approval process if license generation fails
        }

        res.status(200).json({
            message: 'License application approved successfully',
            licenseNumber,
            application: {
                ...application,
                status: 'approved',
                license_number: licenseNumber,
                approved_date: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error approving license application:', error);
        res.status(500).json({ 
            message: 'Failed to approve license application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Reject a license application
router.put('/admin/reject/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { rejectedBy: _rejectedBy, rejectionReason } = req.body;

        console.log(`📋 Admin rejecting license application: ${applicationId}`);

        if (!rejectionReason || rejectionReason.trim() === '') {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        // Get the application details
        const [applicationResult] = await pool.execute(`
            SELECT ml.*, u.first_name, u.last_name, u.email, u.business_name
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE ml.id = ?
        `, [applicationId]);

        if (applicationResult.length === 0) {
            return res.status(404).json({ message: 'License application not found' });
        }

        const application = applicationResult[0];

        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending applications can be rejected' });
        }

        // Update application status to rejected
        const [updateResult] = await pool.execute(`
            UPDATE mill_licenses 
            SET status = 'rejected', 
                rejected_date = CURRENT_TIMESTAMP,
                rejection_reason = ?
            WHERE id = ?
        `, [rejectionReason, applicationId]);

        if (updateResult.affectedRows === 0) {
            return res.status(500).json({ message: 'Failed to update application status' });
        }

        console.log(`✅ License application ${applicationId} rejected with reason: ${rejectionReason}`);

        res.status(200).json({
            message: 'License application rejected successfully',
            application: {
                ...application,
                status: 'rejected',
                rejection_reason: rejectionReason,
                rejected_date: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error rejecting license application:', error);
        res.status(500).json({ 
            message: 'Failed to reject license application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get pending applications count for admin notifications
router.get('/admin/pending-count', async (_req, res) => {
    try {
        const [result] = await pool.execute(`
            SELECT COUNT(*) as pendingCount
            FROM mill_licenses
            WHERE status = 'pending'
        `);

        const pendingCount = result[0].pendingCount;

        res.status(200).json({
            message: 'Pending applications count retrieved successfully',
            pendingCount
        });

    } catch (error) {
        console.error('Error getting pending applications count:', error);
        res.status(500).json({
            message: 'Failed to get pending applications count',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get license statistics for reports - test version
router.get('/admin/statistics', (_req, res) => {
    console.log('📊 Admin requesting license statistics');
    res.status(200).json({
        message: 'Statistics endpoint is working!',
        data: {
            overall: {
                totalApplications: 1,
                approved: 1,
                pending: 0,
                rejected: 0
            },
            regional: [],
            millTypes: []
        }
    });
});

// Download generated license (existing PDF download)
router.get('/download/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;

        console.log(`📄 Downloading license for application: ${applicationId}`);

        // Get the generated license
        const [result] = await pool.execute(`
            SELECT generated_license, license_number, application_number, status
            FROM mill_licenses
            WHERE id = ?
        `, [applicationId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'License application not found' });
        }

        const license = result[0];

        if (license.status !== 'approved') {
            return res.status(400).json({ message: 'License is not approved yet' });
        }

        if (!license.generated_license) {
            return res.status(404).json({ message: 'Generated license not found' });
        }

        // Convert base64 back to buffer
        const licenseBuffer = Buffer.from(license.generated_license, 'base64');

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="License-${license.license_number}.pdf"`);
        res.setHeader('Content-Length', licenseBuffer.length);

        console.log(`✅ License downloaded: ${license.license_number}`);

        // Send the PDF
        res.send(licenseBuffer);

    } catch (error) {
        console.error('Error downloading license:', error);
        res.status(500).json({
            message: 'Failed to download license',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get certificate data for users (UNIFIED data for frontend display/download)
router.get('/certificate/:applicationId', async (req, res) => {
    try {
        console.log('📄 UNIFIED Certificate data request for application:', req.params.applicationId);
        const { applicationId } = req.params;

        // Get the license application details
        const applicationQuery = `
            SELECT ml.*, u.first_name, u.last_name, u.business_name, u.business_type,
                   u.city, u.district, u.mill_district, u.address, u.mill_location, u.mill_capacity,
                   u.email, u.phone, u.nic, u.postal_code
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE ml.id = ? AND ml.status = 'approved'
        `;

        const [applications] = await pool.execute(applicationQuery, [applicationId]);

        if (applications.length === 0) {
            return res.status(404).json({
                message: 'Certificate not found or application not approved'
            });
        }

        const application = applications[0];
        const user = {
            first_name: application.first_name,
            last_name: application.last_name,
            business_name: application.business_name,
            business_type: application.business_type,
            city: application.city,
            district: application.district,
            mill_district: application.mill_district,
            address: application.address,
            mill_location: application.mill_location,
            mill_capacity: application.mill_capacity,
            email: application.email,
            phone: application.phone,
            nic: application.nic,
            postal_code: application.postal_code
        };

        // Use UNIFIED certificate generator for consistency
        const unifiedGenerator = new UnifiedCertificateGenerator();
        const certificateData = unifiedGenerator.generateStandardizedCertificateData(application, user);

        // Validate the certificate data
        const validation = unifiedGenerator.validateCertificateData(certificateData);
        if (!validation.isValid) {
            console.warn('⚠️ Certificate data validation warnings:', validation.errors);
        }

        console.log(`✅ UNIFIED Certificate data retrieved for license: ${certificateData.licenseNumber}`);

        res.json({
            success: true,
            certificate: certificateData,
            application: {
                id: application.id,
                applicationNumber: application.application_number,
                status: application.status,
                submittedDate: application.created_at,
                approvedDate: application.approved_date
            },
            validation: validation,
            // Add download options
            downloadOptions: {
                textCertificate: `/api/licenses/download-text/${applicationId}`,
                pdfCertificate: `/api/licenses/download/${applicationId}`,
                imageCertificate: `/api/licenses/download-image/${applicationId}`
            }
        });

    } catch (error) {
        console.error('Error retrieving UNIFIED certificate data:', error);
        res.status(500).json({
            message: 'Failed to retrieve certificate data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Admin route to view certificate for approved applications (UNIFIED)
router.get('/admin/certificate/:applicationId', async (req, res) => {
    try {
        console.log('🎖️ Admin UNIFIED certificate view request received for ID:', req.params.applicationId);
        const { applicationId } = req.params;

        // First get the license application details
        const applicationQuery = `
            SELECT ml.*, u.first_name, u.last_name, u.business_name, u.business_type,
                   u.city, u.district, u.mill_district, u.address, u.mill_location, u.mill_capacity,
                   u.email, u.phone, u.nic, u.postal_code
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE ml.id = ? AND ml.status = 'approved'
        `;

        const [applications] = await pool.execute(applicationQuery, [applicationId]);

        if (applications.length === 0) {
            return res.status(404).json({
                message: 'Certificate not found or application not approved'
            });
        }

        const application = applications[0];
        const user = {
            first_name: application.first_name,
            last_name: application.last_name,
            business_name: application.business_name,
            business_type: application.business_type,
            city: application.city,
            district: application.district,
            mill_district: application.mill_district,
            address: application.address,
            mill_location: application.mill_location,
            mill_capacity: application.mill_capacity,
            email: application.email,
            phone: application.phone,
            nic: application.nic,
            postal_code: application.postal_code
        };

        // Use UNIFIED certificate data generator for consistency
        const unifiedGenerator = new UnifiedCertificateGenerator();
        const certificateData = unifiedGenerator.generateStandardizedCertificateData(application, user);

        // Validate the certificate data
        const validation = unifiedGenerator.validateCertificateData(certificateData);
        if (!validation.isValid) {
            console.warn('⚠️ Certificate data validation warnings:', validation.errors);
        }

        console.log(`✅ UNIFIED Certificate data generated for admin view: ${certificateData.licenseNumber}`);

        // Return complete certificate data for admin view
        res.json({
            success: true,
            certificate: certificateData,
            application: {
                id: application.id,
                applicationNumber: application.application_number,
                status: application.status,
                submittedDate: application.created_at,
                approvedDate: application.approved_date
            },
            validation: validation,
            message: 'UNIFIED Certificate data generated successfully'
        });

    } catch (error) {
        console.error('Error retrieving UNIFIED admin certificate:', error);
        res.status(500).json({
            message: 'Failed to retrieve certificate',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// UNIFIED download endpoints for different certificate formats
// Download text certificate using unified generator
router.get('/download-text/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;
        console.log(`📄 UNIFIED Text certificate download for application: ${applicationId}`);

        // Get application and user data
        const applicationQuery = `
            SELECT ml.*, u.first_name, u.last_name, u.business_name, u.business_type,
                   u.city, u.district, u.mill_district, u.address, u.mill_location, u.mill_capacity,
                   u.email, u.phone, u.nic, u.postal_code
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE ml.id = ? AND ml.status = 'approved'
        `;

        const [applications] = await pool.execute(applicationQuery, [applicationId]);

        if (applications.length === 0) {
            return res.status(404).json({ message: 'Certificate not found or not approved' });
        }

        const application = applications[0];
        const user = {
            first_name: application.first_name,
            last_name: application.last_name,
            business_name: application.business_name,
            business_type: application.business_type,
            city: application.city,
            district: application.district,
            mill_district: application.mill_district,
            address: application.address,
            mill_location: application.mill_location,
            mill_capacity: application.mill_capacity,
            email: application.email,
            phone: application.phone,
            nic: application.nic,
            postal_code: application.postal_code
        };

        // Generate unified certificate data
        const unifiedGenerator = new UnifiedCertificateGenerator();
        const certificateData = unifiedGenerator.generateStandardizedCertificateData(application, user);

        // Generate text certificate
        const textCertificate = unifiedGenerator.generateTextCertificate(certificateData);

        // Set headers for download
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="PMB_License_Certificate_${certificateData.licenseNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt"`);

        console.log(`✅ UNIFIED Text certificate downloaded: ${certificateData.licenseNumber}`);
        res.send(textCertificate);

    } catch (error) {
        console.error('Error downloading UNIFIED text certificate:', error);
        res.status(500).json({
            message: 'Failed to download text certificate',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Download image certificate using unified generator
router.get('/download-image/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;
        console.log(`🖼️ UNIFIED Image certificate download for application: ${applicationId}`);

        // Get application and user data
        const applicationQuery = `
            SELECT ml.*, u.first_name, u.last_name, u.business_name, u.business_type,
                   u.city, u.district, u.mill_district, u.address, u.mill_location, u.mill_capacity,
                   u.email, u.phone, u.nic, u.postal_code
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE ml.id = ? AND ml.status = 'approved'
        `;

        const [applications] = await pool.execute(applicationQuery, [applicationId]);

        if (applications.length === 0) {
            return res.status(404).json({ message: 'Certificate not found or not approved' });
        }

        const application = applications[0];
        const user = {
            first_name: application.first_name,
            last_name: application.last_name,
            business_name: application.business_name,
            business_type: application.business_type,
            city: application.city,
            district: application.district,
            mill_district: application.mill_district,
            address: application.address,
            mill_location: application.mill_location,
            mill_capacity: application.mill_capacity,
            email: application.email,
            phone: application.phone,
            nic: application.nic,
            postal_code: application.postal_code
        };

        // Generate unified certificate data
        const unifiedGenerator = new UnifiedCertificateGenerator();
        const certificateData = unifiedGenerator.generateStandardizedCertificateData(application, user);

        // Generate image certificate
        const imageBuffer = await unifiedGenerator.generateImageCertificate(certificateData);

        // Set headers for download
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="PMB_License_Certificate_${certificateData.licenseNumber.replace(/[^a-zA-Z0-9]/g, '_')}.png"`);
        res.setHeader('Content-Length', imageBuffer.length);

        console.log(`✅ UNIFIED Image certificate downloaded: ${certificateData.licenseNumber}`);
        res.send(imageBuffer);

    } catch (error) {
        console.error('Error downloading UNIFIED image certificate:', error);
        res.status(500).json({
            message: 'Failed to download image certificate',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;