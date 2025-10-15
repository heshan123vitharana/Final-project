const mysql = require('mysql2/promise');

async function checkNotifications() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'paddy_management'
  });

  try {
    // Check notifications
    const [notifications] = await connection.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10'
    );
    console.log('\n📬 Recent Notifications:');
    console.log(JSON.stringify(notifications, null, 2));

    // Check users
    const [users] = await connection.query('SELECT id, first_name, last_name, email FROM users');
    console.log('\n👥 Users in database:');
    console.log(JSON.stringify(users, null, 2));

    // Check count
    const [count] = await connection.query('SELECT COUNT(*) as total FROM notifications');
    console.log('\n📊 Total notifications:', count[0].total);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkNotifications();
