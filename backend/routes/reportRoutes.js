/* global Buffer */
import express from 'express';
import { createReport, getAllReports, getReportById } from '../models/reportModel.js';
import { jsPDF } from 'jspdf';

const router = express.Router();

// Create a new report
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }
  const id = await createReport(title, content);
  res.status(201).json({ id, title, content });
});

// Get all reports
router.get('/', async (req, res) => {
  const reports = await getAllReports();
  res.json(reports);
});

// Get a single report by ID
router.get('/:id', async (req, res) => {
  const report = await getReportById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found.' });
  res.json(report);
});

// Generate a PDF for a report
router.get('/:id/pdf', async (req, res) => {
  const report = await getReportById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found.' });
  const doc = new jsPDF();
  doc.text(report.title, 10, 10);
  doc.text(report.content, 10, 20);
  const pdf = doc.output('arraybuffer');
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdf));
});

export default router;
