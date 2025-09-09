import { getDB } from '../db.js';

export async function createReport(title, content) {
  const db = await getDB();
  const result = await db.run(
    'INSERT INTO reports (title, content) VALUES (?, ?)',
    [title, content]
  );
  await db.close();
  return result.lastID;
}

export async function getAllReports() {
  const db = await getDB();
  const reports = await db.all('SELECT * FROM reports ORDER BY created_at DESC');
  await db.close();
  return reports;
}

export async function getReportById(id) {
  const db = await getDB();
  const report = await db.get('SELECT * FROM reports WHERE id = ?', [id]);
  await db.close();
  return report;
}
