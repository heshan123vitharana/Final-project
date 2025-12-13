const db = require('./src/config/database');
const fs = require('fs');

async function listOfficers() {
    try {
        const [officers] = await db.execute("SELECT * FROM regional_officers");
        let output = `Found ${officers.length} regional officers:\n\n`;
        officers.forEach(o => {
            output += `ID: ${o.id}\n`;
            output += `Username: ${o.username}\n`;
            output += `District: ${o.district}\n`;
            output += `Email: ${o.email}\n`;
            output += '---\n';
        });
        fs.writeFileSync('officers_list.txt', output);
        console.log('Written to officers_list.txt');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listOfficers();
