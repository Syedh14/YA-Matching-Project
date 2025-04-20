import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET: all reports for a mentor (most recent first)
router.get('/mentor/:mentorId', (req, res) => {
  const { mentorId } = req.params;

  db.query(
    `SELECT * 
     FROM Progress_Reports 
     WHERE mentor_id = ? 
     ORDER BY date_created DESC`,
    [mentorId],
    (err, rows) => {
      if (err) {
        console.error('❌ Error fetching mentor reports:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(rows);
    }
  );
});


// GET: all reports for a mentee (most recent first)
router.get('/mentee/:menteeId', (req, res) => {
  const { menteeId } = req.params;

  const query = `
    SELECT * 
    FROM Progress_Reports 
    WHERE mentee_id = ? 
    ORDER BY date_created DESC
  `;

  db.query(query, [menteeId], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching mentee reports:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json(rows);
  });
});


// POST: create a new progress report
router.post('/', async (req, res) => {
  // assume you stored the logged‐in mentor's ID in the session
  const mentorId = req.session.user?.user_id;
  const { menteeId, areasOfImprovement, skillsImproved, challenges } = req.body;

  if (!mentorId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // insert the new report
    const [result] = await db
      .promise()
      .query(
        `INSERT INTO Progress_Reports
          (mentor_id, mentee_id, areas_of_improvement, skills_improved, challenges)
         VALUES (?,       ?,          ?,                      ?,               ?)`,
        [mentorId, menteeId, areasOfImprovement, skillsImproved, challenges]
      );

    // fetch and return the newly created row
    const [newRows] = await db
      .promise()
      .query(
        `SELECT * 
           FROM Progress_Reports 
          WHERE report_id = ?`,
        [result.insertId]
      );

    res.status(201).json(newRows[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
