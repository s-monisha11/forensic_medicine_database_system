import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [[{ totalPatients }]] = await pool.query('SELECT COUNT(*) AS totalPatients FROM patients');
    const [[{ totalCases }]] = await pool.query('SELECT COUNT(*) AS totalCases FROM medico_legal_cases');
    const [[{ pendingCases }]] = await pool.query("SELECT COUNT(*) AS pendingCases FROM medico_legal_cases WHERE status='Pending'");
    const [[{ inProgressCases }]] = await pool.query("SELECT COUNT(*) AS inProgressCases FROM medico_legal_cases WHERE status='In Progress'");
    const [[{ completedCases }]] = await pool.query("SELECT COUNT(*) AS completedCases FROM medico_legal_cases WHERE status='Completed'");
    const [[{ urgentCases }]] = await pool.query("SELECT COUNT(*) AS urgentCases FROM medico_legal_cases WHERE status='Urgent'");
    const [[{ totalAutopsies }]] = await pool.query("SELECT COUNT(*) AS totalAutopsies FROM medico_legal_cases WHERE case_type='Autopsy'");
    const [[{ totalClinical }]] = await pool.query("SELECT COUNT(*) AS totalClinical FROM medico_legal_cases WHERE case_type='Clinical'");
    const [[{ totalEvidence }]] = await pool.query('SELECT COUNT(*) AS totalEvidence FROM evidence');
    const [[{ totalReports }]] = await pool.query('SELECT COUNT(*) AS totalReports FROM court_reports');
    const [[{ pendingReports }]] = await pool.query("SELECT COUNT(*) AS pendingReports FROM court_reports WHERE status IN ('Draft','Pending')");
    const [[{ totalStaff }]] = await pool.query('SELECT COUNT(*) AS totalStaff FROM staff');

    // Recent cases
    const [recentCases] = await pool.query(`
      SELECT c.case_number, c.case_type, c.status, c.incident_date,
             p.full_name AS patient_name, s.full_name AS assigned_staff_name
      FROM medico_legal_cases c
      LEFT JOIN patients p ON c.patient_id=p.patient_id
      LEFT JOIN staff s ON c.assigned_staff_id=s.staff_id
      ORDER BY c.case_id DESC LIMIT 5
    `);

    // Monthly case count for charts
    const [monthlyCases] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
             case_type,
             COUNT(*) AS count
      FROM medico_legal_cases
      GROUP BY month, case_type
      ORDER BY month DESC
      LIMIT 12
    `);

    res.json({
      totalPatients, totalCases, pendingCases, inProgressCases, completedCases, urgentCases,
      totalAutopsies, totalClinical, totalEvidence, totalReports, pendingReports, totalStaff,
      recentCases, monthlyCases
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
