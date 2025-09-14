const bcrypt = require('bcrypt');
const db = require('./config/database');

async function updateTestUser() {
  try {
    console.log('🔐 Updating test user with hashed password...');

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Update the user
    await db.execute(`
      UPDATE users
      SET password = ?
      WHERE email = 'test@mill.lk'
    `, [hashedPassword]);

    console.log('✅ Test user password updated successfully');
    console.log('📧 Email: test@mill.lk');
    console.log('🔑 Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating test user:', error);
    process.exit(1);
  }
}

updateTestUser();