// models/userModel.js
const db = require('../database');

const createUser = async (user) => {
  try {
    const {
      first_name,
      last_name,
      business_name,
      business_type,
      phone,
      email,
      passwordHash,
    } = user;

    console.log('🔄 Creating user:', { email, business_name, business_type });
    
    const result = await db.execute(
      "INSERT INTO users (first_name, last_name, business_name, business_type, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
    
    console.log('✅ User created successfully:', { userId: result[0].lastID, email });
    return result[0];
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    console.log('🔍 Finding user by email:', email);
    const [rows] = await db.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    const user = rows[0];
    
    if (user) {
      console.log('✅ User found:', { id: user.id, email: user.email });
    } else {
      console.log('❌ User not found for email:', email);
    }
    
    return user;
  } catch (error) {
    console.error('❌ Error finding user by email:', error.message);
    throw error;
  }
};

module.exports = {
  createUser,
  findByEmail,
};
