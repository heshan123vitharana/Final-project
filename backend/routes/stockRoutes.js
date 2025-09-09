// routes/stockRoutes.js

import express from 'express';
import {
	addStock,
	getStockEntries,
	getStockSummary,
	getStockStats,
	deleteStock
} from '../controllers/stockController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(requireAuth);
router.post('/', addStock);
router.get('/entries', getStockEntries);
router.get('/summary', getStockSummary);
router.get('/stats', getStockStats);
router.delete('/:id', deleteStock);

export default router;