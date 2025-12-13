const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        await db.execute(
            'UPDATE regional_officers SET password = ? WHERE username = ?',
            [hashedPassword, 'ampara']
        );

        console.log('✅ Password reset for user: ampara');
        console.log('New password: password123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

resetPassword();
