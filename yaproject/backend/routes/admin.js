import express from "express";
import db from "../db.js";
import { runMatching } from "../api/geminiMatcher.js";
import { runSchedules } from "../api/geminiSchedules.js";

const router = express.Router();

router.get("/mentors", (req, res) => {
    const query = `
      SELECT m.mentor_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS name
      FROM Mentors m
      JOIN Users u ON u.user_id = m.mentor_id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching mentors:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results); 
    });
  });
  
  router.get("/mentees", (req, res) => {
    const query = `
      SELECT m.mentee_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS name
      FROM Mentees m
      JOIN Users u ON u.user_id = m.mentee_id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching mentees:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  router.delete("/mentor/:id", (req, res) => {
    const mentorId = req.params.id;
  
    const deleteQuery = `DELETE FROM Users WHERE user_id = ?`;
  
    db.query(deleteQuery, [mentorId], (err, result) => {
      if (err) {
        console.error("Error deleting mentor:", err);
        return res.status(500).json({ error: err.message });
      }
  
      res.json({ message: "Mentor deleted successfully", deletedId: mentorId });
    });
  });
  
  router.delete("/mentee/:id", (req, res) => {
    const menteeId = req.params.id;
  
    const deleteQuery = `DELETE FROM Users WHERE user_id = ?`;
  
    db.query(deleteQuery, [menteeId], (err, result) => {
      if (err) {
        console.error("Error deleting mentee:", err);
        return res.status(500).json({ error: err.message });
      }
  
      res.json({ message: "Mentee deleted successfully", deletedId: menteeId });
    });
  });


  router.get("/manages", (req, res) => {
    const query = `
      SELECT 
        m.mentor_id,
        m.mentee_id,
        CONCAT(u1.first_name, ' ', u1.last_name) AS mentor_name,
        CONCAT(u2.first_name, ' ', u2.last_name) AS mentee_name
      FROM Manages m
      JOIN Users u1 ON m.mentor_id = u1.user_id
      JOIN Users u2 ON m.mentee_id = u2.user_id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching matched pairs:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  router.get("/matches", (req, res) => {
    const query = `
      SELECT
        mt.match_id   AS id,
        mt.mentor_id,
        mt.mentee_id,
        CONCAT(u1.first_name, ' ', u1.last_name) AS mentor,
        CONCAT(u2.first_name, ' ', u2.last_name) AS mentee,
        mt.success_rate AS successRate,
        mt.ai_model     AS model
      FROM Matches mt
      JOIN Users u1 ON mt.mentor_id = u1.user_id
      JOIN Users u2 ON mt.mentee_id = u2.user_id
      WHERE mt.match_approval_status = 'Pending'
      ORDER BY mt.match_date DESC
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching matches:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });


router.post("/acceptMatch", (req, res) => {
  const { match_id, mentor_id, mentee_id, admin_id } = req.body;

  const updateQuery = `UPDATE Matches SET match_approval_status = 'Approved' WHERE match_id = ?`;
  const insertManages = `INSERT INTO Manages (admin_id, mentor_id, mentee_id) VALUES (?, ?, ?)`;

  db.query(updateQuery, [match_id], (err1) => {
    if (err1) return res.status(500).json({ error: "Error updating match" });

    db.query(insertManages, [admin_id, mentor_id, mentee_id], async (err2) => {
      if (err2) return res.status(500).json({ error: "Error inserting into Manages" });

      // Fetch availability
      const availQuery = `
        SELECT 'Mentor' AS type, available_date 
        FROM Mentor_Availability 
        WHERE mentor_id = ?
        UNION ALL
        SELECT 'Mentee' AS type, available_date 
        FROM Mentee_Availability 
        WHERE mentee_id = ?
      `;


      db.query(availQuery, [mentor_id, mentee_id], async (err3, availRows) => {
        if (err3) return res.status(500).json({ error: "Error fetching availability" });

        const mentorAvail = availRows.filter(r => r.type === 'Mentor').map(r => r.available_date);
        const menteeAvail = availRows.filter(r => r.type === 'Mentee').map(r => r.available_date);

        try {
          const rawSuggestions = await runSchedules(mentorAvail, menteeAvail);
          const sessionSuggestions = JSON.parse(rawSuggestions);
          console.log(sessionSuggestions);
          const insertQuery = `
            INSERT INTO Sessions (mentor_id, mentee_id, duration, topics_covered, session_type, session_date, location, session_status)
            VALUES ?
          `;
          const values = sessionSuggestions.map(s => [
            mentor_id,
            mentee_id,
            s.duration,
            s.topics_covered,
            s.session_type,
            s.session_date,
            s.location,
            'Potential'
          ]);

          db.query(insertQuery, [values], (err4) => {
            if (err4) return res.status(500).json({ error: "Error inserting sessions" });
            res.status(200).json({ message: "Match accepted and sessions generated" });
          });

        } catch (aiErr) {
          console.error("Gemini error:", aiErr);
          res.status(500).json({ error: "AI session generation failed" });
        }
      });
    });
  });
});

router.post("/matches/:matchId/reject", (req, res) => {
  const matchId = req.params.matchId;

  // 1) Look up the old mentor & mentee
  db.query(
    `SELECT mentor_id, mentee_id, admin_id
       FROM Matches
      WHERE match_id = ?`,
    [matchId],
    (err, rows) => {
      if (err || rows.length === 0) {
        console.error(err);
        return res.status(404).json({ error: "Match not found" });
      }
      const { mentor_id, mentee_id, admin_id } = rows[0];

      // 2) Delete the old match
      db.query(
        `DELETE FROM Matches WHERE match_id = ?`,
        [matchId],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: "Could not delete match" });
          }

          // 3) Fetch mentee + availability
          const menteeSql = `
            SELECT m.mentee_id AS id, m.skills, m.academic_status, m.goals,
                   JSON_ARRAYAGG(ma.available_date) AS availability
              FROM Mentees m
         LEFT JOIN Mentee_Availability ma ON m.mentee_id = ma.mentee_id
             WHERE m.mentee_id = ?
             GROUP BY m.mentee_id
          `;
          db.query(menteeSql, [mentee_id], (err3, menteeRows) => {
            if (err3 || menteeRows.length === 0) {
              console.error(err3);
              return res.status(500).json({ error: "Could not fetch mentee" });
            }
            const mentee = {
              ...menteeRows[0],
              availability: JSON.parse(menteeRows[0].availability),
            };

            // 4) Fetch all *other* active mentors
            const mentorSql = `
              SELECT t.*, JSON_ARRAYAGG(ma.available_date) AS availability
                FROM (
                      SELECT mentor_id AS id, skills, academic_background,
                             active_status, date_joined, mentee_assigned_count
                        FROM Mentors
                       WHERE active_status = TRUE
                         AND mentor_id != ?
                     ) AS t
           LEFT JOIN Mentor_Availability ma ON t.id = ma.mentor_id
               GROUP BY t.id
            `;
            db.query(mentorSql, [mentor_id], (err4, mentorRows) => {
              if (err4) {
                console.error(err4);
                return res.status(500).json({ error: "Could not fetch mentors" });
              }
              const mentors = mentorRows.map(r => ({
                ...r,
                availability: JSON.parse(r.availability),
              }));

              // 5) Call Gemini AI (no promise style for DB; this is our one async)
              runMatching(mentee, mentors)
                .then(aiOutput => {
                  const match = JSON.parse(aiOutput);

                  // 6) Insert the *new* match
                  const insertSql = `
                    INSERT INTO Matches
                      (mentor_id, mentee_id, admin_id,
                       ai_model, match_date, success_rate, match_approval_status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                  `;
                  const vals = [
                    match.mentor_id, match.mentee_id, admin_id,
                    match.ai_model, match.match_date,
                    match.success_rate, match.match_approval_status
                  ];
                  db.query(insertSql, vals, (err5, result) => {
                    if (err5) {
                      console.error(err5);
                      return res.status(500).json({ error: "Could not insert new match" });
                    }

                    // 7) Fetch & return the newly inserted match row
                    const fetchSql = `
                      SELECT
                        mt.match_id AS id,
                        CONCAT(u1.first_name,' ',u1.last_name) AS mentor,
                        CONCAT(u2.first_name,' ',u2.last_name) AS mentee,
                        mt.success_rate AS successRate,
                        mt.ai_model AS model
                      FROM Matches mt
                      JOIN Users u1 ON mt.mentor_id = u1.user_id
                      JOIN Users u2 ON mt.mentee_id = u2.user_id
                     WHERE mt.match_id = ?
                    `;
                    db.query(fetchSql, [result.insertId], (err6, newRows) => {
                      if (err6 || newRows.length === 0) {
                        console.error(err6);
                        return res.status(500).json({ error: "Could not fetch new match" });
                      }
                      res.json({ newMatch: newRows[0] });
                    });
                  });
                })
                .catch(aiErr => {
                  console.error("AI error:", aiErr);
                  res.status(500).json({ error: "AI matching failed" });
                });
            });
          });
        }
      );
    }
  );
});

  

  
  
  

export default router;
