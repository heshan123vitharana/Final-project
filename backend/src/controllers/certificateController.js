// backend/controllers/certificateController.js
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs').promises;
const path = require('path');
const pool = require('../config/database');

/**
 * Certificate template configuration
 */
const CERTIFICATE_CONFIG = {
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

/**
 * Generate mill license certificate
 */
const generateMillLicenseCertificate = async (req, res) => {
    try {
        const { licenseApplicationId } = req.params;
        
        console.log('🏆 Generating certificate for license application:', licenseApplicationId);

        // Get license application details
        const [applications] = await pool.execute(`
            SELECT 
                ml.*,
                u.first_name,
                u.last_name,
                u.business_name,
                u.mill_district,
                u.email,
                u.phone
            FROM mill_licenses ml
            JOIN users u ON ml.user_id = u.id
            WHERE ml.id = ? AND ml.status = 'approved'
        `, [licenseApplicationId]);

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'License application not found or not approved'
            });
        }

        const license = applications[0];

        // Generate unique license number if not exists
        let licenseNumber = license.license_number;
        if (!licenseNumber) {
            licenseNumber = await generateLicenseNumber(license.mill_district, license.id);
            
            // Update the license record with the generated number
            await pool.execute(
                'UPDATE mill_licenses SET license_number = ? WHERE id = ?',
                [licenseNumber, licenseApplicationId]
            );
        }

        // Create certificate
        const certificateBuffer = await createCertificateImage({
            millName: license.business_name,
            ownerName: `${license.first_name} ${license.last_name}`,
            licenseNumber: licenseNumber,
            millDistrict: license.mill_district,
            issueDate: new Date(license.approved_date).toLocaleDateString('en-LK'),
            validUntil: calculateValidUntilDate(license.approved_date),
            applicationId: licenseApplicationId
        });

        // Save certificate file
        const certificateFileName = `mill_license_${licenseNumber.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        const certificatePath = path.join(__dirname, '../generated/certificates', certificateFileName);
        
        // Ensure directory exists
        await fs.mkdir(path.dirname(certificatePath), { recursive: true });
        await fs.writeFile(certificatePath, certificateBuffer);

        // Update database with certificate path
        await pool.execute(
            'UPDATE mill_licenses SET certificate_path = ?, certificate_generated_at = NOW() WHERE id = ?',
            [certificateFileName, licenseApplicationId]
        );

        console.log('✅ Certificate generated successfully:', certificateFileName);

        // Set response headers for file download
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${certificateFileName}"`);
        res.setHeader('Content-Length', certificateBuffer.length);

        // Send the certificate file
        res.send(certificateBuffer);

    } catch (error) {
        console.error('❌ Certificate generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate certificate',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Create certificate image with data overlay
 */
const createCertificateImage = async (certificateData) => {
    try {
        const canvas = createCanvas(CERTIFICATE_CONFIG.template.width, CERTIFICATE_CONFIG.template.height);
        const ctx = canvas.getContext('2d');

        // Load template image
        let templateImage;
        try {
            templateImage = await loadImage(CERTIFICATE_CONFIG.template.templatePath);
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

        // Draw certificate content
        const config = CERTIFICATE_CONFIG;
        
        drawText(
            `This certifies that "${certificateData.millName}"`,
            config.positions.millName,
            config.fonts.header
        );
        
        drawText(
            `Owned by: ${certificateData.ownerName}`,
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
            `Valid Until: ${certificateData.validUntil}`,
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

        // Add QR code placeholder (you can integrate a QR code library)
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
        throw new Error(`Certificate image creation failed: ${error.message}`);
    }
};

/**
 * Generate unique license number
 */
const generateLicenseNumber = async (district, applicationId) => {
    const year = new Date().getFullYear();
    const districtCode = district ? district.substring(0, 3).toUpperCase() : 'GEN';
    const paddedId = applicationId.toString().padStart(4, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    return `ML-${year}-${districtCode}-${paddedId}-${randomSuffix}`;
};

/**
 * Calculate certificate validity period (e.g., 5 years from issue date)
 */
const calculateValidUntilDate = (issueDate) => {
    const validDate = new Date(issueDate);
    validDate.setFullYear(validDate.getFullYear() + 5);
    return validDate.toLocaleDateString('en-LK');
};

/**
 * Get certificate by license ID
 */
const getCertificate = async (req, res) => {
    try {
        const { licenseId } = req.params;
        
        const [licenses] = await pool.execute(
            'SELECT * FROM mill_licenses WHERE id = ? AND status = "approved" AND certificate_path IS NOT NULL',
            [licenseId]
        );
        
        if (licenses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }
        
        const license = licenses[0];
        const certificatePath = path.join(__dirname, '../generated/certificates', license.certificate_path);
        
        try {
            const certificateBuffer = await fs.readFile(certificatePath);
            
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `inline; filename="${license.certificate_path}"`);
            res.send(certificateBuffer);
            
        } catch (fileError) {
            // Certificate file not found, regenerate it
            console.log('Certificate file not found, regenerating...');
            return generateMillLicenseCertificate(req, res);
        }
        
    } catch (error) {
        console.error('Error retrieving certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve certificate',
            error: error.message
        });
    }
};

module.exports = {
    generateMillLicenseCertificate,
    getCertificate,
    createCertificateImage
};