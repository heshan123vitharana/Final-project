import express from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', requireAuth, authController.getProfile);
router.post('/logout', requireAuth, authController.logout);

export default router;
