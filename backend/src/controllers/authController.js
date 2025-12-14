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

// Enhanced input sanitization helper
const sanitizeInput = (input) => {
  if (!input) return '';
  // Allow + for phone numbers, remove potential HTML tags
  return String(input).trim().replace(/[<>]/g, '');
};

// ... (lines 24-150 remain unchanged, this tool doesn't support skipping lines effectively in replace_file_content for non-contiguous changes, so I will target specific blocks if needed, but here I am effectively checking if I can do it in one go or need multi_replace. The instruction says "Update sanitization... and update phone validation". These are far apart. I should use multi_replace for accuracy or two separate calls. I will use multi_replace.)

// Enhanced email validation with comprehensive regex
const validateEmail = (email) => {
  if (!email) return { valid: false, message: 'Email is required' };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address (e.g., user@example.com)' };
  }

  // Additional checks
  if (email.length > 191) {
    return { valid: false, message: 'Email address is too long (maximum 191 characters)' };
  }

  return { valid: true };
};

// Enhanced NIC validation for Sri Lankan NICs
const validateNIC = (nic) => {
  if (!nic) return { valid: true }; // NIC is optional

  const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
  if (!nicRegex.test(nic)) {
    return {
      valid: false,
      message: 'Invalid NIC format. Use either 9 digits followed by V/X (e.g., 123456789V) or 12 digits (e.g., 199012345678)'
    };
  }

  return { valid: true };
};

// Enhanced password validation
const validatePassword = (password, confirmPassword) => {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
    return { valid: false, errors };
  }

  const pwd = String(password);

  if (pwd.length < 8) {
    errors.push('at least 8 characters');
  }
  if (!/[A-Z]/.test(pwd)) {
    errors.push('one uppercase letter (A-Z)');
  }
  if (!/[a-z]/.test(pwd)) {
    errors.push('one lowercase letter (a-z)');
  }
  if (!/[0-9]/.test(pwd)) {
    errors.push('one number (0-9)');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
    errors.push('one special character (!@#$%^&*)');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      message: `Password must contain: ${errors.join(', ')}`
    };
  }

  if (password !== confirmPassword) {
    return { valid: false, errors: ['Passwords do not match'], message: 'Passwords do not match' };
  }

  return { valid: true };
};

const validateRegistration = (body) => {
  const errors = [];

  // Sanitize all inputs
  const sanitized = {
    first_name: sanitizeInput(body.first_name),
    last_name: sanitizeInput(body.last_name),
    business_name: sanitizeInput(body.business_name),
    business_type: sanitizeInput(body.business_type),
    phone: sanitizeInput(body.phone),
    nic: sanitizeInput(body.nic),
    email: sanitizeInput(body.email),
    password: body.password, // Don't sanitize password
    confirm_password: body.confirm_password,
  };

  // Required field validation with user-friendly messages
  const requiredFields = [
    { field: 'first_name', label: 'First name' },
    { field: 'last_name', label: 'Last name' },
    { field: 'business_name', label: 'Business name' },
    { field: 'business_type', label: 'Business type' },
    { field: 'phone', label: 'Phone number' },
    { field: 'email', label: 'Email address' },
    { field: 'password', label: 'Password' },
    { field: 'confirm_password', label: 'Password confirmation' },
  ];

  requiredFields.forEach(({ field, label }) => {
    if (!sanitized[field] || sanitized[field] === '') {
      errors.push(`${label} is required`);
    }
  });

  // Business type validation
  const bt = toEnumBusinessType(sanitized.business_type);
  if (!bt) {
    errors.push('Business type must be either "Private" or "Government"');
  }

  // Email validation
  const emailValidation = validateEmail(sanitized.email);
  if (!emailValidation.valid) {
    errors.push(emailValidation.message);
  }

  // NIC validation (optional field)
  if (sanitized.nic) {
    const nicValidation = validateNIC(sanitized.nic);
    if (!nicValidation.valid) {
      errors.push(nicValidation.message);
    }
  }

  // Phone validation - Support international format starting with +
  // Acceps: +94771234567, 0771234567
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{9,12}$/;

  // Remove spaces and dashes for checking
  const cleanPhone = sanitized.phone ? sanitized.phone.replace(/[\s-]/g, '') : '';

  if (sanitized.phone && !phoneRegex.test(cleanPhone)) {
    console.log('[AUTH] Phone validation failed for:', sanitized.phone);
    errors.push('Phone number must be valid (e.g., +94771234567 or 0771234567)');
  }

  // Password validation
  const passwordValidation = validatePassword(sanitized.password, sanitized.confirm_password);
  if (!passwordValidation.valid) {
    errors.push(passwordValidation.message);
  }

  return { errors, normalizedBusinessType: bt, sanitized };
};

const register = async (req, res) => {
  try {
    console.log('📝 AUTH CONTROLLER: register() called with:', req.body.email);
    const { errors, normalizedBusinessType, sanitized } = validateRegistration(req.body);

    if (errors.length) {
      console.log('❌ REGISTRATION VALIDATION FAILED:');
      console.log('   Errors:', errors);
      console.log('   Request body:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({ errors });
    }

    const {
      first_name,
      last_name,
      business_name,
      phone,
      nic,
      email,
      password,
    } = sanitized;

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    console.log('📝 AUTH CONTROLLER: About to call userModel.createUser()');
    await userModel.createUser({
      first_name,
      last_name,
      business_name,
      business_type: normalizedBusinessType,
      phone,
      nic,
      email,
      passwordHash,
    });

    // Fetch the newly created user
    const newUser = await userModel.findByEmail(email);
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
    const { email, nic, password } = req.body;

    if ((!email && !nic) || !password) {
      return res.status(400).json({ message: 'Email/NIC and password are required' });
    }

    // 1. Check for Admin user first (only if email is provided)
    // Admins can ONLY log in with email, not NIC
    if (email) {
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
    }

    // 2. Mill user login - requires BOTH email AND NIC
    if (!email || !nic) {
      return res.status(400).json({ message: 'Email, NIC, and password are required for mill login' });
    }

    console.log(`[AUTH] Attempting mill login with email: ${email} and NIC: ${nic}`);

    // Find user by email
    const user = await userModel.findByEmail(String(email).toLowerCase().trim());

    if (!user) {
      console.log('[AUTH] No mill user found with provided email');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify that the NIC matches the user's NIC
    console.log('[AUTH] ===== NIC VERIFICATION DEBUG =====');
    console.log('[AUTH] User object keys:', Object.keys(user));
    console.log('[AUTH] User NIC from DB (raw):', user.nic);
    console.log('[AUTH] User NIC type:', typeof user.nic);
    console.log('[AUTH] Input NIC (raw):', nic);

    const normalizedInputNic = String(nic).trim().toUpperCase();
    const normalizedUserNic = user.nic ? String(user.nic).trim().toUpperCase() : '';

    console.log('[AUTH] Normalized Input NIC:', normalizedInputNic);
    console.log('[AUTH] Normalized User NIC:', normalizedUserNic);
    console.log('[AUTH] NICs match:', normalizedInputNic === normalizedUserNic);
    console.log('[AUTH] ===================================');

    if (normalizedInputNic !== normalizedUserNic) {
      console.log(`[AUTH] ❌ NIC MISMATCH DETECTED!`);
      console.log(`[AUTH] Expected: "${normalizedUserNic}"`);
      console.log(`[AUTH] Received: "${normalizedInputNic}"`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('[AUTH] ✅ Email and NIC verified. Checking password...');

    // Check for lockout
    if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
      const remainingTime = Math.ceil((new Date(user.lockout_until) - new Date()) / 1000 / 60);
      return res.status(429).json({ message: `Account locked. Try again in ${remainingTime} minutes.` });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      await userModel.incrementFailedLogin(user.id);

      // Check if this failed attempt triggered a lockout (attempts >= 3)
      // Note: user.failed_login_attempts is the value BEFORE increment
      if ((user.failed_login_attempts || 0) + 1 >= 3) {
        await userModel.lockUser(user.id);
        return res.status(429).json({ message: 'Account locked due to too many failed attempts. Try again in 3 minutes.' });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset failed attempts on successful login
    if (user.failed_login_attempts > 0 || user.lockout_until) {
      await userModel.resetFailedLogin(user.id);
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        nic: user.nic,
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
        nic: fullUser.nic,
        address: fullUser.address,
        city: fullUser.city,
        district: fullUser.district,
        postal_code: fullUser.postal_code,
        address: fullUser.address,
        city: fullUser.city,
        district: fullUser.district,
        postal_code: fullUser.postal_code,
        mill_capacity: fullUser.mill_capacity,
        mill_location: fullUser.mill_location,
        mill_district: fullUser.mill_district,
        millDistrict: fullUser.mill_district,
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

    // Enhanced password validation
    const password = String(newPassword);
    const passwordErrors = [];

    if (password.length < 8) {
      passwordErrors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push('one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passwordErrors.push('one special character');
    }

    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message: `Password must contain ${passwordErrors.join(', ')}`
      });
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
