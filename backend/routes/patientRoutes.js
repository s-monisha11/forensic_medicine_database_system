import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients ORDER BY patient_id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add patient
router.post('/', async (req, res) => {
  try {
    const { full_name, nic, age, gender, address, contact_no, hospital_bht, ward } = req.body;
    if (!full_name || !age || !gender) {
      return res.status(400).json({ message: 'Name, age and gender are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO patients(full_name,nic,age,gender,address,contact_no,hospital_bht,ward) VALUES(?,?,?,?,?,?,?,?)',
      [full_name, nic || null, age, gender, address || null, contact_no || null, hospital_bht || null, ward || null]
    );
    res.status(201).json({ patient_id: result.insertId, message: 'Patient registered successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A patient with this NIC or BHT already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const { full_name, nic, age, gender, address, contact_no, hospital_bht, ward } = req.body;
    if (!full_name || !age || !gender) {
      return res.status(400).json({ message: 'Name, age and gender are required' });
    }
    await pool.query(
      'UPDATE patients SET full_name=?,nic=?,age=?,gender=?,address=?,contact_no=?,hospital_bht=?,ward=? WHERE patient_id=?',
      [full_name, nic || null, age, gender, address || null, contact_no || null, hospital_bht || null, ward || null, req.params.id]
    );
    res.json({ message: 'Patient updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM patients WHERE patient_id=?', [req.params.id]);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'Cannot delete patient linked to existing cases' });
    }
    res.status(500).json({ message: err.message });
  }
});

export default router;
