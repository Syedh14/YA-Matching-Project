import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all sessions for a specific mentor, separated by status
router.get('/mentorSessions/:mentorId', (req, res) => {
  const { mentorId } = req.params;

  const query = `
    SELECT 
      s.session_id,
      s.session_date,
      s.session_type,
      s.topics_covered,
      s.duration,
      s.location,
      s.session_status,
      CONCAT(m_user.first_name, ' ', m_user.last_name) AS mentor_name,
      CONCAT(me_user.first_name, ' ', me_user.last_name) AS mentee_name
    FROM Sessions s
    JOIN Users m_user ON s.mentor_id = m_user.user_id
    JOIN Users me_user ON s.mentee_id = me_user.user_id
    WHERE s.mentor_id = ?
    ORDER BY s.session_date ASC;
  `;

  db.query(query, [mentorId], (err, results) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      return res.status(500).json({ error: "Server error" });
    }

    const confirmed = [];
    const potential = [];

    results.forEach(session => {
      if (session.session_status === "Actual") {
        confirmed.push(session);
      } else {
        potential.push(session);
      }
    });

    res.json({ confirmed, potential });
  });
});







export default router;
