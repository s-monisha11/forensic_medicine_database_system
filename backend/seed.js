import { pool } from './db.js';

export async function seedDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Seeding lookup tables if empty...');

    // UserRole
    await connection.query(`
      INSERT IGNORE INTO UserRole (user_role_id, role_name, permission_level) VALUES
      (1, 'admin', 10), (2, 'jmo', 5), (3, 'doctor', 4), (4, 'lab', 3), (5, 'clerical', 2), (6, 'research', 1)
    `);

    // StaffRole
    await connection.query(`
      INSERT IGNORE INTO StaffRole (staff_role_id, role_name, description) VALUES
      (1, 'Admin', 'System Administrator'),
      (2, 'JMO', 'Judicial Medical Officer'),
      (3, 'Doctor', 'Medical Officer / Doctor'),
      (4, 'Laboratory Staff', 'Laboratory Technician / Staff'),
      (5, 'Clerical Officer', 'Clerical Officer'),
      (6, 'Research User', 'Research User / Analyst')
    `);

    // Department
    await connection.query(`
      INSERT IGNORE INTO Department (department_id, department_name, office_location) VALUES
      (1, 'Forensic Medicine', 'Judicial Medical Unit')
    `);

    // CaseType
    await connection.query(`
      INSERT IGNORE INTO CaseType (case_type_id, type_name, description) VALUES
      (1, 'Autopsy', 'Postmortem Autopsy Examination'),
      (2, 'Clinical', 'Clinical Medico-Legal Examination')
    `);

    // CaseStatus
    await connection.query(`
      INSERT IGNORE INTO CaseStatus (case_status_id, status_name, description) VALUES
      (1, 'Pending', 'Case registered and pending assignment or action'),
      (2, 'In Progress', 'Investigation or examination in progress'),
      (3, 'Completed', 'Case completed and report submitted'),
      (4, 'Urgent', 'Urgent case requiring immediate attention')
    `);

    // EvidenceType
    await connection.query(`
      INSERT IGNORE INTO EvidenceType (evidence_type_id, type_name, description) VALUES
      (1, 'Blood sample', 'Blood sample'),
      (2, 'Clothing', 'Clothing items'),
      (3, 'Biological Sample', 'Tissue or other biological samples'),
      (4, 'Physical Evidence', 'Weapons or physical objects'),
      (5, 'Documents', 'Medical and other documents'),
      (6, 'Photographic', 'Photographs and digital media')
    `);

    // ReportType
    await connection.query(`
      INSERT IGNORE INTO ReportType (report_type_id, type_name, description) VALUES
      (1, 'Clinical Examination', 'Clinical Examination Report'),
      (2, 'Postmortem', 'Postmortem Report'),
      (3, 'Laboratory', 'Laboratory Analysis Report'),
      (4, 'Court Submission', 'Submission to Court'),
      (5, 'Medico-Legal', 'Medico-Legal Report')
    `);

    // ReportStatus
    await connection.query(`
      INSERT IGNORE INTO ReportStatus (report_status_id, status_name, description) VALUES
      (1, 'Draft', 'Draft version of the report'),
      (2, 'Pending', 'Report pending approval or completion'),
      (3, 'Submitted', 'Report submitted to court'),
      (4, 'Approved', 'Report approved by authority'),
      (5, 'Rejected', 'Report rejected or returned for review')
    `);

    console.log('Lookup tables seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    if (connection) connection.release();
  }
}
