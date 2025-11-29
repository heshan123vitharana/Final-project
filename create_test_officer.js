const db = require('./backend/src/config/database');
const bcrypt = require('bcryptjs');

async function createOfficer() {
    try {
        // Check if exists
        const [rows] = await db.execute('SELECT * FROM regional_officers WHERE username = ?', ['testofficer']);
        if (rows.length > 0) {
            console.log('Test officer already exists');
            process.exit(0);
        }

        const password = await bcrypt.hash('password123', 10);
        await db.execute(
            'INSERT INTO regional_officers (username, password, district, email, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
            ['testofficer', password, 'Colombo', 'test@example.com', '0771234567', 'Active']
        );
        console.log('Test officer created');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
createOfficer();
