// models/userModel.js
const db = require('../database');

const createUser = async (user) => {
  const {
    first_name,
    last_name,
    business_name,
    business_type,
    phone,
    email,
    passwordHash,
  } = user;

  await db.execute(
    `INSERT INTO users
      (first_name, last_name, business_name, business_type, phone, email, password)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      business_name,
      business_type,
      phone,
      email,
      passwordHash,
    ]
  );
};

const findByEmail = async (email) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
  return rows[0];
};

module.exports = {
  createUser,
  findByEmail,
};
