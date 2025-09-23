// utils/defaultProfilePhoto.js
const { createCanvas } = require('canvas');

/**
 * Generate a default profile photo (silhouette icon similar to Facebook)
 * @param {number} size - Size of the image (width and height)
 * @returns {Buffer} - PNG image buffer
 */
const generateDefaultProfilePhoto = (size = 200) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background circle with light gray color
  ctx.fillStyle = '#E4E6EA';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Person silhouette in darker gray
  ctx.fillStyle = '#BDC1C6';

  // Head (circle)
  const headRadius = size * 0.18;
  const headCenterY = size * 0.32;
  ctx.beginPath();
  ctx.arc(size / 2, headCenterY, headRadius, 0, 2 * Math.PI);
  ctx.fill();

  // Body (ellipse for shoulders)
  const bodyWidth = size * 0.5;
  const bodyHeight = size * 0.35;
  const bodyCenterY = size * 0.85;

  ctx.beginPath();
  ctx.ellipse(size / 2, bodyCenterY, bodyWidth / 2, bodyHeight / 2, 0, 0, 2 * Math.PI);
  ctx.fill();

  return canvas.toBuffer('image/png');
};

/**
 * Get base64 encoded default profile photo
 * @param {number} size - Size of the image
 * @returns {string} - Base64 encoded PNG image
 */
const getDefaultProfilePhotoBase64 = (size = 200) => {
  const buffer = generateDefaultProfilePhoto(size);
  return buffer.toString('base64');
};

module.exports = {
  generateDefaultProfilePhoto,
  getDefaultProfilePhotoBase64
};