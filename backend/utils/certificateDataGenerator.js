/**
 * Unified Certificate Data Generator
 * Ensures consistent certificate data across all platforms (admin view, PDF generation, user downloads)
 */

class CertificateDataGenerator {
  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  /**
   * Generate standardized certificate data from application and user data
   * @param {Object} application - License application data from database
   * @param {Object} user - User data from database
   * @returns {Object} Standardized certificate data
   */
  generateCertificateData(application, user) {
    // Generate license number if not present
    const licenseNumber = application.license_number ||
      `PMB/ML/${this.currentYear}/${application.application_number}`;

    // Calculate validity dates
    const commencementDate = application.approved_date ?
      new Date(application.approved_date) : new Date();
    const expiryDate = new Date(commencementDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Format dates consistently
    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    return {
      // License identification
      licenseNumber: licenseNumber,
      applicationId: application.id,
      applicationNumber: application.application_number,

      // Holder information
      holderName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      holderAddress: user.address || 'Address not available',
      holderEmail: user.email || '',
      holderPhone: user.phone || '',

      // Business information
      businessName: user.business_name || 'N/A',
      businessType: user.business_type || 'N/A',
      businessLocation: user.mill_location || user.address || 'Location not available',
      millCapacity: user.mill_capacity ? `${user.mill_capacity} MT` : 'N/A',

      // Location details
      city: user.city || '',
      district: user.district || '',
      postalCode: user.postal_code || '',

      // Validity period
      commencementDate: formatDate(commencementDate),
      expiryDate: formatDate(expiryDate),
      issueDate: formatDate(commencementDate),

      // Administrative details
      issuingOfficer: 'Director General, Paddy Marketing Board',
      issuedBy: 'Paddy Marketing Board',
      issuedAt: 'Colombo 02',
      officeAddress: 'Sir Chittampalam A. Gardiner Mawatha, Housing Secretariat Building, 6th Floor',

      // Status and dates
      status: application.status,
      submittedDate: application.created_at,
      approvedDate: application.approved_date,

      // Additional metadata for PDF generation
      pdfMetadata: {
        permitFee: '5,000.00',
        nic: user.nic || 'N/A',
        applicationDate: formatDate(new Date(application.created_at)),
        receiptNumber: application.application_number
      }
    };
  }

  /**
   * Generate certificate data specifically formatted for PDF generation
   * @param {Object} certificateData - Standardized certificate data
   * @returns {Object} PDF-specific formatted data
   */
  formatForPDF(certificateData) {
    return {
      licenseNumber: certificateData.licenseNumber,
      firstName: certificateData.holderName.split(' ')[0] || '',
      lastName: certificateData.holderName.split(' ').slice(1).join(' ') || '',
      nic: certificateData.pdfMetadata.nic,
      address: certificateData.holderAddress,
      city: certificateData.city,
      district: certificateData.district,
      millLocation: certificateData.businessLocation,
      millCapacity: certificateData.millCapacity.replace(' MT', ''), // Remove MT for PDF formatting
      applicationNumber: certificateData.applicationNumber,
      applicationDate: certificateData.pdfMetadata.applicationDate
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
      if (!certificateData[field] || certificateData[field] === 'N/A' || certificateData[field] === 'Address not available') {
        errors.push(`Missing or invalid: ${field}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

module.exports = CertificateDataGenerator;