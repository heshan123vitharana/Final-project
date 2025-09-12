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

// Update user profile data
router.put('/update/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            firstName,
            lastName,
            email,
            phone,
            businessName,
            businessType
        } = req.body;

        console.log(`📝 Updating profile for user ${userId}`);

        if (!firstName || !lastName || !email || !phone || !businessName || !businessType) {
            return res.status(400).json({
                message: 'Missing required fields: firstName, lastName, email, phone, businessName, businessType'
            });
        }

        // Update user profile
        const [result] = await pool.execute(`
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, phone = ?, 
                business_name = ?, business_type = ?
            WHERE id = ?
        `, [firstName, lastName, email, phone, businessName, businessType, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`✅ Profile updated successfully for user ${userId}`);
        
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: userId,
                firstName,
                lastName,
                email,
                phone,
                businessName,
                businessType
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

module.exports = router;