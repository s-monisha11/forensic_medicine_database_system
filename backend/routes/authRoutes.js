import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).json({ message: 'Username, password and role are required' });
    const [rows] = await pool.query('SELECT * FROM users WHERE username=? AND user_role=? AND is_active=1', [username, role]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid login details' });
    const ok = user.password_hash.startsWith('$plain$')
      ? password === user.password_hash.replace('$plain$', '')
      : await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid login details' });
    const token = jwt.sign(
      { id: user.user_id, username: user.username, role: user.user_role },
      process.env.JWT_SECRET || 'demo_secret',
      { expiresIn: '8h' }
    );
    await pool.query(
      'INSERT INTO audit_logs(user_id, action, table_name, record_id, details) VALUES(?,?,?,?,?)',
      [user.user_id, 'LOGIN', 'users', user.user_id, 'User logged in']
    );
    res.json({ token, user: { id: user.user_id, username: user.username, role: user.user_role, fullName: user.full_name } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, role, username, password } = req.body;
    if (!fullName || !username || !password || !role) {
      return res.status(400).json({ message: 'Full name, username, password and role are required' });
    }
    // Check if username already exists
    const [existing] = await pool.query('SELECT user_id FROM users WHERE username=?', [username]);
    if (existing.length > 0) return res.status(409).json({ message: 'Username already exists' });

    const password_hash = await bcrypt.hash(password, 10);

    // Map frontend role to DB role
    const roleMap = { jmo: 'jmo', doctor: 'doctor', clerical: 'clerical', research: 'research', admin: 'admin' };
    const dbRole = roleMap[role] || 'clerical';

    // Map to staff role enum
    const staffRoleMap = { jmo: 'JMO', doctor: 'Doctor', clerical: 'Clerical Officer', research: 'Research User', admin: 'Admin' };
    const staffRole = staffRoleMap[role] || 'Clerical Officer';

    // Create staff entry
    const [staffResult] = await pool.query(
      'INSERT INTO staff(full_name, role, contact_no, email) VALUES(?,?,?,?)',
      [fullName, staffRole, phone || null, email || null]
    );

    // Create user entry
    const [userResult] = await pool.query(
      'INSERT INTO users(staff_id, username, password_hash, full_name, user_role) VALUES(?,?,?,?,?)',
      [staffResult.insertId, username, password_hash, fullName, dbRole]
    );

    res.status(201).json({ message: 'Account created successfully', userId: userResult.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
