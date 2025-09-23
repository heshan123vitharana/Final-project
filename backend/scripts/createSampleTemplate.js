// backend/scripts/createSampleTemplate.js
const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

async function createSampleTemplate() {
    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#2d5016';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Header background
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(50, 50, canvas.width - 100, 100);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MILL LICENSE CERTIFICATE', canvas.width / 2, 110);

    // Subtitle
    ctx.fillStyle = '#2d5016';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Government of Sri Lanka', canvas.width / 2, 180);
    ctx.fillText('Department of Agriculture', canvas.width / 2, 210);

    // Certificate content area placeholders
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(100, 250, canvas.width - 200, 300);

    // Footer
    ctx.fillStyle = '#6c757d';
    ctx.font = '16px Arial';
    ctx.fillText('This certificate is valid and authentic', canvas.width / 2, 700);

    // Signature areas
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 600, 200, 50);
    ctx.strokeRect(850, 600, 200, 50);

    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.fillText('Authorized Signature', 250, 670);
    ctx.fillText('Official Seal', 950, 670);

    // Save template
    const templatePath = path.join(__dirname, '../assets/templates/MillLicense.jpeg');
    const buffer = canvas.toBuffer('image/jpeg');
    await fs.writeFile(templatePath, buffer);
    
    console.log('✅ Sample certificate template created:', templatePath);
}

createSampleTemplate().catch(console.error);