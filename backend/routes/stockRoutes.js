// routes/stockRoutes.js
const express = require('express');
const router = express.Router();

console.log('Loading stock controller...');
const stockController = require('../controllers/stockController');
console.log('Stock controller loaded:', Object.keys(stockController));

const { requireAuth } = require('../middleware/authMiddleware');

// All stock routes require authentication
router.use(requireAuth);

// POST /api/stock - Add new stock entry
router.post('/', stockController.addStock);

// GET /api/stock/entries - Get all stock entries with optional filters
router.get('/entries', stockController.getStockEntries);

// GET /api/stock/summary - Get stock summary
router.get('/summary', stockController.getStockSummary);

// GET /api/stock/stats - Get stock statistics
router.get('/stats', stockController.getStockStats);

// DELETE /api/stock/:id - Delete stock entry
router.delete('/:id', stockController.deleteStock);

console.log('Exporting stock router with routes:', router.stack?.length || 'unknown');
module.exports = router;