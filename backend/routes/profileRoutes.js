const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Test route
router.get('/test', (req, res) => {
  console.log('📸 Profile test route hit!');
  res.json({ message: 'Profile routes are working!' });
});

// Upload profile photo
router.post('/upload-photo', async (req, res) => {
  try {
    console.log('📸 Upload photo request received');
    console.log('Request body keys:', Object.keys(req.body));
    
    const { userId, photoData, filename, fileSize, mimeType } = req.body;

    console.log('Upload data:', {
      userId,
      filename,
      fileSize,
      mimeType,
      hasPhotoData: !!photoData,
      photoDataLength: photoData ? photoData.length : 0
    });

    if (!userId || !photoData || !filename || !fileSize || !mimeType) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields: userId, photoData, filename, fileSize, mimeType' 
      });
    }

    // Validate file size (max 5MB)
    if (fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        message: 'File size too large. Maximum allowed size is 5MB.' 
      });
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(mimeType.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
      });
    }

    // Check if user exists
    const [userCheck] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Insert or update profile photo
    await pool.execute(`
      INSERT INTO user_profile_photos (user_id, photo_data, filename, file_size, mime_type) 
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        photo_data = VALUES(photo_data),
        filename = VALUES(filename),
        file_size = VALUES(file_size),
        mime_type = VALUES(mime_type),
        updated_at = CURRENT_TIMESTAMP
    `, [userId, photoData, filename, fileSize, mimeType]);

    console.log(`✅ Profile photo uploaded/updated for user ${userId}`);
    
    res.status(200).json({ 
      message: 'Profile photo uploaded successfully',
      filename: filename
    });

  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ 
      message: 'Failed to upload profile photo', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get profile photo
router.get('/photo/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get profile photo from database
    const [photoResult] = await pool.execute(
      'SELECT photo_data, filename, mime_type, uploaded_at FROM user_profile_photos WHERE user_id = ?',
      [userId]
    );

    if (photoResult.length === 0) {
      return res.status(404).json({ message: 'Profile photo not found' });
    }

    const photo = photoResult[0];

    res.status(200).json({
      message: 'Profile photo retrieved successfully',
      photoData: photo.photo_data,
      filename: photo.filename,
      mimeType: photo.mime_type,
      uploadedAt: photo.uploaded_at
    });

  } catch (error) {
    console.error('Error retrieving profile photo:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve profile photo', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete profile photo
router.delete('/photo/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if photo exists
    const [photoCheck] = await pool.execute(
      'SELECT id FROM user_profile_photos WHERE user_id = ?',
      [userId]
    );

    if (photoCheck.length === 0) {
      return res.status(404).json({ message: 'Profile photo not found' });
    }

    // Delete profile photo
    await pool.execute(
      'DELETE FROM user_profile_photos WHERE user_id = ?',
      [userId]
    );

    console.log(`✅ Profile photo deleted for user ${userId}`);
    
    res.status(200).json({ 
      message: 'Profile photo deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting profile photo:', error);
    res.status(500).json({ 
      message: 'Failed to delete profile photo', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update user profile data - Enhanced with all fields
router.put('/update/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            district,
            postalCode,
            businessName,
            businessType,
            millCapacity,
            millLocation,
            registrationDate
        } = req.body;

        console.log(`📝 Updating complete profile for user ${userId}`);
        console.log('📝 Received data:', { firstName, lastName, email, phone, address, city, district, postalCode, businessName, businessType, millCapacity, millLocation, registrationDate });

        // Update user profile with all fields (only the fields that are sent from frontend)
        const [result] = await pool.execute(`
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, phone = ?, 
                address = ?, city = ?, district = ?, postal_code = ?,
                business_name = ?, business_type = ?, mill_capacity = ?, mill_location = ?, registration_date = ?
            WHERE id = ?
        `, [firstName, lastName, email, phone, address, city, district, postalCode, businessName, businessType, millCapacity, millLocation, registrationDate, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`✅ Complete profile updated successfully for user ${userId}`);
        
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: userId,
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                district,
                postalCode,
                businessName,
                businessType,
                millCapacity,
                millLocation,
                registrationDate
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get user profile data
router.get('/user/:userId', async (req, res) => {
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

        res.status(200).json({
            message: 'User data retrieved successfully',
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
            }
        });

    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({
            message: 'Failed to retrieve user data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Profile completeness check endpoint
router.get('/completeness/:userId', async (req, res) => {
    try {
        console.log('📊 Profile completeness check for user:', req.params.userId);
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

        console.log('📊 Raw user data for completeness calculation:', JSON.stringify({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            district: user.district,
            postal_code: user.postal_code,
            business_name: user.business_name,
            business_type: user.business_type,
            mill_capacity: user.mill_capacity,
            mill_location: user.mill_location,
            license_number: user.license_number,
            registration_date: user.registration_date
        }, null, 2));

        // Calculate weighted profile completeness (Personal 50% + Business 50%)
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
            { field: user.registration_date, name: 'Registration Date' }
        ];
        
        // Calculate filled fields for each category
        const filledPersonalFields = personalFields.filter(item => {
            const isValid = item.field && item.field.toString().trim() !== '';
            console.log(`📊 ${item.name}: ${item.field} -> ${isValid ? 'FILLED' : 'EMPTY'}`);
            return isValid;
        });
        const filledBusinessFields = businessFields.filter(item => {
            const isValid = item.field && item.field.toString().trim() !== '';
            console.log(`📊 ${item.name}: ${item.field} -> ${isValid ? 'FILLED' : 'EMPTY'}`);
            return isValid;
        });
        
        // Calculate weighted completeness
        const personalCompleteness = (filledPersonalFields.length / personalFields.length) * 50;
        const businessCompleteness = (filledBusinessFields.length / businessFields.length) * 50;
        const completeness = Math.round(personalCompleteness + businessCompleteness);

        console.log(`📊 Personal fields: ${filledPersonalFields.length}/${personalFields.length} = ${personalCompleteness}%`);
        console.log(`📊 Business fields: ${filledBusinessFields.length}/${businessFields.length} = ${businessCompleteness}%`);
        console.log(`📊 Total completeness: ${completeness}%`);

        console.log(`👤 Personal: ${filledPersonalFields.length}/${personalFields.length} = ${personalCompleteness}%`);
        console.log(`🏢 Business: ${filledBusinessFields.length}/${businessFields.length} = ${businessCompleteness}%`);
        console.log(`📊 Total: ${completeness}%`);

        // Get missing fields
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

        console.log(`📊 User ${userId} completeness: ${completeness}%`);

        res.status(200).json({
            message: 'Profile completeness retrieved successfully',
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

// Simple test to clear old address fields for user 1
router.get('/clear-test-user-fields', async (req, res) => {
    try {
        console.log('🧹 Clearing address fields for test user...');
        
        await pool.execute(`
            UPDATE users 
            SET address = NULL, city = NULL, district = NULL, postal_code = NULL,
                mill_capacity = NULL, mill_location = NULL, license_number = NULL, registration_date = NULL
            WHERE id = 1
        `);

        console.log('✅ Test user fields cleared');
        res.json({ message: 'Test user address and business fields cleared', timestamp: new Date().toISOString() });
        
    } catch (error) {
        console.error('❌ Error clearing test user fields:', error);
        res.status(500).json({ message: 'Failed to clear fields', error: error.message });
    }
});

// Debug endpoint to check raw database data
router.get('/debug/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('🔍 Debug: Checking raw database data for user:', userId);

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
        console.log('🔍 Raw user data:', JSON.stringify({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            district: user.district,
            postal_code: user.postal_code,
            business_name: user.business_name,
            business_type: user.business_type,
            mill_capacity: user.mill_capacity,
            mill_location: user.mill_location,
            license_number: user.license_number,
            registration_date: user.registration_date
        }, null, 2));

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
            { field: user.registration_date, name: 'Registration Date' }
        ];
        
        // Calculate filled fields for each category
        const filledPersonalFields = personalFields.filter(item => {
            const isValid = item.field && item.field.toString().trim() !== '';
            console.log(`🔍 ${item.name}: "${item.field}" -> ${isValid ? 'FILLED' : 'EMPTY'}`);
            return isValid;
        });
        const filledBusinessFields = businessFields.filter(item => {
            const isValid = item.field && item.field.toString().trim() !== '';
            console.log(`🔍 ${item.name}: "${item.field}" -> ${isValid ? 'FILLED' : 'EMPTY'}`);
            return isValid;
        });
        
        // Calculate weighted completeness
        const personalCompleteness = (filledPersonalFields.length / personalFields.length) * 50;
        const businessCompleteness = (filledBusinessFields.length / businessFields.length) * 50;
        const completeness = Math.round(personalCompleteness + businessCompleteness);

        console.log('🔍 Personal fields:', filledPersonalFields.length, '/', personalFields.length, '=', personalCompleteness, '%');
        console.log('🔍 Business fields:', filledBusinessFields.length, '/', businessFields.length, '=', businessCompleteness, '%');
        console.log('🔍 Total completeness:', completeness, '%');

        // Get missing fields
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

        res.status(200).json({
            message: 'Debug data retrieved',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                city: user.city,
                district: user.district,
                postal_code: user.postal_code,
                business_name: user.business_name,
                business_type: user.business_type,
                mill_capacity: user.mill_capacity,
                mill_location: user.mill_location,
                license_number: user.license_number,
                registration_date: user.registration_date,
                has_photo: user.has_photo
            },
            personalFields: {
                total: personalFields.length,
                filled: filledPersonalFields.length,
                completeness: personalCompleteness
            },
            businessFields: {
                total: businessFields.length,
                filled: filledBusinessFields.length,
                completeness: businessCompleteness
            },
            overallCompleteness: completeness,
            missingFields
        });

    } catch (error) {
        console.error('🔍 Debug error:', error);
        res.status(500).json({ 
            message: 'Debug failed', 
            error: error.message 
        });
    }
});

module.exports = router;