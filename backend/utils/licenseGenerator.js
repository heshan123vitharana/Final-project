const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a mill license using the template with mill details
 * @param {Object} licenseData - License and mill information
 * @returns {Promise<Buffer>} - Generated license as PDF buffer
 */
async function generateLicense(licenseData) {
  try {
    console.log('📄 Starting license generation for:', licenseData.licenseNumber);

    // Load the license template
    const templatePath = path.join(__dirname, '../../MillLicense.jpeg');
    console.log('📂 Loading template from:', templatePath);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found at: ${templatePath}`);
    }

    console.log('✅ Template found successfully');

    // Calculate validity dates (1 year from approval)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Format dates
    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    // Create PDF with the license template and data
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Convert PDF to buffer
    const pdfBuffers = [];
    doc.on('data', pdfBuffers.push.bind(pdfBuffers));

    const pdfPromise = new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(pdfBuffers);
        resolve(pdfBuffer);
      });
    });

    // Add the license template as background
    doc.image(templatePath, 0, 0, {
      fit: [595, 842], // A4 size in points
      align: 'center',
      valign: 'top'
    });

    // Add text fields over the template with precise positioning based on the design
    doc.fillColor('black');

    // Permit Number (PMB field) - positioned in the yellow box on the right
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text(licenseData.licenseNumber, 630, 374, { width: 140, align: 'left' });

    // Reset to normal font for other fields
    doc.fontSize(11).font('Helvetica');

    // 1. Name of the permit holder - after the dotted line
    doc.text(`${licenseData.firstName} ${licenseData.lastName}`, 450, 415, { width: 300, align: 'left' });

    // 2. Address of the permit holder - after the dotted line
    doc.text(`${licenseData.address}, ${licenseData.city}, ${licenseData.district}`, 450, 440, { width: 300, align: 'left' });

    // 3. N.I.C. No. of the permit holder - after the dotted line
    doc.text(licenseData.nic || 'N/A', 450, 467, { width: 200, align: 'left' });

    // 4. Address of the Location(s) where stockpiling of paddy carried on - second line
    doc.text(licenseData.millLocation || `${licenseData.address}, ${licenseData.city}`, 100, 525, { width: 400, align: 'left' });

    // 5. Storage Capacity - after the dotted line
    doc.text(`${licenseData.millCapacity || 'N/A'} MT`, 450, 559, { width: 200, align: 'left' });

    // 6. Permit fee (Rs.) - after the dotted line
    doc.text('5,000.00', 450, 590, { width: 200, align: 'left' });

    // 7a. Starting Date - after the dotted line
    doc.text(formatDate(startDate), 450, 655, { width: 200, align: 'left' });

    // 7b. Ending Date - after the dotted line
    doc.text(formatDate(endDate), 450, 689, { width: 200, align: 'left' });

    // Fill in the paragraph section - application date and receipt number
    const applicationDate = formatDate(new Date(licenseData.applicationDate));
    const receiptNo = licenseData.applicationNumber;

    // Insert dates in the paragraph (around line 755)
    doc.fontSize(10);
    doc.text(applicationDate, 520, 755, { width: 100, align: 'left' });
    doc.text(receiptNo, 200, 775, { width: 150, align: 'left' });

    // Date at bottom left (issued date)
    doc.fontSize(11);
    doc.text(formatDate(startDate), 100, 945, { width: 200, align: 'left' });

    console.log('✅ License data added to template');

    // Finalize the PDF
    doc.end();

    const pdfBuffer = await pdfPromise;
    console.log('✅ PDF license generated successfully');

    return pdfBuffer;

  } catch (error) {
    console.error('❌ Error generating license:', error);
    throw error;
  }
}

/**
 * Save generated license to database
 * @param {number} applicationId - License application ID
 * @param {Buffer} licenseBuffer - Generated license PDF buffer
 * @param {Object} pool - Database connection pool
 */
async function saveLicenseToDatabase(applicationId, licenseBuffer, pool) {
  try {
    console.log('💾 Saving license to database for application:', applicationId);

    // Convert buffer to base64 for storage
    const licenseBase64 = licenseBuffer.toString('base64');

    // Update the license application with the generated license
    await pool.execute(`
      UPDATE mill_licenses
      SET generated_license = ?
      WHERE id = ?
    `, [licenseBase64, applicationId]);

    console.log('✅ License saved to database successfully');

  } catch (error) {
    console.error('❌ Error saving license to database:', error);
    throw error;
  }
}

module.exports = {
  generateLicense,
  saveLicenseToDatabase
};