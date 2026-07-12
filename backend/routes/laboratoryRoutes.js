import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT lt.*, e.evidence_code, c.case_number, s.full_name AS tested_by_name
      FROM laboratory_tests lt
      JOIN evidence e ON e.evidence_id = lt.evidence_id
      JOIN medico_legal_cases c ON c.case_id = e.case_id
      LEFT JOIN staff s ON s.staff_id = lt.tested_by
      ORDER BY lt.test_id DESC`);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', allowRoles('admin', 'jmo', 'lab'), async (req, res) => {
  try {
    const { evidence_id, test_type, result, tested_by, test_date, status = 'Pending' } = req.body;
    if (!evidence_id || !test_type) return res.status(400).json({ message: 'Evidence and test type are required' });
    const [insert] = await pool.query(
      `INSERT INTO laboratory_tests(evidence_id,test_type,result,tested_by,test_date,status)
       VALUES(?,?,?,?,?,?)`,
      [evidence_id, test_type.trim(), result || null, tested_by || null, test_date || null, status]
    );
    res.status(201).json({ test_id: insert.insertId, message: 'Laboratory test created' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', allowRoles('admin', 'jmo', 'lab'), async (req, res) => {
  try {
    const { test_type, result, tested_by, test_date, status } = req.body;
    const [update] = await pool.query(
      `UPDATE laboratory_tests SET test_type=?,result=?,tested_by=?,test_date=?,status=? WHERE test_id=?`,
      [test_type, result || null, tested_by || null, test_date || null, status, req.params.id]
    );
    if (!update.affectedRows) return res.status(404).json({ message: 'Laboratory test not found' });
    res.json({ message: 'Laboratory test updated' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', allowRoles('admin'), async (req, res) => {
  const [result] = await pool.query('DELETE FROM laboratory_tests WHERE test_id=?', [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Laboratory test not found' });
  res.json({ message: 'Laboratory test deleted' });
});

export default router;
