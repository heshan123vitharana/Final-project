// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');

const toEnumBusinessType = (value) => {
  if (!value) return null;
  const norm = String(value).trim().toLowerCase();
  if (norm === 'private') return 'private';
  // accept common misspellings like "goverment"
  if (['government', 'goverment', 'govt', 'gov'].includes(norm)) return 'government';
  return null;
};

const validateRegistration = (body) => {
  const errors = [];

  const required = [
    'first_name',
    'last_name',
    'business_name',
    'business_type',
    'phone',
    'email',
    'password',
    'confirm_password',
  ];

  required.forEach((f) => {
    if (!body[f] || String(body[f]).trim() === '') {
      errors.push(`${f} is required`);
    }
  });

  // business type
  const bt = toEnumBusinessType(body.business_type);
  if (!bt) errors.push('business_type must be "private" or "government"');

  // simple email check
  if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.push('email is invalid');
  }

  // password rules
  if (body.password && String(body.password).length < 6) {
    errors.push('password must be at least 6 characters');
  }

  if (body.password !== body.confirm_password) {
    errors.push('password and confirm_password do not match');
  }

  return { errors, normalizedBusinessType: bt };
};

const register = async (req, res) => {
  try {
    console.log('📝 AUTH CONTROLLER: register() called with:', req.body.email);
    const { errors, normalizedBusinessType } = validateRegistration(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const {
      first_name,
      last_name,
      business_name,
      phone,
      email,
      password,
    } = req.body;

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    console.log('📝 AUTH CONTROLLER: About to call userModel.createUser()');
    await userModel.createUser({
      first_name: String(first_name).trim(),
      last_name: String(last_name).trim(),
      business_name: String(business_name).trim(),
      business_type: normalizedBusinessType,
      phone: String(phone).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
    });

    // Fetch the newly created user
    const newUser = await userModel.findByEmail(String(email).toLowerCase().trim());
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        business_name: newUser.business_name,
        business_type: newUser.business_type,
        phone: newUser.phone,
        email: newUser.email,
      }
    });
  } catch (e) {
    console.error('register error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // 1. Check for Admin user first
    console.log(`[AUTH] Attempting login for: ${email}`);
    const admin = await adminModel.findActiveByEmail(String(email).toLowerCase().trim());
    if (admin) {
      console.log('[AUTH] Admin user found. Comparing password...');
      const ok = await bcrypt.compare(password, admin.password);
      if (ok) {
        console.log('[AUTH] Admin password correct. Generating token.');
        const token = jwt.sign(
          {
            sub: admin.id,
            email: admin.email,
            role: 'admin',
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );
        return res.json({
          message: 'Admin login successful',
          token,
          role: 'admin',
          user: {
            id: admin.id,
            username: admin.username,
            email: admin.email,
          },
        });
      }
      // If admin is found but password is wrong, fail immediately.
      console.log('[AUTH] Admin password incorrect.');
      return res.status(401).json({ message: 'Invalid credentials' });
    } else {
      console.log('[AUTH] No active admin user found. Proceeding to check for mill user.');
    }

    // 2. If not an admin, check for a Mill user
    const user = await userModel.findByEmail(String(email).toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        business_type: user.business_type,
        role: 'mill',
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Get complete profile information for mill users
    const { getUserWithProfilePhoto } = require('../models/userModel');
    const fullUser = await getUserWithProfilePhoto(user.id);

    // Check if this is a first-time login (missing profile fields)
  const isFirstLogin = !fullUser.address || !fullUser.city || !fullUser.district ||
            !fullUser.mill_capacity || !fullUser.mill_location ||
            fullUser.mill_latitude === null || fullUser.mill_latitude === undefined ||
            fullUser.mill_longitude === null || fullUser.mill_longitude === undefined;

    return res.json({
      message: 'Login successful',
      token,
      isFirstLogin,
      role: 'mill',
      user: {
        id: fullUser.id,
        first_name: fullUser.first_name,
        last_name: fullUser.last_name,
        business_name: fullUser.business_name,
        business_type: fullUser.business_type,
        phone: fullUser.phone,
        email: fullUser.email,
        address: fullUser.address,
        city: fullUser.city,
        district: fullUser.district,
        postal_code: fullUser.postal_code,
        mill_capacity: fullUser.mill_capacity,
        mill_location: fullUser.mill_location,
  mill_latitude: fullUser.mill_latitude,
  mill_longitude: fullUser.mill_longitude,
        registration_date: fullUser.created_at,
        has_photo: !!fullUser.has_photo,
        profile_photo: fullUser.photo_data ? `data:${fullUser.mime_type || 'image/png'};base64,${fullUser.photo_data}` : null
      },
    });
  } catch (e) {
    console.error('login error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    // const userId = req.user.sub;
    const user = await userModel.findByEmail(req.user.email);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        business_name: user.business_name,
        business_type: user.business_type,
        phone: user.phone,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    // For JWT-based auth, we don't need to do anything server-side
    // since JWTs are stateless. The client will remove the token.
    // This endpoint mainly serves to validate the user is authenticated
    // and provide a proper logout response.
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Server error during logout',
      error: error.message
    });
  }
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Forgot password function
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await userModel.findByEmail(email);
    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return res.json({ message: 'If an account with this email exists, you will receive a password reset link.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save reset token to database (you'll need to add these fields to your user model)
    await userModel.saveResetToken(user.id, resetTokenHash, resetTokenExpires);

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@paddymarketingboard.com',
      to: email,
      subject: 'Password Reset Request - Paddy Marketing Board',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Request</h1>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hello <strong>${user.first_name} ${user.last_name}</strong>,
            </p>

            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              We received a request to reset your password for your Paddy Marketing Board account.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background: linear-gradient(135deg, #10B981, #059669);
                        color: white;
                        padding: 15px 30px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                        display: inline-block;
                        font-size: 16px;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
              If the button above doesn't work, copy and paste this link into your browser:
            </p>

            <p style="font-size: 14px; color: #0066cc; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>

            <div style="border-left: 4px solid #f59e0b; padding-left: 15px; margin: 20px 0;">
              <p style="font-size: 14px; color: #92400e; margin: 0;">
                <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
              </p>
            </div>

            <p style="font-size: 14px; color: #666;">
              If you didn't request this password reset, please ignore this email. Your account remains secure.
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

            <p style="font-size: 12px; color: #999; text-align: center;">
              This email was sent from Paddy Marketing Board<br>
              © ${new Date().getFullYear()} Sri Lanka Paddy Marketing Board. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'If an account with this email exists, you will receive a password reset link.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Verify reset token function
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await userModel.findByResetToken(resetTokenHash);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    res.json({ message: 'Token is valid', email: user.email });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password function
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Validate password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await userModel.findByResetToken(resetTokenHash);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await userModel.updatePassword(user.id, hashedPassword);
    await userModel.clearResetToken(user.id);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword
};
