const express = require('express');
const { subscribeNewsletter, getAllSubscribers, unsubscribe } = require('../controllers/newsletterController');

const router = express.Router();

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribe);
router.get('/unsubscribe', unsubscribe); // Support GET for email links

// Admin routes (you can add auth middleware later)
router.get('/subscribers', getAllSubscribers);

module.exports = router;
