
import { getDB } from '../db.js';
import bcrypt from 'bcrypt';


export async function createAdmin(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const db = await getDB();
  await db.run(
    'INSERT INTO admin (username, email, password, status) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'active']
  );
  await db.close();
}


export async function findActiveByEmail(email) {
  console.log('🔍 Searching for email:', email);
  try {
    const db = await getDB();
    const row = await db.get(
      'SELECT * FROM admin WHERE email = ? AND status = ?',
      [email, 'active']
    );
    await db.close();
    if (row) {
      console.log('✅ Found admin:', { id: row.id, username: row.username, email: row.email });
    }
    return row;
  } catch (error) {
    console.error('❌ Database query error:', error.message);
    throw error;
  }
}

