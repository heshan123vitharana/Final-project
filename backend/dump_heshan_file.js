const db = require('./src/config/database');
const fs = require('fs');

async function dumpHeshan() {
    try {
        console.log('--- Dumping User Heshan ---');
        const [users] = await db.execute("SELECT * FROM users WHERE business_name LIKE '%Heshan%' OR first_name LIKE '%Heshan%'");

        let output = '';
        users.forEach(u => {
            output += `ID: ${u.id}\n`;
            Object.keys(u).forEach(key => {
                output += `${key}: "${u[key]}"\n`;
            });
            output += '-------------------\n';
        });

        fs.writeFileSync('heshan_dump.txt', output);
        console.log('Dumped to heshan_dump.txt');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

dumpHeshan();
