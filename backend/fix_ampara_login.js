const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function fixLogin() {
    try {
        console.log('Fixing Ampara login...');

        // 1. Hash the simple password '123'
        const hashedPassword = await bcrypt.hash('123', 10);

        // 2. Update user 'ampara'
        const [result] = await db.execute(
            'UPDATE regional_officers SET password = ? WHERE username = ?',
            [hashedPassword, 'ampara']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Password successfully updated for user "ampara" to "123".');
        } else {
            console.log('⚠️ User "ampara" not found. Creating it now...');
            await db.execute(
                'INSERT INTO regional_officers (username, password, district, email) VALUES (?, ?, ?, ?)',
                ['ampara', hashedPassword, 'Ampara', 'ampara@pmb.gov.lk']
            );
            console.log('✅ Created new user "ampara" with password "123".');
        }

        // Verify
        const [user] = await db.execute("SELECT * FROM regional_officers WHERE username = 'ampara'");
        console.log('Current User State:', user[0]);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixLogin();
