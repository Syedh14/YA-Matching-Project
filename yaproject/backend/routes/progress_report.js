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

// // GET: all mentees (for the dropdown)
// router.get('/mentees', (req, res) => {
//   db.query(
//     `SELECT user_id AS id,
//             CONCAT(first_name, ' ', last_name) AS name
//        FROM Users
//       WHERE role = 'mentee'`,
//     (err, rows) => {
//       if (err) {
//         console.error('❌ Error fetching mentees:', err);
//         return res.status(500).json({ error: 'Server error' });
//       }
//       res.json(rows);
//     }
//   );
// });

// GET: only the mentees I (the mentor) have reports for
router.get('/mentor/:mentorId/mentees', (req, res) => {
  const { mentorId } = req.params;

  const sql = `
    SELECT DISTINCT
      pr.mentee_id AS id,
      CONCAT(u.first_name, ' ', u.last_name) AS name
    FROM Progress_Reports AS pr
    JOIN Users             AS u
      ON u.user_id = pr.mentee_id
    WHERE pr.mentor_id = ?
  `;

  db.query(sql, [mentorId], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching mentees for mentor:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});




// // POST: create a new progress report
// router.post('/', async (req, res) => {
//   // assume you stored the logged‐in mentor's ID in the session
//   const mentorId = req.session.userId;
//   const { menteeId, areasOfImprovement, skillsImproved, challenges } = req.body;

//   if (!mentorId) {
//     return res.status(401).json({ error: 'Not authenticated' });
//   }

//   try {
//     // insert the new report
//     const [result] = await db
//       .promise()
//       .query(
//         `INSERT INTO Progress_Reports
//           (mentor_id, mentee_id, areas_of_improvement, skills_improved, challenges)
//          VALUES (?,       ?,          ?,                      ?,               ?)`,
//         [mentorId, menteeId, areasOfImprovement, skillsImproved, challenges]
//       );

//     // fetch and return the newly created row
//     const [newRows] = await db
//       .promise()
//       .query(
//         `SELECT * 
//            FROM Progress_Reports 
//           WHERE report_id = ?`,
//         [result.insertId]
//       );

//     res.status(201).json(newRows[0]);
//   } catch (error) {
//     console.error('Error creating report:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// POST: create a new progress report
router.post('/', (req, res) => {
  // use the same session key you set in auth.js
  const mentorId = req.session.userId;
  const { menteeId, areasOfImprovement, skillsImproved, challenges } = req.body;

  if (!mentorId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // 1) Insert the new report
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
        console.error('🔥 Error inserting report:', err);
        return res.status(500).json({ error: err.message });
      }

      const newId = result.insertId;

      // 2) Fetch back the newly created row
      const selectSql = `
        SELECT *
        FROM Progress_Reports
        WHERE report_id = ?
      `;
      db.query(selectSql, [newId], (err2, rows) => {
        if (err2) {
          console.error('🔥 Error fetching new report:', err2);
          return res.status(500).json({ error: err2.message });
        }

        if (!rows.length) {
          return res.status(500).json({ error: 'Inserted, but not found.' });
        }

        // 3) Return the created report
        res.status(201).json(rows[0]);
      });
    }
  );
});


export default router;
