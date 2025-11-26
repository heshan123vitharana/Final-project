process.env.SKIP_DB_INIT = 'true';
const bcrypt = require('bcrypt');
const db = require('./src/config/database');

const adminEmail = 'admin@paddy.lk';
const newPassword = 'PaddyAdmin@123';

async function updateAdminPassword() {
  try {
    console.log(`Hashing new password for ${adminEmail}...`);
    const saltRounds = 10;
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
    process.exit(0);
  }
}

updateAdminPassword();
