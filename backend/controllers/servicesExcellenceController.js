// Get all services
const getAllServices = async (req, res) => {
  try {
    const { category, is_active } = req.query;

    let query = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    const [rows] = await req.db.execute(query, params);

    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await req.db.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

// Add new service
const addService = async (req, res) => {
  try {
    const { title, description, icon, image_url, category, priority, is_active } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const [result] = await req.db.execute(`
      INSERT INTO services (
        title, description, icon, image_url, category, priority, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description,
      icon || null,
      image_url || null,
      category || 'service',
      priority || 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);

    res.status(201).json({
      success: true,
      message: 'Service added successfully',
      data: {
        id: result.insertId,
        title,
        description,
        category: category || 'service'
      }
    });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add service',
      error: error.message
    });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, image_url, category, priority, is_active } = req.body;

    // Check if service exists
    const [existing] = await req.db.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await req.db.execute(`
      UPDATE services SET
        title = ?, description = ?, icon = ?, image_url = ?,
        category = ?, priority = ?, is_active = ?
      WHERE id = ?
    `, [
      title || existing[0].title,
      description || existing[0].description,
      icon !== undefined ? icon : existing[0].icon,
      image_url !== undefined ? image_url : existing[0].image_url,
      category || existing[0].category,
      priority !== undefined ? priority : existing[0].priority,
      is_active !== undefined ? (is_active ? 1 : 0) : existing[0].is_active,
      id
    ]);

    res.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if service exists
    const [existing] = await req.db.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await req.db.execute('DELETE FROM services WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// Get all excellence items
const getAllExcellenceItems = async (req, res) => {
  try {
    const { type, status, featured } = req.query;

    let query = 'SELECT * FROM excellence_items WHERE 1=1';
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (featured !== undefined) {
      query += ' AND is_featured = ?';
      params.push(featured === 'true' ? 1 : 0);
    }

    query += ' ORDER BY priority DESC, date_achieved DESC, created_at DESC';

    const [rows] = await req.db.execute(query, params);

    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Error fetching excellence items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch excellence items',
      error: error.message
    });
  }
};

// Add new excellence item
const addExcellenceItem = async (req, res) => {
  try {
    const { title, description, type, date_achieved, image_url, certificate_url, priority, is_featured } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and type are required'
      });
    }

    const [result] = await req.db.execute(`
      INSERT INTO excellence_items (
        title, description, type, date_achieved, image_url, certificate_url, priority, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description,
      type,
      date_achieved || null,
      image_url || null,
      certificate_url || null,
      priority || 0,
      is_featured ? 1 : 0
    ]);

    res.status(201).json({
      success: true,
      message: 'Excellence item added successfully',
      data: {
        id: result.insertId,
        title,
        description,
        type
      }
    });
  } catch (error) {
    console.error('Error adding excellence item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add excellence item',
      error: error.message
    });
  }
};

// Update excellence item
const updateExcellenceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, date_achieved, image_url, certificate_url, priority, is_featured, status } = req.body;

    // Check if item exists
    const [existing] = await req.db.execute(
      'SELECT * FROM excellence_items WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Excellence item not found'
      });
    }

    await req.db.execute(`
      UPDATE excellence_items SET
        title = ?, description = ?, type = ?, date_achieved = ?, image_url = ?,
        certificate_url = ?, priority = ?, is_featured = ?, status = ?
      WHERE id = ?
    `, [
      title || existing[0].title,
      description || existing[0].description,
      type || existing[0].type,
      date_achieved !== undefined ? date_achieved : existing[0].date_achieved,
      image_url !== undefined ? image_url : existing[0].image_url,
      certificate_url !== undefined ? certificate_url : existing[0].certificate_url,
      priority !== undefined ? priority : existing[0].priority,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing[0].is_featured,
      status || existing[0].status,
      id
    ]);

    res.json({
      success: true,
      message: 'Excellence item updated successfully'
    });
  } catch (error) {
    console.error('Error updating excellence item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update excellence item',
      error: error.message
    });
  }
};

// Delete excellence item
const deleteExcellenceItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const [existing] = await req.db.execute(
      'SELECT * FROM excellence_items WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Excellence item not found'
      });
    }

    await req.db.execute('DELETE FROM excellence_items WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Excellence item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting excellence item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete excellence item',
      error: error.message
    });
  }
};

module.exports = {
  // Services
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,

  // Excellence
  getAllExcellenceItems,
  addExcellenceItem,
  updateExcellenceItem,
  deleteExcellenceItem
};