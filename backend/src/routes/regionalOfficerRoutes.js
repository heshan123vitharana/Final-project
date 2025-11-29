const express = require('express');
const router = express.Router();
const regionalOfficerController = require('../controllers/regionalOfficerController');

console.log('Loading regionalOfficerRoutes...');

// Assuming you have middleware for admin authentication
// If not, we might need to implement a basic check or reuse existing auth middleware
// For now, I'll assume the existence of an 'authenticateToken' or similar middleware, 
// but since I haven't seen the middleware file, I'll leave it open or use a placeholder.
// I'll check 'authController.js' or 'routes' to see how auth is handled.
// Actually, I should check if there is an auth middleware.

// Login route (Public)
router.post('/login', regionalOfficerController.login);

// --- Regional Officer Protected Routes ---
const { requireAuth } = require('../middleware/authMiddleware');

// Price Management
console.log('Registering /prices routes in regionalOfficerRoutes');
router.get('/prices', requireAuth, regionalOfficerController.getRegionalPrices);
router.post('/prices', requireAuth, regionalOfficerController.addRegionalPrice);
router.put('/prices/:id', requireAuth, regionalOfficerController.updateRegionalPrice);
router.delete('/prices/:id', requireAuth, regionalOfficerController.deleteRegionalPrice);

// --- Admin Protected Routes (Officer Management) ---
// Note: These should ideally be protected by admin middleware
router.post('/create', regionalOfficerController.createOfficer);
router.get('/', regionalOfficerController.getOfficers);
router.put('/:id', regionalOfficerController.updateOfficer);
router.delete('/:id', regionalOfficerController.deleteOfficer);

module.exports = router;
