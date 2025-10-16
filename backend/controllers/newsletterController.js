const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

let cachedTransporterPromise = null;

const createConfiguredTransporter = async () => {
    const hasSmtpConfig = Boolean(process.env.SMTP_HOST);
    const hasEmailAuth = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    const hasSmtpAuth = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

    if (hasSmtpConfig) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number.parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: hasSmtpAuth
                ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                }
                : undefined,
        });
    }

    if (hasEmailAuth) {
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    const testAccount = await nodemailer.createTestAccount();
    console.warn('Email credentials not configured. Using temporary Ethereal test account.');
    console.warn(`Test inbox: ${testAccount.user} / ${testAccount.pass}`);

    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

const getTransporter = () => {
    if (!cachedTransporterPromise) {
        cachedTransporterPromise = createConfiguredTransporter();
    }
    return cachedTransporterPromise;
};

const sanitize = (value, fallback = '') => {
    if (value === undefined || value === null) {
        return fallback;
    }
    const stringValue = String(value).trim();
    return stringValue || fallback;
};

const validateEmail = (value) => {
    if (!value) {
        return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(String(value).toLowerCase());
};

// Subscribe to newsletter
const subscribeNewsletter = async (req, res) => {
    try {
        const db = req.db;
        const { email, name } = req.body || {};

        const cleanedEmail = sanitize(email).toLowerCase();
        const cleanedName = sanitize(name, 'Subscriber');

        if (!cleanedEmail || !validateEmail(cleanedEmail)) {
            return res.status(400).json({
                message: 'Please provide a valid email address.',
            });
        }

        // Check if email already exists
        const [existing] = await db.execute(
            'SELECT * FROM newsletter_subscribers WHERE email = ?',
            [cleanedEmail]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'This email is already subscribed to our newsletter.',
            });
        }

        // Insert new subscriber
        await db.execute(
            'INSERT INTO newsletter_subscribers (email, name, subscribed_at) VALUES (?, ?, NOW())',
            [cleanedEmail, cleanedName]
        );

        // Read logo file as base64
        const logoPath = path.join(__dirname, '..', 'assets', 'pmb-logo.png');
        let logoBase64 = '';
        
        try {
            if (fs.existsSync(logoPath)) {
                const logoBuffer = fs.readFileSync(logoPath);
                logoBase64 = logoBuffer.toString('base64');
            }
        } catch (error) {
            console.warn('Logo file not found, sending email without logo');
        }

        // Send welcome email
        const transporter = await getTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@paddymarketingboard.lk',
            to: cleanedEmail,
            subject: 'Welcome to Paddy Marketing Board Newsletter! 🌾',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Arial', sans-serif;
                            background-color: #f3f4f6;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                            padding: 40px 20px;
                            text-align: center;
                        }
                        .logo {
                            max-width: 150px;
                            height: auto;
                            margin-bottom: 20px;
                        }
                        .header h1 {
                            color: #ffffff;
                            margin: 0;
                            font-size: 28px;
                            font-weight: bold;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .welcome-text {
                            color: #1f2937;
                            font-size: 18px;
                            line-height: 1.6;
                            margin-bottom: 20px;
                        }
                        .feature-box {
                            background-color: #f0fdf4;
                            border-left: 4px solid #10b981;
                            padding: 20px;
                            margin: 20px 0;
                            border-radius: 8px;
                        }
                        .feature-title {
                            color: #059669;
                            font-weight: bold;
                            font-size: 16px;
                            margin-bottom: 10px;
                        }
                        .feature-list {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                        }
                        .feature-list li {
                            color: #374151;
                            padding: 8px 0;
                            padding-left: 25px;
                            position: relative;
                        }
                        .feature-list li:before {
                            content: "✓";
                            position: absolute;
                            left: 0;
                            color: #10b981;
                            font-weight: bold;
                        }
                        .cta-button {
                            display: inline-block;
                            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                            color: #ffffff;
                            padding: 15px 30px;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: bold;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .footer {
                            background-color: #1f2937;
                            color: #9ca3af;
                            padding: 30px;
                            text-align: center;
                            font-size: 14px;
                        }
                        .footer a {
                            color: #10b981;
                            text-decoration: none;
                        }
                        .social-icons {
                            margin: 20px 0;
                        }
                        .social-icons a {
                            display: inline-block;
                            margin: 0 10px;
                            color: #10b981;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <!-- Header with Logo -->
                        <div class="header">
                            ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Paddy Marketing Board Logo" class="logo">` : ''}
                            <h1>🌾 Welcome to PMB Newsletter!</h1>
                        </div>

                        <!-- Main Content -->
                        <div class="content">
                            <p class="welcome-text">
                                Dear ${cleanedName},
                            </p>
                            <p class="welcome-text">
                                Thank you for subscribing to the Paddy Marketing Board Sri Lanka newsletter! 
                                We're excited to have you as part of our community.
                            </p>

                            <!-- Features Box -->
                            <div class="feature-box">
                                <div class="feature-title">📬 What You'll Receive:</div>
                                <ul class="feature-list">
                                    <li>Latest paddy and rice price updates</li>
                                    <li>Government policies and schemes for farmers</li>
                                    <li>Agricultural news and innovations</li>
                                    <li>Seasonal farming tips and best practices</li>
                                    <li>Collection center updates and announcements</li>
                                    <li>Special programs and initiatives</li>
                                </ul>
                            </div>

                            <p class="welcome-text">
                                Stay informed about everything happening in Sri Lanka's rice industry. 
                                We're committed to supporting farmers and stakeholders with timely, relevant information.
                            </p>

                            <center>
                                <a href="http://localhost:3000" class="cta-button">Visit Our Website</a>
                            </center>

                            <p class="welcome-text" style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                                If you have any questions or feedback, feel free to reach out to us through our contact form.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div class="footer">
                            <div class="social-icons">
                                <a href="#">Facebook</a> | 
                                <a href="#">Twitter</a> | 
                                <a href="#">LinkedIn</a>
                            </div>
                            <p>
                                Paddy Marketing Board<br>
                                No. 148, Vauxhall Street, Colombo 02, Sri Lanka<br>
                                Tel: +94 11 2 326 061
                            </p>
                            <p style="margin-top: 20px; font-size: 12px;">
                                You're receiving this email because you subscribed to our newsletter.<br>
                                <a href="http://localhost:3000/unsubscribe?email=${encodeURIComponent(cleanedEmail)}">Unsubscribe</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.info(`Newsletter welcome email preview: ${previewUrl}`);
        }

        return res.status(200).json({
            message: 'Successfully subscribed! Check your email for a welcome message.',
            email: cleanedEmail,
        });
    } catch (error) {
        console.error('Newsletter subscription failed:', error);
        return res.status(500).json({
            message: 'Failed to process subscription. Please try again later.',
        });
    }
};

// Get all subscribers (admin only)
const getAllSubscribers = async (req, res) => {
    try {
        const db = req.db;
        const [subscribers] = await db.execute(
            'SELECT id, email, name, subscribed_at, is_active FROM newsletter_subscribers ORDER BY subscribed_at DESC'
        );

        return res.status(200).json({
            message: 'Subscribers fetched successfully',
            count: subscribers.length,
            data: subscribers,
        });
    } catch (error) {
        console.error('Failed to fetch subscribers:', error);
        return res.status(500).json({
            message: 'Failed to fetch subscribers',
        });
    }
};

// Unsubscribe
const unsubscribe = async (req, res) => {
    try {
        const db = req.db;
        const { email } = req.query || req.body;

        const cleanedEmail = sanitize(email).toLowerCase();

        if (!cleanedEmail || !validateEmail(cleanedEmail)) {
            return res.status(400).json({
                message: 'Please provide a valid email address.',
            });
        }

        await db.execute(
            'UPDATE newsletter_subscribers SET is_active = 0 WHERE email = ?',
            [cleanedEmail]
        );

        return res.status(200).json({
            message: 'Successfully unsubscribed from newsletter.',
        });
    } catch (error) {
        console.error('Unsubscribe failed:', error);
        return res.status(500).json({
            message: 'Failed to unsubscribe. Please try again later.',
        });
    }
};

module.exports = {
    subscribeNewsletter,
    getAllSubscribers,
    unsubscribe,
};
