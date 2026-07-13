import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';

const router = express.Router();

/**
 * The normalized Person table stores date_of_birth instead of age.
 *
 * For compatibility with the current frontend, this function converts an
 * age into an approximate date of birth when date_of_birth is not supplied.
 */
function resolveDateOfBirth(dateOfBirth, age) {
  if (dateOfBirth) {
    return dateOfBirth;
  }

  const numericAge = Number(age);

  if (
    !Number.isInteger(numericAge) ||
    numericAge < 0 ||
    numericAge > 130
  ) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  return `${currentYear - numericAge}-01-01`;
}

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        person_id AS patient_id,
        full_name,
        nic_passport AS nic,
        DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth,
        TIMESTAMPDIFF(
          YEAR,
          date_of_birth,
          CURDATE()
        ) AS age,
        gender,
        address,
        phone AS contact_no,
        hospital_bht,
        ward
      FROM Person
      ORDER BY person_id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Get patients error:', err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// Get one patient
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        person_id AS patient_id,
        full_name,
        nic_passport AS nic,
        DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth,
        TIMESTAMPDIFF(
          YEAR,
          date_of_birth,
          CURDATE()
        ) AS age,
        gender,
        address,
        phone AS contact_no,
        hospital_bht,
        ward
      FROM Person
      WHERE person_id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Patient not found',
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get patient error:', err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// Add patient
router.post('/', allowRoles('admin', 'jmo', 'doctor', 'clerical'), async (req, res) => {
  try {
    const {
      full_name,
      nic,
      age,
      date_of_birth,
      gender,
      address,
      contact_no,
      hospital_bht,
      ward,
    } = req.body;

    const resolvedDateOfBirth = resolveDateOfBirth(
      date_of_birth,
      age
    );

    if (!full_name || !gender || !resolvedDateOfBirth) {
      return res.status(400).json({
        message:
          'Name, gender, and a valid date of birth or age are required',
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO Person (
        full_name,
        nic_passport,
        date_of_birth,
        gender,
        address,
        phone,
        hospital_bht,
        ward
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        full_name,
        nic || null,
        resolvedDateOfBirth,
        gender,
        address || null,
        contact_no || null,
        hospital_bht || null,
        ward || null,
      ]
    );

    res.status(201).json({
      patient_id: result.insertId,
      message: 'Patient registered successfully',
    });
  } catch (err) {
    console.error('Add patient error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message:
          'A patient with this NIC or hospital BHT number already exists',
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
});

// Update patient
router.put('/:id', allowRoles('admin', 'jmo', 'doctor', 'clerical'), async (req, res) => {
  try {
    const {
      full_name,
      nic,
      age,
      date_of_birth,
      gender,
      address,
      contact_no,
      hospital_bht,
      ward,
    } = req.body;

    const resolvedDateOfBirth = resolveDateOfBirth(
      date_of_birth,
      age
    );

    if (!full_name || !gender || !resolvedDateOfBirth) {
      return res.status(400).json({
        message:
          'Name, gender, and a valid date of birth or age are required',
      });
    }

    const [result] = await pool.query(
      `
      UPDATE Person
      SET
        full_name = ?,
        nic_passport = ?,
        date_of_birth = ?,
        gender = ?,
        address = ?,
        phone = ?,
        hospital_bht = ?,
        ward = ?
      WHERE person_id = ?
      `,
      [
        full_name,
        nic || null,
        resolvedDateOfBirth,
        gender,
        address || null,
        contact_no || null,
        hospital_bht || null,
        ward || null,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Patient not found',
      });
    }

    res.json({
      message: 'Patient updated successfully',
    });
  } catch (err) {
    console.error('Update patient error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message:
          'A patient with this NIC or hospital BHT number already exists',
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
});

// Delete patient
router.delete('/:id', allowRoles('admin'), async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Person WHERE person_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Patient not found',
      });
    }

    res.json({
      message: 'Patient deleted successfully',
    });
  } catch (err) {
    console.error('Delete patient error:', err);

    if (
      err.code === 'ER_ROW_IS_REFERENCED_2' ||
      err.code === 'ER_ROW_IS_REFERENCED'
    ) {
      return res.status(409).json({
        message: 'Cannot delete a patient linked to existing cases',
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;