import { getDB } from '../db.js';

export const createUser = async (user) => {
  const db = getDB();
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

    console.log('Creating user:', { email, business_name, business_type });

    return await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (first_name, last_name, business_name, business_type, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name,
          last_name,
          business_name,
          business_type,
          phone,
          email,
          passwordHash,
        ],
        function (err) {
          if (err) {
            console.error('Error creating user:', err.message);
            if (err.message.includes('UNIQUE constraint failed')) {
              return reject(new Error('Email already exists'));
            }
            return reject(err);
          }
          console.log('User created successfully:', { userId: this.lastID, email });
          resolve({ id: this.lastID });
        }
      );
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

export const findByEmail = async (email) => {
  const db = getDB();
  try {
    console.log('Finding user by email:', email);
    return await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email], (err, row) => {
        if (err) {
          console.error('Error finding user by email:', err.message);
          return reject(err);
        }
        if (row) {
          console.log('User found:', { id: row.id, email: row.email });
        } else {
          console.log('User not found for email:', email);
        }
        resolve(row);
      });
    });
  } catch (error) {
    console.error('Error finding user by email:', error.message);
    throw error;
  }
};
