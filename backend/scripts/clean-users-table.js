// ============================================
// Clean Users Table Script
// ============================================
// This script removes duplicate and invalid data from the users table
// Run: node backend/scripts/clean-users-table.js
// ============================================

require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'paddy_management',
};

async function cleanUsersTable() {
    let connection;

    try {
        console.log('🔧 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database\n');

        // Step 1: Show current state
        console.log('📊 CURRENT STATE');
        console.log('================');
        const [currentCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`Total users: ${currentCount[0].count}`);

        // Step 2: Invalid emails
        const [invalidEmails] = await connection.execute(
            `SELECT COUNT(*) as count FROM users 
       WHERE email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$'`
        );
        console.log(`Invalid email entries: ${invalidEmails[0].count}`);

        // Step 3: Invalid NICs
        const [invalidNics] = await connection.execute(
            `SELECT COUNT(*) as count FROM users 
       WHERE nic IS NOT NULL AND nic NOT REGEXP '^([0-9]{9}[vVxX]|[0-9]{12})$'`
        );
        console.log(`Invalid NIC entries: ${invalidNics[0].count}`);

        // Step 4: Duplicates
        const [duplicates] = await connection.execute(
            `SELECT COUNT(*) as count FROM (
        SELECT email, COUNT(*) as cnt FROM users GROUP BY email HAVING cnt > 1
      ) AS dups`
        );
        console.log(`Duplicate email entries: ${duplicates[0].count}`);

        // Step 5: Test accounts
        const [testAccounts] = await connection.execute(
            `SELECT COUNT(*) as count FROM users
       WHERE email LIKE '%test%' OR email LIKE '%demo%' OR email LIKE '%sample%'
       OR business_name LIKE '%test%' OR business_name LIKE '%demo%'`
        );
        console.log(`Test/demo accounts: ${testAccounts[0].count}\n`);

        // Create backup
        console.log('💾 CREATING BACKUP');
        console.log('==================');
        await connection.execute('DROP TABLE IF EXISTS users_backup_before_cleanup');
        await connection.execute('CREATE TABLE users_backup_before_cleanup AS SELECT * FROM users');
        console.log('✅ Backup created: users_backup_before_cleanup\n');

        // Cleanup operations
        console.log('🧹 CLEANUP OPERATIONS');
        console.log('=====================');

        // Delete invalid emails
        const [deleteInvalidEmails] = await connection.execute(
            `DELETE FROM users 
       WHERE email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$'`
        );
        console.log(`✅ Deleted ${deleteInvalidEmails.affectedRows} invalid email entries`);

        // Delete invalid NICs
        const [deleteInvalidNics] = await connection.execute(
            `DELETE FROM users 
       WHERE nic IS NOT NULL AND nic != '' 
       AND nic NOT REGEXP '^([0-9]{9}[vVxX]|[0-9]{12})$'`
        );
        console.log(`✅ Deleted ${deleteInvalidNics.affectedRows} invalid NIC entries`);

        // Remove duplicates
        const [deleteDuplicates] = await connection.execute(
            `DELETE u1 FROM users u1
       INNER JOIN users u2 
       WHERE u1.id > u2.id AND u1.email = u2.email`
        );
        console.log(`✅ Deleted ${deleteDuplicates.affectedRows} duplicate email entries`);

        // Reset failed login attempts
        const [resetAttempts] = await connection.execute(
            `UPDATE users 
       SET failed_login_attempts = 0, lockout_until = NULL 
       WHERE failed_login_attempts > 0 OR lockout_until IS NOT NULL`
        );
        console.log(`✅ Reset ${resetAttempts.affectedRows} failed login attempts and lockouts`);

        // Normalize NIC format
        const [normalizeNic] = await connection.execute(
            `UPDATE users SET nic = UPPER(nic) WHERE nic REGEXP '[vx]$'`
        );
        console.log(`✅ Normalized ${normalizeNic.affectedRows} NIC formats`);

        // Trim whitespace
        const [trimFields] = await connection.execute(
            `UPDATE users 
       SET first_name = TRIM(first_name),
           last_name = TRIM(last_name),
           business_name = TRIM(business_name),
           email = TRIM(LOWER(email)),
           phone = TRIM(phone),
           nic = TRIM(nic),
           address = TRIM(address),
           city = TRIM(city),
           district = TRIM(district)`
        );
        console.log(`✅ Trimmed whitespace from ${trimFields.affectedRows} records\n`);

        // Verification
        console.log('✅ VERIFICATION');
        console.log('===============');
        const [finalCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`Final users count: ${finalCount[0].count}`);

        const [remainingInvalidEmails] = await connection.execute(
            `SELECT COUNT(*) as count FROM users 
       WHERE email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$'`
        );
        console.log(`Remaining invalid emails: ${remainingInvalidEmails[0].count}`);

        const [remainingInvalidNics] = await connection.execute(
            `SELECT COUNT(*) as count FROM users 
       WHERE nic IS NOT NULL AND nic != ''
       AND nic NOT REGEXP '^([0-9]{9}[vVxX]|[0-9]{12})$'`
        );
        console.log(`Remaining invalid NICs: ${remainingInvalidNics[0].count}`);

        const [remainingDuplicates] = await connection.execute(
            `SELECT COUNT(*) as count FROM (
        SELECT email, COUNT(*) as cnt FROM users GROUP BY email HAVING cnt > 1
      ) AS dups`
        );
        console.log(`Remaining duplicate emails: ${remainingDuplicates[0].count}\n`);

        // Show sample
        console.log('📋 SAMPLE OF CLEANED DATA');
        console.log('=========================');
        const [sample] = await connection.execute(
            `SELECT id, first_name, last_name, email, nic, business_name, business_type, created_at
       FROM users ORDER BY created_at DESC LIMIT 5`
        );
        console.table(sample);

        console.log('\n✅ Users table cleanup completed successfully!');
        console.log('📝 Note: Backup table "users_backup_before_cleanup" contains original data');

    } catch (error) {
        console.error('❌ Error during cleanup:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the cleanup
cleanUsersTable();
