const express = require('express');
const router = express.Router();

const priceController = require('../controllers/priceController');
const {
  getAllPrices,
  getPriceById,
  addPrice,
  updatePrice,
  deletePrice
} = priceController;

// Public routes (for frontend display)
router.get('/', getAllPrices); // Now handles statistics via query param ?stats=true
router.get('/:id', getPriceById);

// Admin routes (protected - you may want to add auth middleware)
router.post('/', addPrice);
router.put('/:id', updatePrice);
router.delete('/:id', deletePrice);

module.exports = router;