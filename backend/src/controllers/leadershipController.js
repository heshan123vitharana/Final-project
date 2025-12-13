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
  console.log('Leadership API: Received request to add member.');
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);
  try {
    await ensureUploadDir();

    const {
      name,
      position,
      bio,
      email,
      linkedin,
      twitter,
      order_index,
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
      parseInt(order_index) || 1,
      is_active !== undefined ? (is_active === '1' || is_active === 'true' ? 1 : 0) : 1
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
  console.log('Leadership API: Received request to update member');
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);
  console.log('is_active value:', req.body.is_active, 'Type:', typeof req.body.is_active);
  try {
    const { id } = req.params;
    const {
      name,
      position,
      bio,
      email,
      linkedin,
      twitter,
      order_index,
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

    const finalIsActive = is_active !== undefined ? (is_active === '1' || is_active === 'true' || is_active === true ? 1 : 0) : existing[0].is_active;
    console.log('Updating with is_active:', finalIsActive);

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
      order_index !== undefined ? parseInt(order_index) : existing[0].order_index,
      finalIsActive,
      id
    ]);

    console.log('✅ Leadership member updated successfully in database');

    // Fetch the updated record to confirm
    const [updated] = await req.db.execute('SELECT * FROM leadership WHERE id = ?', [id]);
    console.log('Updated record:', updated[0]);

    res.json({
      success: true,
      message: 'Leadership member updated successfully',
      data: updated[0]
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

// Automatically reorder all leadership members sequentially
const reorderLeadership = async (req, res) => {
  try {
    console.log('🔄 Leadership API: Reordering all leadership members');

    // Fetch all leadership members sorted by current order_index, then by id as fallback
    const [leaders] = await req.db.execute(
      'SELECT id, name, order_index FROM leadership ORDER BY order_index ASC, id ASC'
    );

    if (leaders.length === 0) {
      return res.json({
        success: true,
        message: 'No leadership members to reorder',
        updated: 0
      });
    }

    console.log('📋 Found', leaders.length, 'leaders to reorder');

    // Update each leader with sequential order numbers (1, 2, 3, ...)
    for (let i = 0; i < leaders.length; i++) {
      const newOrder = i + 1;
      await req.db.execute(
        'UPDATE leadership SET order_index = ? WHERE id = ?',
        [newOrder, leaders[i].id]
      );
      console.log(`✅ Updated ${leaders[i].name} (ID: ${leaders[i].id}) from order ${leaders[i].order_index} to ${newOrder}`);
    }

    res.json({
      success: true,
      message: 'Leadership members reordered successfully',
      updated: leaders.length
    });
  } catch (error) {
    console.error('❌ Error reordering leadership members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder leadership members',
      error: error.message
    });
  }
};

// Batch update order for drag-and-drop reordering
const batchUpdateOrder = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required'
      });
    }

    console.log('🔄 Leadership API: Batch updating order for', updates.length, 'members');

    // Update each leader's order_index
    for (const update of updates) {
      await req.db.execute(
        'UPDATE leadership SET order_index = ? WHERE id = ?',
        [update.order_index, update.id]
      );
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      updated: updates.length
    });
  } catch (error) {
    console.error('❌ Error batch updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
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
  reorderLeadership,
  batchUpdateOrder,
  upload
};