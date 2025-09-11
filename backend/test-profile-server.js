require('dotenv').config();
const express = require('express');
const pool = require('./config/database');

const app = express();

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Increase payload limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path}`);
    next();
});

// Test route
app.get('/api/profile/test', (req, res) => {
    console.log('📸 Profile test route hit!');
    res.json({ message: 'Profile routes are working!' });
});

// Upload profile photo
app.post('/api/profile/upload-photo', async (req, res) => {
    try {
        console.log('📸 Upload photo request received');
        const { userId, photoData, filename, fileSize, mimeType } = req.body;

        console.log('Upload data:', {
            userId,
            filename,
            fileSize,
            mimeType,
            hasPhotoData: !!photoData
        });

        if (!userId || !photoData || !filename || !fileSize || !mimeType) {
            return res.status(400).json({ 
                message: 'Missing required fields' 
            });
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

        console.log(`✅ Profile photo uploaded for user ${userId}`);
        
        res.status(200).json({ 
            message: 'Profile photo uploaded successfully'
        });

    } catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json({ 
            message: 'Failed to upload profile photo',
            error: error.message
        });
    }
});

// Get profile photo
app.get('/api/profile/photo/:userId', async (req, res) => {
    try {
        console.log('📸 Get photo request for user:', req.params.userId);
        const { userId } = req.params;

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
            error: error.message
        });
    }
});

const PORT = 5001; // Use different port to avoid conflicts
app.listen(PORT, () => {
    console.log(`✅ Test profile server running on port ${PORT}`);
});