import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';
const router = express.Router();

// Get all cases (with patient & staff names)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, p.full_name AS patient_name, p.nic, s.full_name AS assigned_staff_name
      FROM medico_legal_cases c
      LEFT JOIN patients p ON c.patient_id=p.patient_id
      LEFT JOIN staff s ON c.assigned_staff_id=s.staff_id
      ORDER BY c.case_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create case
router.post('/', allowRoles('admin','jmo','doctor','clerical'), async (req, res) => {
  try {
    const { patient_id, case_type, incident_date, incident_location, police_station, description, assigned_staff_id, status } = req.body;
    const prefix = case_type === 'Autopsy' ? 'PM' : 'CLN';
    const case_number = `${prefix}-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
    const [result] = await pool.query(
      `INSERT INTO medico_legal_cases(case_number,patient_id,case_type,incident_date,incident_location,police_station,description,assigned_staff_id,status)
       VALUES(?,?,?,?,?,?,?,?,?)`,
      [case_number, patient_id, case_type, incident_date, incident_location, police_station, description, assigned_staff_id || null, status || 'Pending']
    );
    res.status(201).json({ case_id: result.insertId, case_number });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search cases
router.get('/search', async (req, res) => {
  try {
    const q = `%${req.query.q || ''}%`;
    const caseType = req.query.case_type || '';
    const status = req.query.status || '';
    const startDate = req.query.start_date || '';
    const endDate = req.query.end_date || '';
    const doctor = req.query.doctor || '';

    let sql = `
      SELECT c.case_number, c.case_id, c.case_type, c.incident_date, c.police_station, c.status,
        p.full_name AS patient_name, p.nic, s.full_name AS doctor
      FROM medico_legal_cases c
      LEFT JOIN patients p ON c.patient_id=p.patient_id
      LEFT JOIN staff s ON c.assigned_staff_id=s.staff_id
      WHERE (c.case_number LIKE ? OR p.full_name LIKE ? OR p.nic LIKE ? OR c.police_station LIKE ?)
    `;
    const params = [q, q, q, q];

    if (caseType) { sql += ' AND c.case_type=?'; params.push(caseType); }
    if (status) { sql += ' AND c.status=?'; params.push(status); }
    if (startDate) { sql += ' AND c.incident_date>=?'; params.push(startDate); }
    if (endDate) { sql += ' AND c.incident_date<=?'; params.push(endDate); }
    if (doctor) { sql += ' AND s.full_name LIKE ?'; params.push(`%${doctor}%`); }

    sql += ' ORDER BY c.case_id DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update case
router.put('/:id', allowRoles('admin','jmo','doctor','clerical'), async (req, res) => {
  try {
    const { patient_id, case_type, incident_date, incident_location, police_station, description, assigned_staff_id, status } = req.body;
    if (!patient_id || !case_type || !incident_date) {
      return res.status(400).json({ message: 'Patient, case type and incident date are required' });
    }
    await pool.query(
      `UPDATE medico_legal_cases SET patient_id=?, case_type=?, incident_date=?, incident_location=?, police_station=?, description=?, assigned_staff_id=?, status=? WHERE case_id=?`,
      [patient_id, case_type, incident_date, incident_location, police_station, description, assigned_staff_id || null, status, req.params.id]
    );
    res.json({ message: 'Case updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete case
router.delete('/:id', allowRoles('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM medico_legal_cases WHERE case_id=?', [req.params.id]);
    res.json({ message: 'Case deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
