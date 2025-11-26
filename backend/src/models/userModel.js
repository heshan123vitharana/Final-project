// models/userModel.js
const db = require('../config/database');
const { getDefaultProfilePhotoBase64 } = require('../utils/defaultProfilePhoto');

const createUser = async (user) => {
  try {
    const {
      first_name,
      last_name,
      business_name,
      business_type,
      phone,
      nic,
      email,
      passwordHash,
    } = user;

    console.log('🔄 Creating user:', { email, business_name, business_type });

    const [result] = await db.execute(
      "INSERT INTO users (first_name, last_name, business_name, business_type, phone, nic, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        first_name,
        last_name,
        business_name,
        business_type,
        phone,
        nic,
        email,
        passwordHash,
      ]
    );

    const userId = result?.insertId ?? result?.lastID ?? result?.lastId ?? null;
    console.log('✅ User created successfully:', { userId, email });

    // Create default profile photo for the new user
    try {
      console.log('🖼️ Generating default profile photo for user:', userId);
      const defaultPhotoBase64 = getDefaultProfilePhotoBase64(200);
      console.log('🖼️ Photo generated, length:', defaultPhotoBase64.length);

      const result = await db.execute(
        `INSERT INTO user_profile_photos (user_id, photo_data, filename, file_size, mime_type)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, defaultPhotoBase64, 'default_avatar.png', defaultPhotoBase64.length, 'image/png']
      );
      console.log('✅ Default profile photo assigned to user:', userId, 'Result:', result[0]);
    } catch (photoError) {
      console.error('❌ Error creating default profile photo:', photoError.message);
      console.error('❌ Full error:', photoError);
      // Don't fail the user creation if photo assignment fails
    }

    return { insertId: userId };
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    const msg = String(error?.message || '');
    if (
      (error?.code && error.code === 'ER_DUP_ENTRY') ||
      (error?.code && error.code === 'SQLITE_CONSTRAINT') ||
      msg.includes('UNIQUE constraint failed') ||
      msg.includes('Duplicate entry')
    ) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    console.log('🔍 Finding user by email:', email);
    const [rows] = await db.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    const user = rows && rows[0];

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

const getUserWithProfilePhoto = async (userId) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.*,
             CASE WHEN upp.photo_data IS NOT NULL THEN 1 ELSE 0 END as has_photo,
             upp.photo_data,
             upp.filename,
             upp.file_size,
             upp.mime_type
      FROM users u
      LEFT JOIN user_profile_photos upp ON u.id = upp.user_id
      WHERE u.id = ?
    `, [userId]);

    return rows[0] || null;
  } catch (error) {
    console.error('❌ Error getting user with profile photo:', error.message);
    throw error;
  }
};

// Save reset token for password reset
const saveResetToken = async (userId, resetTokenHash, resetTokenExpires) => {
  try {
    console.log('🔑 Saving reset token for user:', userId);
    const [result] = await db.execute(
      `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?`,
      [resetTokenHash, resetTokenExpires, userId]
    );
    console.log('✅ Reset token saved successfully');
    return result;
  } catch (error) {
    console.error('❌ Error saving reset token:', error.message);
    throw error;
  }
};

// Find user by reset token
const findByResetToken = async (resetTokenHash) => {
  try {
    console.log('🔍 Finding user by reset token');
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW() LIMIT 1`,
      [resetTokenHash]
    );
    const user = rows && rows[0];

    if (user) {
      console.log('✅ User found with valid reset token:', { id: user.id, email: user.email });
    } else {
      console.log('❌ No user found with valid reset token');
    }

    return user;
  } catch (error) {
    console.error('❌ Error finding user by reset token:', error.message);
    throw error;
  }
};

// Update user password
const updatePassword = async (userId, hashedPassword) => {
  try {
    console.log('🔒 Updating password for user:', userId);
    const [result] = await db.execute(
      `UPDATE users SET password = ?, password_changed_at = NOW() WHERE id = ?`,
      [hashedPassword, userId]
    );
    console.log('✅ Password updated successfully');
    return result;
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    throw error;
  }
};

// Clear reset token after successful password reset
const clearResetToken = async (userId) => {
  try {
    console.log('🧹 Clearing reset token for user:', userId);
    const [result] = await db.execute(
      `UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
      [userId]
    );
    console.log('✅ Reset token cleared successfully');
    return result;
  } catch (error) {
    console.error('❌ Error clearing reset token:', error.message);
    throw error;
  }
};

const findByNic = async (nic) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE nic = ?', [nic]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by NIC:', error);
    throw error;
  }
};

const incrementFailedLogin = async (userId) => {
  try {
    await db.execute(
      `UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?`,
      [userId]
    );
  } catch (error) {
    console.error('❌ Error incrementing failed login:', error.message);
  }
};

const resetFailedLogin = async (userId) => {
  try {
    await db.execute(
      `UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE id = ?`,
      [userId]
    );
  } catch (error) {
    console.error('❌ Error resetting failed login:', error.message);
  }
};

const lockUser = async (userId) => {
  try {
    // Lock for 3 minutes
    const lockoutTime = new Date(Date.now() + 3 * 60 * 1000);
    await db.execute(
      `UPDATE users SET lockout_until = ? WHERE id = ?`,
      [lockoutTime, userId]
    );
  } catch (error) {
    console.error('❌ Error locking user:', error.message);
  }
};

module.exports = {
  createUser,
  findByEmail,
  findByNic,
  getUserWithProfilePhoto,
  saveResetToken,
  findByResetToken,
  updatePassword,
  clearResetToken,
  incrementFailedLogin,
  resetFailedLogin,
  lockUser,
};
