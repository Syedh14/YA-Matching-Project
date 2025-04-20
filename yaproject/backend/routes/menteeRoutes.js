import express from 'express';
import db from '../db.js';
const router = express.Router();

// GET /api/mentees
router.get('/mentees', async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        `SELECT user_id AS id,
                CONCAT(first_name, ' ', last_name) AS name
           FROM Users
          WHERE role = 'mentee'`
      );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching mentees:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
