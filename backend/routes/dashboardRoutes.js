import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [[{ totalPatients }]] = await pool.query('SELECT COUNT(*) AS totalPatients FROM Person');
    const [[{ totalCases }]] = await pool.query('SELECT COUNT(*) AS totalCases FROM MedicoLegalCase');
    
    const [[{ pendingCases }]] = await pool.query(`
      SELECT COUNT(*) AS pendingCases 
      FROM MedicoLegalCase c 
      JOIN CaseStatus cs ON c.case_status_id = cs.case_status_id 
      WHERE LOWER(cs.status_name) = 'pending'
    `);
    
    const [[{ inProgressCases }]] = await pool.query(`
      SELECT COUNT(*) AS inProgressCases 
      FROM MedicoLegalCase c 
      JOIN CaseStatus cs ON c.case_status_id = cs.case_status_id 
      WHERE LOWER(cs.status_name) = 'in progress'
    `);
    
    const [[{ completedCases }]] = await pool.query(`
      SELECT COUNT(*) AS completedCases 
      FROM MedicoLegalCase c 
      JOIN CaseStatus cs ON c.case_status_id = cs.case_status_id 
      WHERE LOWER(cs.status_name) = 'completed'
    `);
    
    const [[{ urgentCases }]] = await pool.query(`
      SELECT COUNT(*) AS urgentCases 
      FROM MedicoLegalCase c 
      JOIN CaseStatus cs ON c.case_status_id = cs.case_status_id 
      WHERE LOWER(cs.status_name) = 'urgent'
    `);
    
    const [[{ totalAutopsies }]] = await pool.query(`
      SELECT COUNT(*) AS totalAutopsies 
      FROM MedicoLegalCase c 
      JOIN CaseType ct ON c.case_type_id = ct.case_type_id 
      WHERE LOWER(ct.type_name) = 'autopsy'
    `);
    
    const [[{ totalClinical }]] = await pool.query(`
      SELECT COUNT(*) AS totalClinical 
      FROM MedicoLegalCase c 
      JOIN CaseType ct ON c.case_type_id = ct.case_type_id 
      WHERE LOWER(ct.type_name) = 'clinical'
    `);
    
    const [[{ totalEvidence }]] = await pool.query('SELECT COUNT(*) AS totalEvidence FROM EvidenceItem');
    const [[{ totalReports }]] = await pool.query('SELECT COUNT(*) AS totalReports FROM CourtReport');
    
    const [[{ pendingReports }]] = await pool.query(`
      SELECT COUNT(*) AS pendingReports 
      FROM CourtReport cr 
      JOIN ReportStatus rs ON cr.report_status_id = rs.report_status_id 
      WHERE LOWER(rs.status_name) IN ('draft', 'pending')
    `);
    
    const [[{ totalStaff }]] = await pool.query('SELECT COUNT(*) AS totalStaff FROM Staff');

    // Recent cases
    const [recentCases] = await pool.query(`
      SELECT 
        c.case_number, 
        MAX(ct.type_name) AS case_type, 
        MAX(cs.status_name) AS status, 
        MAX(i.incident_date) AS incident_date,
        MAX(p.full_name) AS patient_name, 
        MIN(s.full_name) AS assigned_staff_name
      FROM MedicoLegalCase c
      LEFT JOIN CaseType ct ON c.case_type_id = ct.case_type_id
      LEFT JOIN CaseStatus cs ON c.case_status_id = cs.case_status_id
      LEFT JOIN Person p ON c.person_id = p.person_id
      LEFT JOIN Incident i ON c.case_id = i.case_id
      LEFT JOIN StaffCaseAssignment sca ON c.case_id = sca.case_id
      LEFT JOIN Staff s ON sca.staff_id = s.staff_id
      GROUP BY c.case_id, c.case_number
      ORDER BY c.case_id DESC 
      LIMIT 5
    `);

    // Monthly case count for charts
    const [monthlyCases] = await pool.query(`
      SELECT 
        DATE_FORMAT(c.admission_date, '%Y-%m') AS month,
        ct.type_name AS case_type,
        COUNT(*) AS count
      FROM MedicoLegalCase c
      JOIN CaseType ct ON c.case_type_id = ct.case_type_id
      GROUP BY month, ct.type_name
      ORDER BY month DESC
      LIMIT 12
    `);

    res.json({
      totalPatients: totalPatients || 0,
      totalCases: totalCases || 0,
      pendingCases: pendingCases || 0,
      inProgressCases: inProgressCases || 0,
      completedCases: completedCases || 0,
      urgentCases: urgentCases || 0,
      totalAutopsies: totalAutopsies || 0,
      totalClinical: totalClinical || 0,
      totalEvidence: totalEvidence || 0,
      totalReports: totalReports || 0,
      pendingReports: pendingReports || 0,
      totalStaff: totalStaff || 0,
      recentCases: recentCases || [],
      monthlyCases: monthlyCases || []
    });
  } catch (err) {
    console.error('Get dashboard stats error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
