import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = express.Router();

/**
 * Ensures that basic seed roles and departments exist in the database.
 * This is helpful for initial installations or empty databases.
 */
async function ensureRolesExist(connection) {
  // Check UserRole
  const [roles] = await connection.query('SELECT * FROM UserRole');
  if (roles.length === 0) {
    const defaultRoles = [
      { role_name: 'admin', permission_level: 10 },
      { role_name: 'jmo', permission_level: 5 },
      { role_name: 'doctor', permission_level: 4 },
      { role_name: 'lab', permission_level: 3 },
      { role_name: 'clerical', permission_level: 2 },
      { role_name: 'research', permission_level: 1 },
    ];
    for (const r of defaultRoles) {
      await connection.query('INSERT INTO UserRole (role_name, permission_level) VALUES (?, ?)', [r.role_name, r.permission_level]);
    }
  }

  // Check StaffRole
  const [staffRoles] = await connection.query('SELECT * FROM StaffRole');
  if (staffRoles.length === 0) {
    const defaultStaffRoles = [
      { role_name: 'Admin', description: 'System Administrator' },
      { role_name: 'JMO', description: 'Judicial Medical Officer' },
      { role_name: 'Doctor', description: 'Medical Officer / Doctor' },
      { role_name: 'Laboratory Staff', description: 'Lab Technician' },
      { role_name: 'Clerical Officer', description: 'Clerical Staff' },
      { role_name: 'Research User', description: 'Researcher' },
    ];
    for (const sr of defaultStaffRoles) {
      await connection.query('INSERT INTO StaffRole (role_name, description) VALUES (?, ?)', [sr.role_name, sr.description]);
    }
  }

  // Check Department
  const [depts] = await connection.query('SELECT * FROM Department');
  if (depts.length === 0) {
    await connection.query('INSERT INTO Department (department_name, office_location) VALUES (?, ?)', ['Forensic Medicine', 'Judicial Medical Unit']);
  }
}

// Login
router.post('/login', async (req, res) => {
  let connection;
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password and role are required' });
    }

    connection = await pool.getConnection();
    await ensureRolesExist(connection);

    // Query UserAccount and join UserRole and Staff
    const [rows] = await connection.query(
      `
      SELECT 
        ua.user_id,
        ua.staff_id,
        ua.username,
        ua.password_hash,
        ua.is_active,
        ur.role_name AS user_role,
        ur.permission_level,
        s.full_name
      FROM UserAccount ua
      JOIN UserRole ur ON ua.user_role_id = ur.user_role_id
      LEFT JOIN Staff s ON ua.staff_id = s.staff_id
      WHERE ua.username = ? AND ur.role_name = ?
      `,
      [username, role]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Verify password hash
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.user_id, 
        username: user.username, 
        role: user.user_role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Insert login audit log
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    await connection.query(
      'INSERT INTO AuditLog (user_id, action_type, target_table, ip_address) VALUES (?, ?, ?, ?)',
      [user.user_id, 'LOGIN', 'UserAccount', ipAddress]
    );

    // Return frontend compatible fields
    res.json({
      token,
      user: {
        id: user.user_id,
        user_id: user.user_id,
        staff_id: user.staff_id,
        username: user.username,
        role: user.user_role,
        user_role: user.user_role,
        fullName: user.full_name,
        full_name: user.full_name,
        permission_level: user.permission_level
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Signup
router.post('/signup', async (req, res) => {
  let connection;
  try {
    const { fullName, email, phone, role, username, password } = req.body;
    if (!fullName || !username || !password || !role) {
      return res.status(400).json({ message: 'Full name, username, password and role are required' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Ensure roles/departments are seeded
    await ensureRolesExist(connection);

    // Check if username already exists
    const [existing] = await connection.query('SELECT user_id FROM UserAccount WHERE username = ?', [username]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Look up the staff_role_id
    const staffRoleMap = {
      jmo: 'JMO',
      doctor: 'Doctor',
      lab: 'Laboratory Staff',
      clerical: 'Clerical Officer',
      research: 'Research User',
      admin: 'Admin'
    };
    const targetStaffRole = staffRoleMap[role] || 'Clerical Officer';
    const [staffRoleRows] = await connection.query('SELECT staff_role_id FROM StaffRole WHERE role_name = ?', [targetStaffRole]);
    if (staffRoleRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid staff role' });
    }
    const staff_role_id = staffRoleRows[0].staff_role_id;

    // Look up default department_id (first department)
    const [deptRows] = await connection.query('SELECT department_id FROM Department LIMIT 1');
    if (deptRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'No department configured' });
    }
    const department_id = deptRows[0].department_id;

    // Create staff entry
    const [staffResult] = await connection.query(
      'INSERT INTO Staff(full_name, department_id, staff_role_id, phone) VALUES(?,?,?,?)',
      [fullName, department_id, staff_role_id, phone || null]
    );

    // Look up user_role_id
    const roleMap = {
      jmo: 'jmo',
      doctor: 'doctor',
      lab: 'lab',
      clerical: 'clerical',
      research: 'research',
      admin: 'admin'
    };
    const targetUserRole = roleMap[role] || 'clerical';
    const [userRoleRows] = await connection.query('SELECT user_role_id FROM UserRole WHERE role_name = ?', [targetUserRole]);
    if (userRoleRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid user role' });
    }
    const user_role_id = userRoleRows[0].user_role_id;

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create UserAccount entry
    const [userResult] = await connection.query(
      'INSERT INTO UserAccount(staff_id, user_role_id, username, password_hash, is_active) VALUES(?,?,?,?,1)',
      [staffResult.insertId, user_role_id, username, password_hash]
    );

    await connection.commit();
    res.status(201).json({ message: 'Account created successfully', userId: userResult.insertId });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Signup error:', err);
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
