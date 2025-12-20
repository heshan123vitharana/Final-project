require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/config/database');

const ADMIN_EMAIL = 'admin@paddy.lk';
const ADMIN_PASSWORD = 'PaddyAdmin@123';
const ADMIN_USERNAME = 'Admin';

async function createAdminAccount() {
    try {
        console.log('🔧 Starting admin account creation...');

        // Step 1: Check if admin table exists
        console.log('📋 Checking if admin table exists...');
        try {
            const [tables] = await db.execute("SHOW TABLES LIKE 'admin'");

            if (tables.length === 0) {
                console.log('⚠️  Admin table does not exist. Creating it now...');

                // Create admin table
                await db.execute(`
          CREATE TABLE admin (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            status ENUM('active', 'inactive') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

                console.log('✅ Admin table created successfully!');
            } else {
                console.log('✅ Admin table already exists.');
            }
        } catch (tableError) {
            console.error('❌ Error checking/creating admin table:', tableError.message);
            throw tableError;
        }

        // Step 2: Check if admin account already exists
        console.log(`📧 Checking if admin account (${ADMIN_EMAIL}) already exists...`);
        const [existingAdmins] = await db.execute(
            'SELECT id, email, status FROM admin WHERE email = ?',
            [ADMIN_EMAIL]
        );

        if (existingAdmins.length > 0) {
            console.log('⚠️  Admin account already exists!');
            console.log('   ID:', existingAdmins[0].id);
            console.log('   Email:', existingAdmins[0].email);
            console.log('   Status:', existingAdmins[0].status);

            // Update password for existing admin
            console.log('🔄 Updating password for existing admin...');
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

            await db.execute(
                'UPDATE admin SET password = ?, status = ? WHERE email = ?',
                [hashedPassword, 'active', ADMIN_EMAIL]
            );

            console.log('✅ Admin password updated successfully!');
        } else {
            // Step 3: Create new admin account
            console.log('👤 Creating new admin account...');
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

            const [result] = await db.execute(
                'INSERT INTO admin (username, email, password, status) VALUES (?, ?, ?, ?)',
                [ADMIN_USERNAME, ADMIN_EMAIL, hashedPassword, 'active']
            );

            console.log('✅ Admin account created successfully!');
            console.log('   ID:', result.insertId);
        }

        // Step 4: Verify the account
        console.log('🔍 Verifying admin account...');
        const [verifyAdmins] = await db.execute(
            'SELECT id, username, email, status FROM admin WHERE email = ?',
            [ADMIN_EMAIL]
        );

        if (verifyAdmins.length > 0) {
            console.log('\n✅ ✅ ✅ SUCCESS! Admin account is ready! ✅ ✅ ✅\n');
            console.log('📋 Admin Account Details:');
            console.log('   ID:', verifyAdmins[0].id);
            console.log('   Username:', verifyAdmins[0].username);
            console.log('   Email:', verifyAdmins[0].email);
            console.log('   Status:', verifyAdmins[0].status);
            console.log('\n🔑 Login Credentials:');
            console.log('   Email:', ADMIN_EMAIL);
            console.log('   Password:', ADMIN_PASSWORD);
            console.log('\n🌐 You can now log in at your admin login page!');
        } else {
            console.error('❌ Verification failed - admin account not found after creation!');
        }

    } catch (error) {
        console.error('❌ Error creating admin account:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        // Close database connection
        if (db.end) {
            await db.end();
        }
        process.exit(0);
    }
}

createAdminAccount();
