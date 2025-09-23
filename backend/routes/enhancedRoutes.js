// backend/routes/enhancedRoutes.js - Integration routes for all new features
const express = require('express');
const router = express.Router();

// Import enhanced controllers
const profileController = require('../controllers/profileController');
const enhancedPriceController = require('../controllers/enhancedPriceController');
const enhancedAuthController = require('../controllers/enhancedAuthController');
const certificateController = require('../controllers/certificateController');

// Profile and District Management Routes
router.get('/profile/districts', profileController.getValidDistricts);
router.get('/profile/completeness/:userId', async (req, res) => {
    try {
        const result = await profileController.calculateProfileCompleteness(req.params.userId);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Enhanced Price Management Routes
router.get('/prices/by-district-type', enhancedPriceController.getPricesByDistrictAndType);
router.get('/prices/paddy-types', enhancedPriceController.getPaddyTypesByDistrict);
router.post('/prices/validate', enhancedPriceController.validatePriceSelection);

// Enhanced Authentication Routes
router.post('/auth/register-enhanced', enhancedAuthController.registerUser);
router.post('/auth/change-password', enhancedAuthController.changePassword);

// Certificate Generation Routes
router.get('/certificates/generate/:licenseApplicationId', certificateController.generateMillLicenseCertificate);
router.get('/certificates/:licenseId', certificateController.getCertificate);

module.exports = router;