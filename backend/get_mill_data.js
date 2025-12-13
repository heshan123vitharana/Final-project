const db = require('./src/config/database');
const fs = require('fs');

async function dumpMills() {
    try {
        const [mills] = await db.execute(`
            SELECT u.id, u.business_name, u.district, u.mill_latitude 
            FROM users u
            JOIN mill_licenses ml ON u.id = ml.user_id
            WHERE ml.status = 'approved'
            AND u.mill_latitude IS NOT NULL
        `);

        let output = `Count: ${mills.length}\n`;
        mills.forEach(m => {
            output += `[${m.id}] Name: '${m.business_name}', District: '${m.district}', Lat: ${m.mill_latitude}\n`;
        });

        fs.writeFileSync('mill_dump.txt', output);
        console.log('Dumped to mill_dump.txt');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

dumpMills();
