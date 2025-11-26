const express = require('express');
const router = express.Router();
const {
  getAllLeadership,
  getLeadershipById,
  addLeadership,
  updateLeadership,
  deleteLeadership,
  upload,
  reorderLeadership
} = require('../controllers/leadershipController');

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'Leadership routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Leadership routes
router.get('/', getAllLeadership);
router.get('/:id', getLeadershipById);
router.post('/', upload.single('image'), addLeadership);
router.put('/:id', upload.single('image'), updateLeadership);
router.delete('/:id', deleteLeadership);
router.post('/reorder', reorderLeadership); // New endpoint to auto-reorder

module.exports = router;