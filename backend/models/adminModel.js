const db = require('../database');
const bcrypt = require('bcrypt');

const createAdmin = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.execute(
    'INSERT INTO admin (username, email, password, status) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'active']
  );
};

const findActiveByEmail = async (email) => {
  console.log('🔍 Searching for email:', email);
  try {
    const [rows] = await db.execute(
      'SELECT * FROM admin WHERE email = ? AND status = ?',
      [email, 'active']
    );
    console.log('📊 Query returned:', rows.length, 'rows');
    if (rows.length > 0) {
      console.log('✅ Found admin:', { id: rows[0].id, username: rows[0].username, email: rows[0].email });
    }
    return rows[0];
  } catch (error) {
    console.error('❌ Database query error:', error.message);
    throw error;
  }
};

module.exports = { createAdmin, findActiveByEmail };