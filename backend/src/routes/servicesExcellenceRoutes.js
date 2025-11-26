const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
  getAllExcellenceItems,
  addExcellenceItem,
  updateExcellenceItem,
  deleteExcellenceItem
} = require('../controllers/servicesExcellenceController');

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'Services & Excellence routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Services routes
router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.post('/services', addService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Excellence routes
router.get('/excellence', getAllExcellenceItems);
router.post('/excellence', addExcellenceItem);
router.put('/excellence/:id', updateExcellenceItem);
router.delete('/excellence/:id', deleteExcellenceItem);

// Main route - return combined data as array
router.get('/', async (req, res) => {
  try {
    const [services] = await req.db.execute('SELECT * FROM services ORDER BY priority DESC, created_at DESC');
    const [excellence] = await req.db.execute('SELECT * FROM excellence_items ORDER BY priority DESC, created_at DESC');
    
    // Combine both into a unified array with type indicators
    const combinedData = [
      ...services.map(service => ({
        ...service,
        type: service.category || 'service',
        features: service.features ? (typeof service.features === 'string' ? JSON.parse(service.features) : service.features) : [],
        source_table: 'services'
      })),
      ...excellence.map(item => ({
        ...item,
        type: 'excellence',
        category: item.type, // map excellence type to category field
        is_active: item.status === 'active', // map status to is_active
        features: [], // excellence items don't have features for now
        source_table: 'excellence_items'
      }))
    ];

    res.json({
      success: true,
      data: combinedData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching services and excellence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
      error: error.message
    });
  }
});

// Unified POST endpoint
router.post('/', async (req, res) => {
  try {
    const { title, description, type, icon, features, priority, isActive } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    let result;
    
    if (type === 'excellence' || type === 'achievement' || type === 'certification' || type === 'award') {
      // Insert into excellence_items table
      [result] = await req.db.execute(`
        INSERT INTO excellence_items (
          title, description, type, priority, status
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        title,
        description,
        type === 'excellence' ? 'achievement' : type,
        priority || 0,
        isActive ? 'active' : 'inactive'
      ]);
    } else {
      // Insert into services table
      [result] = await req.db.execute(`
        INSERT INTO services (
          title, description, category, icon, features, priority, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        title,
        description,
        type || 'service',
        icon || null,
        features ? JSON.stringify(features) : null,
        priority || 0,
        isActive ? 1 : 0
      ]);
    }

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      data: {
        id: result.insertId,
        title,
        description,
        type
      }
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item',
      error: error.message
    });
  }
});

// Unified PUT endpoint
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, icon, features, priority, isActive, source_table } = req.body;
    
    let result;
    
    if (source_table === 'excellence_items') {
      [result] = await req.db.execute(`
        UPDATE excellence_items SET
          title = ?, description = ?, type = ?, priority = ?, status = ?
        WHERE id = ?
      `, [
        title,
        description,
        type === 'excellence' ? 'achievement' : type,
        priority || 0,
        isActive ? 'active' : 'inactive',
        id
      ]);
    } else {
      [result] = await req.db.execute(`
        UPDATE services SET
          title = ?, description = ?, category = ?, icon = ?, features = ?, priority = ?, is_active = ?
        WHERE id = ?
      `, [
        title,
        description,
        type || 'service',
        icon || null,
        features ? JSON.stringify(features) : null,
        priority || 0,
        isActive ? 1 : 0,
        id
      ]);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error.message
    });
  }
});

// Unified DELETE endpoint
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { source_table } = req.query;
    
    let result;
    
    if (source_table === 'excellence_items') {
      [result] = await req.db.execute('DELETE FROM excellence_items WHERE id = ?', [id]);
    } else {
      [result] = await req.db.execute('DELETE FROM services WHERE id = ?', [id]);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
});

module.exports = router;