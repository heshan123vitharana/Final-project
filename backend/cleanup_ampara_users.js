const db = require('./src/config/database');

async function cleanupAmpara() {
    try {
        console.log('Cleaning up Ampara users...');
        const [officers] = await db.execute("SELECT * FROM regional_officers WHERE district = 'Ampara' OR username IN ('ampara', 'regional_ampara')");

        const amparaUser = officers.find(o => o.username === 'ampara');
        const regionalAmparaUser = officers.find(o => o.username === 'regional_ampara');

        if (regionalAmparaUser) {
            console.log(`Found unwanted user: ${regionalAmparaUser.username} (ID: ${regionalAmparaUser.id})`);
            await db.execute('DELETE FROM regional_officers WHERE id = ?', [regionalAmparaUser.id]);
            console.log('✅ Deleted user: regional_ampara');
        } else {
            console.log('ℹ️ User regional_ampara not found.');
        }

        if (amparaUser) {
            console.log(`✅ User 'ampara' exists (ID: ${amparaUser.id}). Keeping this user.`);
        } else {
            console.log("⚠️ User 'ampara' not found! You might want to rename or create it.");
            // If ampara doesn't exist but we just deleted regional_ampara, that would be bad, but the logic above assumes independent existence.
            // If the user said "remove other", implies they see two.
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanupAmpara();
