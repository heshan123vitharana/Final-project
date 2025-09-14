// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

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

    if (!email || !password)
      return res.status(400).json({ message: 'email and password are required' });

    const user = await userModel.findByEmail(String(email).toLowerCase().trim());
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        business_type: user.business_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Get complete profile information for new users
    const pool = require('../config/database');
    const [userWithProfile] = await pool.execute(`
      SELECT u.*,
             CASE WHEN upp.photo_data IS NOT NULL THEN 1 ELSE 0 END as has_photo,
             upp.photo_data
      FROM users u
      LEFT JOIN user_profile_photos upp ON u.id = upp.user_id
      WHERE u.id = ?
    `, [user.id]);

    const fullUser = userWithProfile[0];

    // Check if this is a first-time login (missing profile fields)
    const isFirstLogin = !fullUser.address || !fullUser.city || !fullUser.district ||
                        !fullUser.mill_capacity || !fullUser.mill_location;

    return res.json({
      message: 'Login successful',
      token,
      isFirstLogin,
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
        registration_date: fullUser.created_at,
        has_photo: !!fullUser.has_photo,
        profile_photo: fullUser.photo_data ? `data:image/jpeg;base64,${fullUser.photo_data}` : null
      },
    });
  } catch (e) {
    console.error('login error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.sub;
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

module.exports = { register, login, getProfile, logout };
