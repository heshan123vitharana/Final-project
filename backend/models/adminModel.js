const db = require('../database');

const findByUsername = async (username) => {
  const [rows] = await db.execute('SELECT * FROM admin WHERE username = ?', [username]);
  return rows[0];
};

const createAdmin = async (username, email, hashedPassword) => {
  await db.execute(
    'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
};

module.exports = { findByUsername, createAdmin };
