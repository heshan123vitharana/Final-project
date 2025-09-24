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

// Main route - return combined data
router.get('/', async (req, res) => {
  try {
    const [services] = await req.db.execute('SELECT * FROM services WHERE is_active = 1 ORDER BY priority DESC');
    const [excellence] = await req.db.execute('SELECT * FROM excellence_items WHERE status = "active" ORDER BY priority DESC');

    res.json({
      success: true,
      data: {
        services,
        excellence
      },
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

module.exports = router;