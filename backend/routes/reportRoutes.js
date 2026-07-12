import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Get all reports
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cr.*, c.case_number, p.full_name AS patient_name, s.full_name AS prepared_by_name
      FROM court_reports cr
      JOIN medico_legal_cases c ON cr.case_id=c.case_id
      JOIN patients p ON c.patient_id=p.patient_id
      LEFT JOIN staff s ON cr.prepared_by=s.staff_id
      ORDER BY cr.report_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending reports
router.get('/pending', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cr.*, c.case_number, p.full_name AS patient_name, s.full_name AS prepared_by_name
      FROM court_reports cr
      JOIN medico_legal_cases c ON cr.case_id=c.case_id
      JOIN patients p ON c.patient_id=p.patient_id
      LEFT JOIN staff s ON cr.prepared_by=s.staff_id
      WHERE cr.status IN ('Draft','Pending')
      ORDER BY cr.report_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get monthly stats
router.get('/monthly', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(c.created_at, '%Y-%m') AS month,
             c.case_type,
             COUNT(*) AS total_cases
      FROM medico_legal_cases c
      GROUP BY month, c.case_type
      ORDER BY month DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add report
router.post('/', async (req, res) => {
  try {
    const { case_id, report_type, prepared_by, submission_date, court_name, status, remarks } = req.body;
    const [result] = await pool.query(
      `INSERT INTO court_reports(case_id,report_type,prepared_by,submission_date,court_name,status,remarks)
       VALUES(?,?,?,?,?,?,?)`,
      [case_id, report_type, prepared_by || null, submission_date || null, court_name || null, status || 'Draft', remarks]
    );
    res.status(201).json({ report_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update report
router.put('/:id', async (req, res) => {
  try {
    const { report_type, prepared_by, submission_date, court_name, status, remarks } = req.body;
    await pool.query(
      'UPDATE court_reports SET report_type=?,prepared_by=?,submission_date=?,court_name=?,status=?,remarks=? WHERE report_id=?',
      [report_type, prepared_by || null, submission_date || null, court_name || null, status, remarks, req.params.id]
    );
    res.json({ message: 'Report updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM court_reports WHERE report_id=?', [req.params.id]);
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
