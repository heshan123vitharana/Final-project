const express = require('express');
const router = express.Router();

const db = require('../config/database');
const {
  upload,
  getAllImages,
  getImageById,
  addImage,
  updateImage,
  deleteImage
} = require('../controllers/galleryController');

// Middleware to inject db connection as req.db
router.use((req, res, next) => {
  req.db = db;
  next();
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'Gallery routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Gallery CRUD routes
router.get('/', getAllImages);
router.get('/:id', getImageById);
router.post('/', upload.single('image'), addImage);
router.put('/:id', upload.single('image'), updateImage);
router.delete('/:id', deleteImage);

module.exports = router;