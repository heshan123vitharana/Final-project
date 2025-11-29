const db = require('./src/config/database');
const userModel = require('./src/models/userModel');

async function testRateLimit() {
    try {
        console.log('🧪 Starting Rate Limit Debug Test...');

        // 1. Find a test user
        const [users] = await db.execute('SELECT * FROM users LIMIT 1');

        if (users.length === 0) {
            console.log('❌ No users found in DB to test with.');
            return;
        }

        const user = users[0];
        console.log(`\n>>> USER_ID: ${user.id} | EMAIL: ${user.email}`);
        console.log(`>>> INITIAL_ATTEMPTS: ${user.failed_login_attempts}`);

        // 2. Reset failed attempts
        console.log('\n>>> ACTION: Resetting failed attempts...');
        await userModel.resetFailedLogin(user.id);

        const [userAfterReset] = await db.execute('SELECT * FROM users WHERE id = ?', [user.id]);
        console.log(`>>> AFTER_RESET: ${userAfterReset[0].failed_login_attempts}`);

        // 3. Increment once
        console.log('\n>>> ACTION: Incrementing (1st)...');
        await userModel.incrementFailedLogin(user.id);

        const [userAfterInc1] = await db.execute('SELECT * FROM users WHERE id = ?', [user.id]);
        console.log(`>>> AFTER_INC_1: ${userAfterInc1[0].failed_login_attempts}`);

        // 4. Increment again
        console.log('\n>>> ACTION: Incrementing (2nd)...');
        await userModel.incrementFailedLogin(user.id);

        const [userAfterInc2] = await db.execute('SELECT * FROM users WHERE id = ?', [user.id]);
        console.log(`>>> AFTER_INC_2: ${userAfterInc2[0].failed_login_attempts}`);

        // 5. Lock user
        console.log('\n>>> ACTION: Locking user...');
        await userModel.lockUser(user.id);

        const [userAfterLock] = await db.execute('SELECT * FROM users WHERE id = ?', [user.id]);
        console.log(`>>> LOCKOUT_UNTIL: ${userAfterLock[0].lockout_until}`);

        console.log('\n>>> TEST_COMPLETE');
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testRateLimit();
