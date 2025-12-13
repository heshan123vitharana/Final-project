const db = require('./src/config/database');

async function checkDistrict() {
    try {
        console.log('--- Checking Officer District PRECISELY ---');
        const [officers] = await db.execute("SELECT username, district FROM regional_officers");
        officers.forEach(o => {
            console.log(`User: ${o.username}, District: "${o.district}"`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkDistrict();
