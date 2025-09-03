const express = require('express');
const router = express.Router();

console.log('🛣️ PriceRoutes: Loading price controller...');
const priceController = require('../controllers/priceController_mysql');
console.log('🛣️ PriceRoutes: Controller exports:', Object.keys(priceController));

const {
  getAllPrices,
  getPriceById,
  addPrice,
  updatePrice,
  deletePrice
} = priceController;

console.log('🛣️ PriceRoutes: Functions check:');
console.log('  getAllPrices:', typeof getAllPrices);
console.log('  getPriceById:', typeof getPriceById);
console.log('  addPrice:', typeof addPrice);
console.log('  updatePrice:', typeof updatePrice);
console.log('  deletePrice:', typeof deletePrice);

console.log('🛣️ PriceRoutes: Controller loaded, setting up routes...');

// Public routes (for frontend display)
router.get('/', getAllPrices); // Now handles statistics via query param ?stats=true
router.get('/:id', getPriceById);

// Admin routes (protected - you may want to add auth middleware)
router.post('/', addPrice);
router.put('/:id', updatePrice);
router.delete('/:id', deletePrice);

console.log('🛣️ PriceRoutes: All routes configured');

module.exports = router;