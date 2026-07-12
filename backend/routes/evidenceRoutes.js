import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';
const router = express.Router();

// Get all evidence
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.case_number, s.full_name AS collected_by_name
      FROM evidence e
      JOIN medico_legal_cases c ON e.case_id=c.case_id
      LEFT JOIN staff s ON e.collected_by=s.staff_id
      ORDER BY e.evidence_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add evidence
router.post('/', allowRoles('admin','jmo','doctor'), async (req, res) => {
  try {
    const { case_id, evidence_type, description, storage_location, collected_date, collected_by, current_status } = req.body;
    const evidence_code = `EV-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
    const [result] = await pool.query(
      `INSERT INTO evidence(evidence_code,case_id,evidence_type,description,storage_location,collected_date,collected_by,current_status)
       VALUES(?,?,?,?,?,?,?,?)`,
      [evidence_code, case_id, evidence_type, description, storage_location, collected_date, collected_by || null, current_status || 'Stored']
    );
    res.status(201).json({ evidence_id: result.insertId, evidence_code });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update evidence
router.put('/:id', allowRoles('admin','jmo','doctor','lab'), async (req, res) => {
  try {
    const { evidence_type, description, storage_location, collected_date, collected_by, current_status } = req.body;
    await pool.query(
      'UPDATE evidence SET evidence_type=?,description=?,storage_location=?,collected_date=?,collected_by=?,current_status=? WHERE evidence_id=?',
      [evidence_type, description, storage_location, collected_date, collected_by || null, current_status, req.params.id]
    );
    res.json({ message: 'Evidence updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete evidence
router.delete('/:id', allowRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM evidence WHERE evidence_id=?', [req.params.id]);
    res.json({ message: 'Evidence deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Chain of custody for a specific evidence item
router.get('/:evidenceId/chain-of-custody', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT coc.*, fs.full_name AS from_staff_name, ts.full_name AS to_staff_name
      FROM chain_of_custody coc
      LEFT JOIN staff fs ON coc.from_staff_id=fs.staff_id
      LEFT JOIN staff ts ON coc.to_staff_id=ts.staff_id
      WHERE coc.evidence_id=?
      ORDER BY coc.transfer_date ASC
    `, [req.params.evidenceId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add chain of custody entry
router.post('/:evidenceId/chain-of-custody', allowRoles('admin','jmo','doctor','lab'), async (req, res) => {
  try {
    const { from_staff_id, to_staff_id, transfer_date, purpose, remarks } = req.body;
    const [result] = await pool.query(
      'INSERT INTO chain_of_custody(evidence_id,from_staff_id,to_staff_id,transfer_date,purpose,remarks) VALUES(?,?,?,?,?,?)',
      [req.params.evidenceId, from_staff_id || null, to_staff_id || null, transfer_date, purpose, remarks]
    );
    res.status(201).json({ custody_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
