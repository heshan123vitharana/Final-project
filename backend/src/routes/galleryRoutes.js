const express = require('express');
const router = express.Router();
const {
  upload,
  getAllImages,
  getImageById,
  addImage,
  updateImage,
  deleteImage
} = require('../controllers/galleryController');

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