
const bcrypt = require('bcrypt');
const db = require('./database'); // Assuming your database connection is exported from 'database.js'

const saltRounds = 10;
const adminEmail = 'admin@paddy.lk';
const newPassword = 'Admin@2025';

async function updateAdminPassword() {
  try {
    console.log(`Hashing new password for ${adminEmail}...`);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log('Password hashed.');

    console.log('Updating password in the database...');
    const [result] = await db.execute(
      'UPDATE admin SET password = ? WHERE email = ?',
      [hashedPassword, adminEmail]
    );

    if (result.affectedRows > 0) {
      console.log(`\x1b[32m%s\x1b[0m`, `Successfully updated password for ${adminEmail}.`);
      console.log(`You can now log in with the password: ${newPassword}`);
    } else {
      console.error(`\x1b[31m%s\x1b[0m`, `Error: Could not find admin user with email ${adminEmail}.`);
    }
  } catch (error) {
    console.error('Failed to update admin password:', error);
  } finally {
    // Close the database connection if your setup requires it
    if (db.end) {
      db.end();
    }
  }
}

updateAdminPassword();
