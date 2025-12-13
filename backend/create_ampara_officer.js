const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function createAmparaOfficer() {
    try {
        console.log('=== Creating Ampara Regional Officer ===\n');

        // Check if officer already exists
        const [existing] = await db.execute("SELECT * FROM regional_officers WHERE district = 'Ampara'");

        if (existing.length > 0) {
            console.log('Ampara officer already exists:');
            console.log(existing[0]);
            process.exit(0);
        }

        // Create new officer
        const hashedPassword = await bcrypt.hash('password123', 10);

        const [result] = await db.execute(
            'INSERT INTO regional_officers (username, password, district, email) VALUES (?, ?, ?, ?)',
            ['regional_ampara', hashedPassword, 'Ampara', 'ampara@pmb.gov.lk']
        );

        console.log('✅ Created Ampara Regional Officer');
        console.log('Username: regional_ampara');
        console.log('Password: password123');
        console.log('District: Ampara');
        console.log('ID:', result.insertId);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAmparaOfficer();
