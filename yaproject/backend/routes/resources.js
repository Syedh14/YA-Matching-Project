import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /resources
// ↳ Fetch all resources (only for authenticated users)
router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const sql = `
    SELECT 
        r.resource_id,
        r.user_id,
        r.title,
        r.description,
        r.resource_type,
        r.url,
        r.upload_date,
        u.role AS creator_role
    FROM Resources r
    JOIN Users u ON r.user_id = u.user_id
    ORDER BY r.upload_date DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Resources fetch error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /resources
// ↳ Add a new resource (only for authenticated users)
router.post('/', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { title, description, resource_type, url } = req.body;
  const userId = req.session.userId;

  const insertSql = `
    INSERT INTO Resources 
      (user_id, title, description, resource_type, url)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [userId, title, description, resource_type, url];
  db.query(insertSql, params, (err, result) => {
    if (err) {
      console.error("Resource insert error:", err);
      return res.status(500).json({ error: err.message });
    }
    // Fetch and return the newly created resource
    const newId = result.insertId;
    db.query(
      `SELECT resource_id, user_id, title, description, resource_type, url, upload_date 
       FROM Resources WHERE resource_id = ?`,
      [newId],
      (err2, rows) => {
        if (err2) {
          console.error("Fetch new resource error:", err2);
          return res.status(500).json({ error: err2.message });
        }
        res.status(201).json(rows[0]);
      }
    );
  });
});

export default router;
