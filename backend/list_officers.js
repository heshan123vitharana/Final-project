const db = require('./src/config/database');

async function listOfficers() {
    try {
        const [officers] = await db.execute("SELECT * FROM regional_officers");
        console.log(`Found ${officers.length} regional officers:\n`);
        officers.forEach(o => {
            console.log(`ID: ${o.id}`);
            console.log(`Username: ${o.username}`);
            console.log(`District: ${o.district}`);
            console.log(`Email: ${o.email}`);
            console.log('---');
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listOfficers();
