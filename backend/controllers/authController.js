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

    await userModel.createUser({
      first_name: String(first_name).trim(),
      last_name: String(last_name).trim(),
      business_name: String(business_name).trim(),
      business_type: normalizedBusinessType,
      phone: String(phone).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
    });

    return res.status(201).json({ message: 'User registered successfully' });
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

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        business_name: user.business_name,
        business_type: user.business_type,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (e) {
    console.error('login error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
