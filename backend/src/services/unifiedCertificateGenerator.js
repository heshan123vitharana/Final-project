/**
 * Unified Certificate Generation System
 * Ensures consistent certificate data and generation across all platforms
 * - Admin dashboard certificates
 * - User-downloaded certificates
 * - PDF license generation
 * - Canvas-based image certificates
 */

const PDFDocument = require('pdfkit');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

class UnifiedCertificateGenerator {
  constructor() {
    this.currentYear = new Date().getFullYear();
    this.certificateConfig = {
      template: {
        width: 1200,
        height: 800,
        templatePath: path.join(__dirname, '../assets/templates/MillLicense.jpeg')
      },
      fonts: {
        title: { family: 'Arial', size: 24, weight: 'bold', color: '#2d5016' },
        header: { family: 'Arial', size: 18, weight: 'bold', color: '#1a365d' },
        body: { family: 'Arial', size: 16, weight: 'normal', color: '#2d3748' },
        footer: { family: 'Arial', size: 12, weight: 'normal', color: '#718096' }
      },
      positions: {
        millName: { x: 600, y: 200, align: 'center' },
        ownerName: { x: 600, y: 280, align: 'center' },
        licenseNumber: { x: 600, y: 360, align: 'center' },
        millDistrict: { x: 600, y: 440, align: 'center' },
        issueDate: { x: 600, y: 520, align: 'center' },
        validUntil: { x: 600, y: 580, align: 'center' },
        authoritySignature: { x: 200, y: 700, align: 'center' },
        officialSeal: { x: 1000, y: 700, align: 'center' }
      }
    };
  }

  /**
   * Generate standardized certificate data from application and user data
   * @param {Object} application - License application data from database
   * @param {Object} user - User data from database
   * @returns {Object} Standardized certificate data
   */
  generateStandardizedCertificateData(application, user) {
    // Generate license number if not present using consistent format
    const licenseNumber = application.license_number ||
      `PMB/ML/${this.currentYear}/${application.application_number}`;

    // Calculate validity dates consistently
    const commencementDate = application.approved_date ?
      new Date(application.approved_date) : new Date();
    const expiryDate = new Date(commencementDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Standardized date formatting function
    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    // Standardized address formatting
    const formatAddress = (user) => {
      const addressParts = [
        user.address,
        user.city,
        user.district,
        user.postal_code
      ].filter(part => part && part.toString().trim() !== '');

      return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
    };

    // Return unified certificate data structure
    return {
      // License identification
      licenseNumber: licenseNumber,
      applicationId: application.id,
      applicationNumber: application.application_number,

      // Holder information (standardized)
      holderName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      holderAddress: formatAddress(user),
      holderEmail: user.email || '',
      holderPhone: user.phone || '',
      holderNIC: user.nic || '',

      // Business information (standardized)
      businessName: user.business_name || 'N/A',
      businessType: user.business_type || 'N/A',
      businessLocation: user.mill_location || formatAddress(user),
      millCapacity: user.mill_capacity ? `${user.mill_capacity} MT` : 'N/A',

      // Location details (standardized)
      city: user.city || '',
      district: user.district || '',
      millDistrict: user.mill_district || user.district || '',
      postalCode: user.postal_code || '',

      // Validity period (standardized)
      commencementDate: formatDate(commencementDate),
      expiryDate: formatDate(expiryDate),
      issueDate: formatDate(commencementDate),

      // Administrative details (standardized)
      issuingOfficer: 'Director General, Paddy Marketing Board',
      issuedBy: 'Paddy Marketing Board',
      issuedAt: 'Colombo 02',
      officeAddress: 'Sir Chittampalam A. Gardiner Mawatha, Housing Secretariat Building, 6th Floor',

      // Status and dates (standardized)
      status: application.status,
      submittedDate: application.created_at,
      approvedDate: application.approved_date,

      // PDF generation specific data
      pdfData: {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        nic: user.nic || '',
        address: formatAddress(user),
        millLocation: user.mill_location || formatAddress(user),
        millCapacity: user.mill_capacity || '',
        applicationDate: formatDate(new Date(application.created_at)),
        receiptNumber: application.application_number,
        permitFee: '5,000.00'
      }
    };
  }

  /**
   * Validate certificate data completeness
   * @param {Object} certificateData - Certificate data to validate
   * @returns {Object} Validation result with errors array
   */
  validateCertificateData(certificateData) {
    const errors = [];
    const required = [
      'licenseNumber', 'holderName', 'holderAddress',
      'businessName', 'businessLocation', 'commencementDate', 'expiryDate'
    ];

    required.forEach(field => {
      if (!certificateData[field] ||
          certificateData[field] === 'N/A' ||
          certificateData[field] === 'Address not available') {
        errors.push(`Missing or invalid: ${field}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Generate text-based certificate content for downloads
   * @param {Object} certificateData - Standardized certificate data
   * @returns {String} Formatted certificate text
   */
  generateTextCertificate(certificateData) {
    return `
GOVERNMENT OF SRI LANKA
PADDY MARKETING BOARD

LICENSE TO OPERATE RICE MILL

License issued under Section 10 of the Paddy Marketing Board Act No. 14 of 1971

License Number: ${certificateData.licenseNumber}

1. Name of the License Holder: ${certificateData.holderName}
2. Address of the License Holder: ${certificateData.holderAddress}
3. Name of the Business and Business Location: ${certificateData.businessName}, ${certificateData.businessLocation}
4. Capacity of the Milling Machine/Mill: ${certificateData.millCapacity}
5. Validity Period of the License:
   (a) Commencement Date: ${certificateData.commencementDate}
   (b) Expiry Date: ${certificateData.expiryDate}

This license is issued to the above-mentioned license holder by the Paddy Marketing Board to operate a business of milling, parboiling, or processing rice at the aforementioned business location, following the consideration of the application submitted by the license holder. This license is subject to the specific conditions stipulated herein.

CONDITIONS:
1. This license is non-transferable and must be displayed prominently at the business premises.
2. The license holder must comply with all regulations under the Paddy Marketing Board Act.
3. Regular inspections may be conducted by authorized officers of the PMB.
4. Any changes to the business location or capacity must be reported immediately.
5. This license must be renewed annually before the expiry date.

Issued by the Paddy Marketing Board.

Date: ${certificateData.issueDate}
Place: ${certificateData.issuedAt}
Address: ${certificateData.officeAddress}

${certificateData.issuingOfficer}
Issuing Officer
PMB

This is an official government document. Any unauthorized reproduction is strictly prohibited.
`;
  }

  /**
   * Generate PDF license using template with standardized data
   * @param {Object} certificateData - Standardized certificate data
   * @returns {Promise<Buffer>} - Generated license as PDF buffer
   */
  async generatePDFLicense(certificateData) {
    try {
      console.log('📄 Starting unified PDF license generation for:', certificateData.licenseNumber);

      // Load the license template
      const templatePath = path.join(__dirname, '../../MillLicense.jpeg');
      console.log('📂 Loading template from:', templatePath);

      const templateExists = await fs.access(templatePath).then(() => true).catch(() => false);
      if (!templateExists) {
        throw new Error(`Template not found at: ${templatePath}`);
      }

      console.log('✅ Template found successfully');

      // Calculate validity dates
      const startDate = new Date(certificateData.commencementDate.split('/').reverse().join('-'));
      const endDate = new Date(certificateData.expiryDate.split('/').reverse().join('-'));

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

      // Add text fields over the template with precise positioning
      doc.fillColor('black');

      // License Number
      doc.fontSize(14).font('Helvetica-Bold');
      doc.text(certificateData.licenseNumber, 630, 374, { width: 140, align: 'left' });

      // Reset to normal font for other fields
      doc.fontSize(11).font('Helvetica');

      // Use PDF-specific data for precise formatting
      const pdfData = certificateData.pdfData;

      // 1. Name of the permit holder
      doc.text(`${pdfData.firstName} ${pdfData.lastName}`, 450, 415, { width: 300, align: 'left' });

      // 2. Address of the permit holder
      doc.text(pdfData.address, 450, 440, { width: 300, align: 'left' });

      // 3. N.I.C. No. of the permit holder
      doc.text(pdfData.nic || 'N/A', 450, 467, { width: 200, align: 'left' });

      // 4. Address of the Location(s) where stockpiling of paddy carried on
      doc.text(pdfData.millLocation, 100, 525, { width: 400, align: 'left' });

      // 5. Storage Capacity
      doc.text(`${pdfData.millCapacity} MT`, 450, 559, { width: 200, align: 'left' });

      // 6. Permit fee (Rs.)
      doc.text(pdfData.permitFee, 450, 590, { width: 200, align: 'left' });

      // 7a. Starting Date
      doc.text(certificateData.commencementDate, 450, 655, { width: 200, align: 'left' });

      // 7b. Ending Date
      doc.text(certificateData.expiryDate, 450, 689, { width: 200, align: 'left' });

      // Fill in the paragraph section
      doc.fontSize(10);
      doc.text(pdfData.applicationDate, 520, 755, { width: 100, align: 'left' });
      doc.text(pdfData.receiptNumber, 200, 775, { width: 150, align: 'left' });

      // Date at bottom left (issued date)
      doc.fontSize(11);
      doc.text(certificateData.issueDate, 100, 945, { width: 200, align: 'left' });

      console.log('✅ Unified license data added to template');

      // Finalize the PDF
      doc.end();

      const pdfBuffer = await pdfPromise;
      console.log('✅ Unified PDF license generated successfully');

      return pdfBuffer;

    } catch (error) {
      console.error('❌ Error generating unified PDF license:', error);
      throw error;
    }
  }

  /**
   * Generate image-based certificate using Canvas
   * @param {Object} certificateData - Standardized certificate data
   * @returns {Promise<Buffer>} - Generated certificate as image buffer
   */
  async generateImageCertificate(certificateData) {
    try {
      const canvas = createCanvas(this.certificateConfig.template.width, this.certificateConfig.template.height);
      const ctx = canvas.getContext('2d');

      // Load template image
      let templateImage;
      try {
        templateImage = await loadImage(this.certificateConfig.template.templatePath);
      } catch (error) {
        // If template image not found, create a basic background
        console.warn('Template image not found, creating basic background');
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add border
        ctx.strokeStyle = '#2d5016';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        // Add title background
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(50, 50, canvas.width - 100, 80);

        // Add title text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('MILL LICENSE CERTIFICATE', canvas.width / 2, 100);
      }

      if (templateImage) {
        // Draw template image as background
        ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
      }

      // Add semi-transparent overlay for better text readability
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Helper function to draw text with specific styling
      const drawText = (text, position, fontConfig) => {
        ctx.font = `${fontConfig.weight} ${fontConfig.size}px ${fontConfig.family}`;
        ctx.fillStyle = fontConfig.color;
        ctx.textAlign = position.align;

        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillText(text, position.x, position.y);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      };

      // Draw certificate content using standardized data
      const config = this.certificateConfig;

      drawText(
        `This certifies that "${certificateData.businessName}"`,
        config.positions.millName,
        config.fonts.header
      );

      drawText(
        `Owned by: ${certificateData.holderName}`,
        config.positions.ownerName,
        config.fonts.body
      );

      drawText(
        `License Number: ${certificateData.licenseNumber}`,
        config.positions.licenseNumber,
        config.fonts.title
      );

      drawText(
        `District: ${certificateData.millDistrict}`,
        config.positions.millDistrict,
        config.fonts.body
      );

      drawText(
        `Issue Date: ${certificateData.issueDate}`,
        config.positions.issueDate,
        config.fonts.body
      );

      drawText(
        `Valid Until: ${certificateData.expiryDate}`,
        config.positions.validUntil,
        config.fonts.body
      );

      drawText(
        'Authorized Signature',
        config.positions.authoritySignature,
        config.fonts.footer
      );

      drawText(
        'Official Seal',
        config.positions.officialSeal,
        config.fonts.footer
      );

      // Add QR code placeholder
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 600, 100, 100);
      drawText('QR Code', { x: 100, y: 720, align: 'center' }, config.fonts.footer);

      // Add application ID as reference
      drawText(
        `Ref: APP-${certificateData.applicationId}`,
        { x: canvas.width - 50, y: canvas.height - 20, align: 'right' },
        config.fonts.footer
      );

      return canvas.toBuffer('image/png');

    } catch (error) {
      throw new Error(`Unified certificate image creation failed: ${error.message}`);
    }
  }

  /**
   * Save generated license to database
   * @param {number} applicationId - License application ID
   * @param {Buffer} licenseBuffer - Generated license buffer
   * @param {Object} pool - Database connection pool
   */
  async saveLicenseToDatabase(applicationId, licenseBuffer, pool) {
    try {
      console.log('💾 Saving unified license to database for application:', applicationId);

      // Convert buffer to base64 for storage
      const licenseBase64 = licenseBuffer.toString('base64');

      // Update the license application with the generated license
      await pool.execute(`
        UPDATE mill_licenses
        SET generated_license = ?
        WHERE id = ?
      `, [licenseBase64, applicationId]);

      console.log('✅ Unified license saved to database successfully');

    } catch (error) {
      console.error('❌ Error saving unified license to database:', error);
      throw error;
    }
  }

  /**
   * Generate unique license number with consistent format
   * @param {string} district - District name
   * @param {number} applicationId - Application ID
   * @returns {string} Generated license number
   */
  generateLicenseNumber(district, applicationId) {
    const year = new Date().getFullYear();
    const districtCode = district ? district.substring(0, 3).toUpperCase() : 'GEN';
    const paddedId = applicationId.toString().padStart(4, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();

    return `PMB/ML/${year}/${districtCode}-${paddedId}-${randomSuffix}`;
  }
}

module.exports = UnifiedCertificateGenerator;