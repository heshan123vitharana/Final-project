const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Get all gallery images
const getAllImages = async (req, res) => {
  try {
    const { category, status, featured } = req.query;

    let query = 'SELECT * FROM gallery_images WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (featured !== undefined) {
      query += ' AND is_featured = ?';
      params.push(featured === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';

    console.log('Gallery query:', query);
    const [rows] = await req.db.execute(query, params);

    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error.message
    });
  }
};

// Get single image by ID
const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await req.db.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image',
      error: error.message
    });
  }
};

// Add new image
const addImage = async (req, res) => {
  try {
    const { title, description, category, is_active, status } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Convert image to base64 for storage
    const imageData = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageUrl = `data:${mimeType};base64,${imageData}`;

    // Save to file system (optional - using base64 in image_url instead)
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `/uploads/gallery/${fileName}`;

    const [result] = await req.db.execute(`
      INSERT INTO gallery_images (
        title, description, category, file_name, file_path,
        file_size, mime_type, image_url, is_active, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || null,
      category || 'General',
      fileName,
      filePath,
      req.file.size,
      mimeType,
      imageUrl, // Store base64 data URL
      is_active !== undefined ? (is_active === 'true' || is_active === true ? 1 : 0) : 1,
      status || 'active'
    ]);

    res.status(201).json({
      success: true,
      message: 'Image added successfully',
      data: {
        id: result.insertId,
        title,
        description,
        category: category || 'General',
        file_name: fileName,
        file_path: filePath,
        image_url: imageUrl,
        is_active: is_active !== undefined ? (is_active === 'true' || is_active === true ? 1 : 0) : 1,
        status: status || 'active'
      }
    });
  } catch (error) {
    console.error('Error adding image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add image',
      error: error.message
    });
  }
};

// Update image
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, is_active, status } = req.body;

    console.log('🔄 UPDATE REQUEST:', {
      id,
      body: req.body,
      hasFile: !!req.file
    });

    // Validate required fields
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Image ID is required'
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Check if image exists
    const [existing] = await req.db.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    console.log('📋 Existing image data:', {
      id: existing[0].id,
      title: existing[0].title,
      is_active: existing[0].is_active,
      status: existing[0].status
    });

    let imageUrl = existing[0].image_url;
    let fileName = existing[0].file_name;
    let filePath = existing[0].file_path;
    let fileSize = existing[0].file_size;
    let mimeType = existing[0].mime_type;

    // If new image is uploaded
    if (req.file) {
      console.log('📁 New file uploaded');
      const imageData = req.file.buffer.toString('base64');
      const newMimeType = req.file.mimetype;
      imageUrl = `data:${newMimeType};base64,${imageData}`;
      fileName = `${Date.now()}-${req.file.originalname}`;
      filePath = `/uploads/gallery/${fileName}`;
      fileSize = req.file.size;
      mimeType = newMimeType;
    }

    const updateValues = [
      title.trim(),
      description !== undefined ? (description?.trim() || null) : existing[0].description,
      category || existing[0].category,
      fileName,
      filePath,
      fileSize,
      mimeType,
      imageUrl,
      is_active !== undefined ? (is_active === 'true' || is_active === true || is_active === 1 ? 1 : 0) : existing[0].is_active,
      status || (is_active !== undefined ? (is_active ? 'active' : 'inactive') : existing[0].status),
      id
    ];

    console.log('📤 Update values:', updateValues);

    await req.db.execute(`
      UPDATE gallery_images SET
        title = ?, description = ?, category = ?,
        file_name = ?, file_path = ?, file_size = ?, mime_type = ?,
        image_url = ?, is_active = ?, status = ?
      WHERE id = ?
    `, updateValues);

    // Fetch the updated image to return it
    const [updated] = await req.db.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );

    console.log('✅ Updated successfully:', {
      id: updated[0].id,
      title: updated[0].title,
      is_active: updated[0].is_active,
      status: updated[0].status
    });

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('❌ Error updating image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image',
      error: error.message
    });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if image exists
    const [existing] = await req.db.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    await req.db.execute('DELETE FROM gallery_images WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  getAllImages,
  getImageById,
  addImage,
  updateImage,
  deleteImage
};