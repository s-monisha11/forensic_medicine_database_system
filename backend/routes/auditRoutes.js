import express from 'express';
import { pool } from '../db.js';
import { allowRoles } from '../middleware.js';

const router = express.Router();
router.get('/', allowRoles('admin'), async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  const [rows] = await pool.query(
    `SELECT a.*, u.username FROM audit_logs a LEFT JOIN users u ON u.user_id=a.user_id
     ORDER BY a.created_at DESC LIMIT ?`, [limit]
  );
  res.json(rows);
});
export default router;
