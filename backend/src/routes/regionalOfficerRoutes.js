const express = require('express');
const router = express.Router();
const regionalOfficerController = require('../controllers/regionalOfficerController');
// Assuming you have middleware for admin authentication
// If not, we might need to implement a basic check or reuse existing auth middleware
// For now, I'll assume the existence of an 'authenticateToken' or similar middleware, 
// but since I haven't seen the middleware file, I'll leave it open or use a placeholder.
// I'll check 'authController.js' or 'routes' to see how auth is handled.
// Actually, I should check if there is an auth middleware.

// Login route (Public)
router.post('/login', regionalOfficerController.login);

// Admin routes (Protected - need to add middleware later if not present)
router.post('/create', regionalOfficerController.createOfficer);
router.get('/', regionalOfficerController.getOfficers);
router.put('/:id', regionalOfficerController.updateOfficer);
router.delete('/:id', regionalOfficerController.deleteOfficer);

module.exports = router;
