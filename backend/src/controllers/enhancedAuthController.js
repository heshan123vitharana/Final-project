// backend/controllers/authController.js - Enhanced version
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/database');

/**
 * Generate a secure temporary password
 */
const generateTemporaryPassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
    
    // Fill remaining length
    for (let i = 4; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Configure email transporter (configure with your SMTP settings)
 */
const createEmailTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

/**
 * Send temporary password email
 */
const sendTemporaryPasswordEmail = async (userEmail, userName, tempPassword) => {
    try {
        const transporter = createEmailTransporter();
        
        const mailOptions = {
            from: process.env.FROM_EMAIL || 'noreply@paddymanagement.lk',
            to: userEmail,
            subject: 'Your Temporary Password - Paddy Management System',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2d5016;">Welcome to Paddy Management System</h2>
                    <p>Dear ${userName},</p>
                    <p>Your account has been successfully created. Here are your login credentials:</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Email:</strong> ${userEmail}</p>
                        <p><strong>Temporary Password:</strong> <code style="background-color: #e9ecef; padding: 4px 8px; border-radius: 3px; font-size: 16px;">${tempPassword}</code></p>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
                        <p style="margin: 0;"><strong>⚠️ Important Security Notice:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>This is a temporary password that expires in 24 hours</li>
                            <li>Please log in and change your password immediately</li>
                            <li>Do not share this password with anyone</li>
                            <li>For security, this email will be automatically deleted from our system</li>
                        </ul>
                    </div>
                    
                    <p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                           style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Login Now
                        </a>
                    </p>
                    
                    <p style="color: #6c757d; font-size: 12px; margin-top: 30px;">
                        If you didn't request this account, please ignore this email or contact support.
                    </p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('✅ Temporary password email sent to:', userEmail);
        return true;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return false;
    }
};

/**
 * Enhanced user registration with automatic password generation
 */
const registerUser = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            business_name,
            business_type,
            phone,
            email,
            nic,
            address,
            city,
            district,
            mill_district
        } = req.body;

        console.log('👤 New user registration request:', { email, first_name, last_name, business_name });

        // Validate required fields
        const requiredFields = ['first_name', 'last_name', 'business_name', 'business_type', 'phone', 'email'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if user already exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Validate mill_district if provided
        if (mill_district) {
            const [validDistricts] = await pool.execute(
                'SELECT name FROM sri_lanka_districts WHERE name = ?',
                [mill_district]
            );

            if (validDistricts.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid mill district selected'
                });
            }
        }

        // Generate temporary password
        const temporaryPassword = generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

        // Insert user with hashed temporary password
        const [userResult] = await pool.execute(`
            INSERT INTO users (
                first_name, last_name, business_name, business_type, phone, email, password,
                nic, address, city, district, mill_district, registration_date,
                password_change_required, password_expires_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 1, DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW())
        `, [
            first_name, last_name, business_name, business_type, phone, email, hashedPassword,
            nic || null, address || null, city || null, district || null, mill_district || null
        ]);

        const userId = userResult.insertId;

        // Send temporary password email
        const emailSent = await sendTemporaryPasswordEmail(
            email, 
            `${first_name} ${last_name}`, 
            temporaryPassword
        );

        // Log the registration
        console.log(`✅ User registered successfully: ID ${userId}, Email: ${email}`);

        // Response (don't include the password in response)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: userId,
                email,
                first_name,
                last_name,
                business_name,
                business_type,
                registration_date: new Date().toISOString().split('T')[0]
            },
            temporaryPasswordSent: emailSent,
            nextStep: emailSent ? 
                'Check your email for temporary password and login to change it' :
                'Contact administrator for login credentials'
        });

    } catch (error) {
        console.error('❌ User registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Password change endpoint (for first-time login)
 */
const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword, confirmPassword } = req.body;

        // Validate inputs
        if (!userId || !currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match'
            });
        }

        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
            });
        }

        // Get user
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password and remove temporary password flags
        await pool.execute(`
            UPDATE users 
            SET password = ?, 
                password_change_required = 0, 
                password_expires_at = NULL,
                password_changed_at = NOW()
            WHERE id = ?
        `, [hashedNewPassword, userId]);

        console.log(`✅ Password changed successfully for user ID: ${userId}`);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('❌ Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    registerUser,
    changePassword,
    generateTemporaryPassword,
    sendTemporaryPasswordEmail
};