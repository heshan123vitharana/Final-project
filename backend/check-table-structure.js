const mysql = require('mysql2/promise');

async function checkTableStructure() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'paddy_management'
  });

  try {
    // Check table structure
    const [columns] = await connection.query('DESCRIBE notifications');
    console.log('\n📋 Notifications table structure:');
    console.log(JSON.stringify(columns, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkTableStructure();
