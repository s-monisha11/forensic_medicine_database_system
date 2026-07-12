import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';
const router = express.Router();

// Get all postmortems
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pm.*, c.case_number, p.full_name AS patient_name, s.full_name AS performed_by_name
      FROM postmortems pm
      JOIN medico_legal_cases c ON pm.case_id=c.case_id
      JOIN patients p ON c.patient_id=p.patient_id
      LEFT JOIN staff s ON pm.performed_by=s.staff_id
      ORDER BY pm.postmortem_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add postmortem
router.post('/', allowRoles('admin','jmo'), async (req, res) => {
  try {
    const { case_id, examination_date, findings, cause_of_death, remarks, performed_by } = req.body;
    const [result] = await pool.query(
      'INSERT INTO postmortems(case_id,examination_date,findings,cause_of_death,remarks,performed_by) VALUES(?,?,?,?,?,?)',
      [case_id, examination_date, findings, cause_of_death, remarks, performed_by || null]
    );
    res.status(201).json({ postmortem_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update postmortem
router.put('/:id', allowRoles('admin','jmo'), async (req, res) => {
  try {
    const { examination_date, findings, cause_of_death, remarks, performed_by } = req.body;
    await pool.query(
      'UPDATE postmortems SET examination_date=?,findings=?,cause_of_death=?,remarks=?,performed_by=? WHERE postmortem_id=?',
      [examination_date, findings, cause_of_death, remarks, performed_by || null, req.params.id]
    );
    res.json({ message: 'Postmortem updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete postmortem
router.delete('/:id', allowRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM postmortems WHERE postmortem_id=?', [req.params.id]);
    res.json({ message: 'Postmortem deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
