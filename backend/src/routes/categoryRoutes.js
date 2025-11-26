const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getImagesByCategory,
  getCategoriesWithCounts
} = require('../controllers/categoryController');

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Category routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Category CRUD routes
router.get('/', getAllCategories);
router.get('/with-counts', getCategoriesWithCounts);
router.get('/:id', getCategoryById);
router.get('/:id/images', getImagesByCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;