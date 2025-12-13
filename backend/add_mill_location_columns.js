const db = require('./src/config/database');

async function addLocationColumns() {
    try {
        console.log('🔄 Checking users table for location columns...');

        // Check if columns exist
        const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'paddy_management_db'}' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('mill_latitude', 'mill_longitude')
    `);

        const existingColumns = columns.map(c => c.COLUMN_NAME);

        if (!existingColumns.includes('mill_latitude')) {
            console.log('➕ Adding mill_latitude column...');
            await db.execute(`
        ALTER TABLE users 
        ADD COLUMN mill_latitude DECIMAL(10, 8) NULL AFTER mill_location
      `);
        } else {
            console.log('✅ mill_latitude already exists');
        }

        if (!existingColumns.includes('mill_longitude')) {
            console.log('➕ Adding mill_longitude column...');
            await db.execute(`
        ALTER TABLE users 
        ADD COLUMN mill_longitude DECIMAL(11, 8) NULL AFTER mill_latitude
      `);
        } else {
            console.log('✅ mill_longitude already exists');
        }

        console.log('✨ Database schema update for location completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating database schema:', error);
        process.exit(1);
    }
}

addLocationColumns();
