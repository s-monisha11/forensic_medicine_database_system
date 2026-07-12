import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';
const router = express.Router();

// Get all clinical examinations
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ce.*, c.case_number, p.full_name AS patient_name, s.full_name AS examined_by_name
      FROM clinical_examinations ce
      JOIN medico_legal_cases c ON ce.case_id=c.case_id
      JOIN patients p ON c.patient_id=p.patient_id
      LEFT JOIN staff s ON ce.examined_by=s.staff_id
      ORDER BY ce.examination_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add clinical examination
router.post('/', allowRoles('admin','jmo','doctor'), async (req, res) => {
  try {
    const { case_id, examination_date, injuries, findings, recommendation, examined_by } = req.body;
    const [result] = await pool.query(
      'INSERT INTO clinical_examinations(case_id,examination_date,injuries,findings,recommendation,examined_by) VALUES(?,?,?,?,?,?)',
      [case_id, examination_date, injuries, findings, recommendation, examined_by || null]
    );
    res.status(201).json({ examination_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update clinical examination
router.put('/:id', allowRoles('admin','jmo','doctor'), async (req, res) => {
  try {
    const { examination_date, injuries, findings, recommendation, examined_by } = req.body;
    await pool.query(
      'UPDATE clinical_examinations SET examination_date=?,injuries=?,findings=?,recommendation=?,examined_by=? WHERE examination_id=?',
      [examination_date, injuries, findings, recommendation, examined_by || null, req.params.id]
    );
    res.json({ message: 'Clinical examination updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete clinical examination
router.delete('/:id', allowRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM clinical_examinations WHERE examination_id=?', [req.params.id]);
    res.json({ message: 'Clinical examination deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
