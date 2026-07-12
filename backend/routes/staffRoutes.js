import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';
const router = express.Router();

// Get all staff
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM staff ORDER BY staff_id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add staff
router.post('/', allowRoles('admin'), async (req, res) => {
  try {
    const { full_name, role, specialization, contact_no, email } = req.body;
    if (!full_name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO staff(full_name,role,specialization,contact_no,email) VALUES(?,?,?,?,?)',
      [full_name, role, specialization || null, contact_no || null, email || null]
    );
    res.status(201).json({ staff_id: result.insertId, message: 'Staff added' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A staff member with this email already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Update staff
router.put('/:id', allowRoles('admin'), async (req, res) => {
  try {
    const { full_name, role, specialization, contact_no, email } = req.body;
    await pool.query(
      'UPDATE staff SET full_name=?,role=?,specialization=?,contact_no=?,email=? WHERE staff_id=?',
      [full_name, role, specialization || null, contact_no || null, email || null, req.params.id]
    );
    res.json({ message: 'Staff updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete staff
router.delete('/:id', allowRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM staff WHERE staff_id=?', [req.params.id]);
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
