import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
export async function getDB() {
  return open({
    filename: './backend/reports.db',
    driver: sqlite3.Database
  });
}

// Initialize the database with a reports table
export async function initDB() {
  const db = await getDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.close();
}
