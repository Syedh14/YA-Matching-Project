import express from 'express';
import db from '../db.js';

const router = express.Router();


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
        console.error('Error fetching mentor reports:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(rows);
    }
  );
});



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
      console.error('Error fetching mentee reports:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json(rows);
  });
});


router.get('/mentor/:mentorId/mentees', (req, res) => {
  const { mentorId } = req.params;
  const sql = `
    SELECT
      m.mentee_id AS id,
      CONCAT(u.first_name, ' ', u.last_name) AS name
    FROM Manages AS m
    JOIN Users   AS u
      ON u.user_id = m.mentee_id
    WHERE m.mentor_id = ?
  `;
  db.query(sql, [mentorId], (err, rows) => {
    if (err) {
      console.error('Error fetching assigned mentees:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});



router.post('/', (req, res) => {
  
  const mentorId = req.session.userId;
  const { menteeId, areasOfImprovement, skillsImproved, challenges } = req.body;

  if (!mentorId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  
  const insertSql = `
    INSERT INTO Progress_Reports
      (mentor_id, mentee_id, areas_of_improvement, skills_improved, challenges)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    insertSql,
    [mentorId, menteeId, areasOfImprovement, skillsImproved, challenges],
    (err, result) => {
      if (err) {
        console.error('Error inserting report:', err);
        return res.status(500).json({ error: err.message });
      }

      const newId = result.insertId;

      
      const selectSql = `
        SELECT *
        FROM Progress_Reports
        WHERE report_id = ?
      `;
      db.query(selectSql, [newId], (err2, rows) => {
        if (err2) {
          console.error('Error fetching new report:', err2);
          return res.status(500).json({ error: err2.message });
        }

        if (!rows.length) {
          return res.status(500).json({ error: 'Inserted, but not found.' });
        }

        
        res.status(201).json(rows[0]);
      });
    }
  );
});


export default router;
