const nodemailer = require('nodemailer');

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

const CONTACT_RECIPIENT = process.env.CONTACT_RECIPIENT || 'vitharana8000@gmail.com';

const submitContactMessage = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message,
        } = req.body || {};

        const errors = [];

        const cleanedName = sanitize(name);
        const cleanedEmail = sanitize(email).toLowerCase();
        const cleanedSubject = sanitize(subject, 'General Inquiry');
        const cleanedMessage = sanitize(message);
        const cleanedPhone = sanitize(phone, 'Not provided');

        if (!cleanedName) {
            errors.push('name');
        }

        if (!cleanedEmail || !validateEmail(cleanedEmail)) {
            errors.push('email');
        }

        if (!cleanedSubject) {
            errors.push('subject');
        }

        if (!cleanedMessage) {
            errors.push('message');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Please fill in all required fields with valid information.',
                fields: errors,
            });
        }

        if (!CONTACT_RECIPIENT) {
            console.error('Contact recipient email is not configured.');
            return res.status(500).json({ message: 'Contact recipient not configured.' });
        }

        const transporter = await getTransporter();

        const limitedMessage = cleanedMessage.slice(0, 4000);
        const limitedSubject = cleanedSubject.slice(0, 120) || 'General Inquiry';

        const mailSubject = `PMB Contact Form: ${limitedSubject}`;
        const submittedAt = new Date().toLocaleString('en-GB', {
            timeZone: 'Asia/Colombo',
            dateStyle: 'full',
            timeStyle: 'short',
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@paddymarketingboard.lk',
            to: CONTACT_RECIPIENT,
            replyTo: cleanedEmail,
            subject: mailSubject,
            text: [
                `New contact form submission received.`,
                '',
                `Name: ${cleanedName}`,
                `Email: ${cleanedEmail}`,
                `Phone: ${cleanedPhone}`,
                `Subject: ${limitedSubject}`,
                '',
                'Message:',
                limitedMessage,
                '',
                `Submitted at: ${submittedAt}`,
            ].join('\n'),
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <h2 style="color: #047857; margin-top: 0;">New Contact Form Submission</h2>
                    <p style="margin: 0 0 16px 0; color: #374151;">
                        A new message has been submitted through the Paddy Marketing Board website.
                    </p>
                    <div style="background: #ffffff; border-radius: 10px; padding: 16px; border: 1px solid #d1d5db;">
                        <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${cleanedName}</p>
                        <p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${cleanedEmail}">${cleanedEmail}</a></p>
                        <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${cleanedPhone}</p>
                        <p style="margin: 0 0 16px 0;"><strong>Subject:</strong> ${limitedSubject}</p>
                        <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
                        <div style="white-space: pre-wrap; background: #f3f4f6; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb; color: #111827;">
                            ${limitedMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                        </div>
                    </div>
                    <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 12px;">
                        Submitted on ${submittedAt}
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.info(`Contact email preview available at: ${previewUrl}`);
        }

        return res.status(200).json({
            message: 'Message delivered successfully.',
        });
    } catch (error) {
        console.error('Failed to send contact message:', error);
        return res.status(500).json({
            message: 'Failed to send message. Please try again later.',
        });
    }
};

module.exports = {
    submitContactMessage,
};
