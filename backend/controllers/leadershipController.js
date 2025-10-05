const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/leadership/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'leader-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.mkdir('uploads/leadership', { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
};

// Get all leadership members
const getAllLeadership = async (req, res) => {
  try {
    console.log('🔍 Leadership API: getAllLeadership called');
    const { is_active } = req.query;

    let query = 'SELECT * FROM leadership WHERE 1=1';
    const params = [];

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY order_index ASC, created_at DESC';
    console.log('🔍 Leadership API: Executing query:', query, 'with params:', params);

    const [rows] = await req.db.execute(query, params);
    console.log('✅ Leadership API: Found', rows.length, 'records');

    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('❌ Leadership API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leadership members',
      error: error.message
    });
  }
};

// Get leadership member by ID
const getLeadershipById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await req.db.execute(
      'SELECT * FROM leadership WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Leadership member not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching leadership member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leadership member',
      error: error.message
    });
  }
};

// Add new leadership member
const addLeadership = async (req, res) => {
  try {
    await ensureUploadDir();
    
    const { 
      name, 
      position, 
      bio, 
      email, 
      linkedin, 
      twitter, 
      order_position, 
      is_active 
    } = req.body;

    if (!name || !position) {
      return res.status(400).json({
        success: false,
        message: 'Name and position are required'
      });
    }

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/leadership/${req.file.filename}`;
    }

    const [result] = await req.db.execute(`
      INSERT INTO leadership (
        name, position, bio, image_url, email, 
        linkedin_url, twitter_url, order_index, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      position,
      bio || null,
      image_url,
      email || null,
      linkedin || null,
      twitter || null,
      parseInt(order_position) || 1,
      is_active !== undefined ? (is_active === 'true' ? 1 : 0) : 1
    ]);

    res.status(201).json({
      success: true,
      message: 'Leadership member added successfully',
      data: {
        id: result.insertId,
        name,
        position,
        image_url
      }
    });
  } catch (error) {
    console.error('Error adding leadership member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add leadership member',
      error: error.message
    });
  }
};

// Update leadership member
const updateLeadership = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      position, 
      bio, 
      email, 
      linkedin, 
      twitter, 
      order_position, 
      is_active 
    } = req.body;

    // Check if leadership member exists
    const [existing] = await req.db.execute(
      'SELECT * FROM leadership WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Leadership member not found'
      });
    }

    let image_url = existing[0].image_url;
    if (req.file) {
      // Delete old image if it exists
      if (existing[0].image_url) {
        try {
          const oldImagePath = path.join(process.cwd(), existing[0].image_url);
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.log('Could not delete old image:', error.message);
        }
      }
      image_url = `/uploads/leadership/${req.file.filename}`;
    }

    await req.db.execute(`
      UPDATE leadership SET
        name = ?, position = ?, bio = ?, image_url = ?,
        email = ?, linkedin_url = ?, twitter_url = ?,
        order_index = ?, is_active = ?
      WHERE id = ?
    `, [
      name || existing[0].name,
      position || existing[0].position,
      bio !== undefined ? bio : existing[0].bio,
      image_url,
      email !== undefined ? email : existing[0].email,
      linkedin !== undefined ? linkedin : existing[0].linkedin_url,
      twitter !== undefined ? twitter : existing[0].twitter_url,
      order_position !== undefined ? parseInt(order_position) : existing[0].order_index,
      is_active !== undefined ? (is_active === 'true' ? 1 : 0) : existing[0].is_active,
      id
    ]);

    res.json({
      success: true,
      message: 'Leadership member updated successfully'
    });
  } catch (error) {
    console.error('Error updating leadership member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leadership member',
      error: error.message
    });
  }
};

// Delete leadership member
const deleteLeadership = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if leadership member exists
    const [existing] = await req.db.execute(
      'SELECT * FROM leadership WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Leadership member not found'
      });
    }

    // Delete image file if it exists
    if (existing[0].image_url) {
      try {
        const imagePath = path.join(process.cwd(), existing[0].image_url);
        await fs.unlink(imagePath);
      } catch (error) {
        console.log('Could not delete image file:', error.message);
      }
    }

    await req.db.execute('DELETE FROM leadership WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Leadership member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting leadership member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete leadership member',
      error: error.message
    });
  }
};

module.exports = {
  getAllLeadership,
  getLeadershipById,
  addLeadership,
  updateLeadership,
  deleteLeadership,
  upload
};