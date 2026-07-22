import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';

const router = express.Router();

// Helper validation function
function validateCase(body) {
  const { patient_id, case_type, incident_date, status } = body;
  
  if (!patient_id || isNaN(Number(patient_id))) {
    return 'A valid patient_id is required';
  }
  
  if (!case_type || !['Autopsy', 'Clinical'].includes(case_type)) {
    return 'Case type must be either Autopsy or Clinical';
  }
  
  if (!incident_date || isNaN(Date.parse(incident_date))) {
    return 'A valid incident date is required';
  }

  if (status && !['Pending', 'In Progress', 'Completed', 'Urgent'].includes(status)) {
    return 'Invalid status value';
  }
  
  return null;
}

// Get all cases
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.case_id,
        c.case_number,
        c.person_id AS patient_id,
        MAX(p.full_name) AS patient_name,
        MAX(p.nic_passport) AS nic,
        MAX(ct.type_name) AS case_type,
        MAX(cs.status_name) AS status,
        MAX(c.admission_date) AS admission_date,
        MAX(i.incident_date) AS incident_date,
        MAX(i.location) AS incident_location,
        MAX(i.incident_summary) AS description,
        MAX(ps.station_name) AS police_station,
        MIN(s.staff_id) AS assigned_staff_id,
        MIN(s.full_name) AS assigned_staff_name
      FROM MedicoLegalCase c
      LEFT JOIN Person p ON c.person_id = p.person_id
      LEFT JOIN CaseType ct ON c.case_type_id = ct.case_type_id
      LEFT JOIN CaseStatus cs ON c.case_status_id = cs.case_status_id
      LEFT JOIN Incident i ON c.case_id = i.case_id
      LEFT JOIN CaseReference cr ON c.case_id = cr.case_id
      LEFT JOIN PoliceStation ps ON cr.police_station_id = ps.station_id
      LEFT JOIN StaffCaseAssignment sca ON c.case_id = sca.case_id
      LEFT JOIN Staff s ON sca.staff_id = s.staff_id
      GROUP BY c.case_id, c.case_number, c.person_id
      ORDER BY c.case_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Get all cases error:', err);
    res.status(500).json({ message: 'Internal server error' });
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
      SELECT 
        c.case_id,
        c.case_number,
        c.person_id AS patient_id,
        MAX(p.full_name) AS patient_name,
        MAX(p.nic_passport) AS nic,
        MAX(ct.type_name) AS case_type,
        MAX(cs.status_name) AS status,
        MAX(i.incident_date) AS incident_date,
        MAX(ps.station_name) AS police_station,
        MIN(s.full_name) AS doctor
      FROM MedicoLegalCase c
      LEFT JOIN Person p ON c.person_id = p.person_id
      LEFT JOIN CaseType ct ON c.case_type_id = ct.case_type_id
      LEFT JOIN CaseStatus cs ON c.case_status_id = cs.case_status_id
      LEFT JOIN Incident i ON c.case_id = i.case_id
      LEFT JOIN CaseReference cr ON c.case_id = cr.case_id
      LEFT JOIN PoliceStation ps ON cr.police_station_id = ps.station_id
      LEFT JOIN StaffCaseAssignment sca ON c.case_id = sca.case_id
      LEFT JOIN Staff s ON sca.staff_id = s.staff_id
      WHERE (c.case_number LIKE ? OR p.full_name LIKE ? OR p.nic_passport LIKE ? OR ps.station_name LIKE ?)
    `;
    const params = [q, q, q, q];

    if (caseType) { 
      sql += ' AND ct.type_name = ?'; 
      params.push(caseType); 
    }
    if (status) { 
      sql += ' AND cs.status_name = ?'; 
      params.push(status); 
    }
    if (startDate) { 
      sql += ' AND i.incident_date >= ?'; 
      params.push(startDate); 
    }
    if (endDate) { 
      sql += ' AND i.incident_date <= ?'; 
      params.push(endDate); 
    }
    if (doctor) { 
      sql += ' AND s.full_name LIKE ?'; 
      params.push(`%${doctor}%`); 
    }

    sql += ' GROUP BY c.case_id, c.case_number, c.person_id ORDER BY c.case_id DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Search cases error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get one case
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.case_id,
        c.case_number,
        c.person_id AS patient_id,
        MAX(p.full_name) AS patient_name,
        MAX(p.nic_passport) AS nic,
        MAX(ct.type_name) AS case_type,
        MAX(cs.status_name) AS status,
        MAX(c.admission_date) AS admission_date,
        MAX(i.incident_date) AS incident_date,
        MAX(i.location) AS incident_location,
        MAX(i.incident_summary) AS description,
        MAX(ps.station_name) AS police_station,
        MIN(s.staff_id) AS assigned_staff_id,
        MIN(s.full_name) AS assigned_staff_name
      FROM MedicoLegalCase c
      LEFT JOIN Person p ON c.person_id = p.person_id
      LEFT JOIN CaseType ct ON c.case_type_id = ct.case_type_id
      LEFT JOIN CaseStatus cs ON c.case_status_id = cs.case_status_id
      LEFT JOIN Incident i ON c.case_id = i.case_id
      LEFT JOIN CaseReference cr ON c.case_id = cr.case_id
      LEFT JOIN PoliceStation ps ON cr.police_station_id = ps.station_id
      LEFT JOIN StaffCaseAssignment sca ON c.case_id = sca.case_id
      LEFT JOIN Staff s ON sca.staff_id = s.staff_id
      WHERE c.case_id = ?
      GROUP BY c.case_id, c.case_number, c.person_id
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Get single case error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create case
router.post('/', allowRoles('admin', 'jmo', 'doctor', 'clerical'), async (req, res) => {
  const validationError = validateCase(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  let connection;
  try {
    const { patient_id, case_type, incident_date, incident_location, police_station, description, assigned_staff_id, status } = req.body;
    
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Resolve CaseType
    let [caseTypeRows] = await connection.query('SELECT case_type_id FROM CaseType WHERE type_name = ?', [case_type]);
    let case_type_id;
    if (caseTypeRows.length === 0) {
      const [insertType] = await connection.query('INSERT INTO CaseType (type_name) VALUES (?)', [case_type]);
      case_type_id = insertType.insertId;
    } else {
      case_type_id = caseTypeRows[0].case_type_id;
    }

    // 2. Resolve CaseStatus
    const targetStatus = status || 'Pending';
    let [caseStatusRows] = await connection.query('SELECT case_status_id FROM CaseStatus WHERE status_name = ?', [targetStatus]);
    let case_status_id;
    if (caseStatusRows.length === 0) {
      const [insertStatus] = await connection.query('INSERT INTO CaseStatus (status_name) VALUES (?)', [targetStatus]);
      case_status_id = insertStatus.insertId;
    } else {
      case_status_id = caseStatusRows[0].case_status_id;
    }

    // 3. Generate case_number
    const prefix = case_type === 'Autopsy' ? 'PM' : 'CLN';
    const case_number = `${prefix}-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;

    // 4. Insert MedicoLegalCase
    const [caseResult] = await connection.query(
      `INSERT INTO MedicoLegalCase (case_number, person_id, case_type_id, case_status_id, admission_date)
       VALUES (?, ?, ?, ?, ?)`,
      [case_number, patient_id, case_type_id, case_status_id, incident_date]
    );
    const case_id = caseResult.insertId;

    // 5. Insert Incident
    await connection.query(
      `INSERT INTO Incident (case_id, incident_date, location, incident_summary)
       VALUES (?, ?, ?, ?)`,
      [case_id, incident_date, incident_location || null, description || null]
    );

    // 6. Insert CaseReference (Police Station)
    if (police_station) {
      let [stationRows] = await connection.query('SELECT station_id FROM PoliceStation WHERE station_name = ?', [police_station]);
      let police_station_id;
      if (stationRows.length === 0) {
        const [insertStation] = await connection.query('INSERT INTO PoliceStation (station_name) VALUES (?)', [police_station]);
        police_station_id = insertStation.insertId;
      } else {
        police_station_id = stationRows[0].station_id;
      }
      
      await connection.query(
        'INSERT INTO CaseReference (case_id, police_station_id) VALUES (?, ?)',
        [case_id, police_station_id]
      );
    }

    // 7. Insert StaffCaseAssignment
    if (assigned_staff_id) {
      await connection.query(
        'INSERT INTO StaffCaseAssignment (case_id, staff_id, assigned_date, responsibility) VALUES (?, ?, NOW(), "Assigned Doctor")',
        [case_id, assigned_staff_id]
      );
    }

    await connection.commit();
    res.status(201).json({ case_id, case_number });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Create case error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A case with this number already exists' });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({ message: 'Referenced patient or staff member does not exist' });
    }
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Update case
router.put('/:id', allowRoles('admin', 'jmo', 'doctor', 'clerical'), async (req, res) => {
  const caseId = req.params.id;
  const validationError = validateCase(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  let connection;
  try {
    const { patient_id, case_type, incident_date, incident_location, police_station, description, assigned_staff_id, status } = req.body;
    
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if the case exists
    const [existingCase] = await connection.query('SELECT case_id FROM MedicoLegalCase WHERE case_id = ?', [caseId]);
    if (existingCase.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Case not found' });
    }

    // 1. Resolve CaseType
    let [caseTypeRows] = await connection.query('SELECT case_type_id FROM CaseType WHERE type_name = ?', [case_type]);
    let case_type_id;
    if (caseTypeRows.length === 0) {
      const [insertType] = await connection.query('INSERT INTO CaseType (type_name) VALUES (?)', [case_type]);
      case_type_id = insertType.insertId;
    } else {
      case_type_id = caseTypeRows[0].case_type_id;
    }

    // 2. Resolve CaseStatus
    const targetStatus = status || 'Pending';
    let [caseStatusRows] = await connection.query('SELECT case_status_id FROM CaseStatus WHERE status_name = ?', [targetStatus]);
    let case_status_id;
    if (caseStatusRows.length === 0) {
      const [insertStatus] = await connection.query('INSERT INTO CaseStatus (status_name) VALUES (?)', [targetStatus]);
      case_status_id = insertStatus.insertId;
    } else {
      case_status_id = caseStatusRows[0].case_status_id;
    }

    // 3. Update MedicoLegalCase
    await connection.query(
      `UPDATE MedicoLegalCase 
       SET person_id = ?, case_type_id = ?, case_status_id = ?, admission_date = ?
       WHERE case_id = ?`,
      [patient_id, case_type_id, case_status_id, incident_date, caseId]
    );

    // 4. Update or Insert Incident
    const [existingIncident] = await connection.query('SELECT incident_id FROM Incident WHERE case_id = ?', [caseId]);
    if (existingIncident.length > 0) {
      await connection.query(
        `UPDATE Incident 
         SET incident_date = ?, location = ?, incident_summary = ? 
         WHERE case_id = ?`,
        [incident_date, incident_location || null, description || null, caseId]
      );
    } else {
      await connection.query(
        `INSERT INTO Incident (case_id, incident_date, location, incident_summary) 
         VALUES (?, ?, ?, ?)`,
        [caseId, incident_date, incident_location || null, description || null]
      );
    }

    // 5. Update or Insert CaseReference
    if (police_station) {
      let [stationRows] = await connection.query('SELECT station_id FROM PoliceStation WHERE station_name = ?', [police_station]);
      let police_station_id;
      if (stationRows.length === 0) {
        const [insertStation] = await connection.query('INSERT INTO PoliceStation (station_name) VALUES (?)', [police_station]);
        police_station_id = insertStation.insertId;
      } else {
        police_station_id = stationRows[0].station_id;
      }

      const [existingRef] = await connection.query('SELECT reference_id FROM CaseReference WHERE case_id = ?', [caseId]);
      if (existingRef.length > 0) {
        await connection.query(
          'UPDATE CaseReference SET police_station_id = ? WHERE case_id = ?',
          [police_station_id, caseId]
        );
      } else {
        await connection.query(
          'INSERT INTO CaseReference (case_id, police_station_id) VALUES (?, ?)',
          [caseId, police_station_id]
        );
      }
    } else {
      await connection.query(
        'UPDATE CaseReference SET police_station_id = NULL WHERE case_id = ?',
        [caseId]
      );
    }

    // 6. Update or replace StaffCaseAssignment
    await connection.query('DELETE FROM StaffCaseAssignment WHERE case_id = ?', [caseId]);
    if (assigned_staff_id) {
      await connection.query(
        'INSERT INTO StaffCaseAssignment (case_id, staff_id, assigned_date, responsibility) VALUES (?, ?, NOW(), "Assigned Doctor")',
        [caseId, assigned_staff_id]
      );
    }

    await connection.commit();
    res.json({ message: 'Case updated successfully' });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Update case error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A case conflict occurred' });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({ message: 'Referenced patient or staff member does not exist' });
    }
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Delete case
router.delete('/:id', allowRoles('admin'), async (req, res) => {
  let connection;
  try {
    const caseId = req.params.id;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if the case exists
    const [caseRows] = await connection.query('SELECT case_id FROM MedicoLegalCase WHERE case_id = ?', [caseId]);
    if (caseRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check for related records in dependent forensic tables
    const [[{ evidenceCount }]] = await connection.query('SELECT COUNT(*) AS evidenceCount FROM EvidenceItem WHERE case_id = ?', [caseId]);
    const [[{ reportCount }]] = await connection.query('SELECT COUNT(*) AS reportCount FROM CourtReport WHERE case_id = ?', [caseId]);
    const [[{ examCount }]] = await connection.query('SELECT COUNT(*) AS examCount FROM Examination WHERE case_id = ?', [caseId]);
    const [[{ pmCount }]] = await connection.query('SELECT COUNT(*) AS pmCount FROM Postmortem WHERE case_id = ?', [caseId]);

    if (evidenceCount > 0 || reportCount > 0 || examCount > 0 || pmCount > 0) {
      await connection.rollback();
      return res.status(409).json({ 
        message: 'Cannot delete case because it contains linked forensic evidence, court reports, or examinations.' 
      });
    }

    // Safely delete dependent metadata tables
    await connection.query('DELETE FROM Incident WHERE case_id = ?', [caseId]);
    await connection.query('DELETE FROM CaseReference WHERE case_id = ?', [caseId]);
    await connection.query('DELETE FROM StaffCaseAssignment WHERE case_id = ?', [caseId]);

    // Finally delete the case
    await connection.query('DELETE FROM MedicoLegalCase WHERE case_id = ?', [caseId]);

    await connection.commit();
    res.json({ message: 'Case deleted successfully' });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Delete case error:', err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ message: 'Cannot delete case due to database constraints' });
    }
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
