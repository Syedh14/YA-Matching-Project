import express from "express";
import db from "../db.js";

const router = express.Router();

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
      s.mentor_id,
      s.mentee_id,
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

router.get('/menteeSessions/:menteeId', (req, res) => {
  const { menteeId } = req.params;

  const query = `
    SELECT 
      s.session_id,
      s.session_date,
      s.session_type,
      s.topics_covered,
      s.duration,
      s.location,
      s.session_status,
      s.mentor_id,
      s.mentee_id,
      CONCAT(m_user.first_name, ' ', m_user.last_name) AS mentor_name,
      CONCAT(me_user.first_name, ' ', me_user.last_name) AS mentee_name
    FROM Sessions s
    JOIN Users m_user ON s.mentor_id = m_user.user_id
    JOIN Users me_user ON s.mentee_id = me_user.user_id
    WHERE s.mentee_id = ?
    ORDER BY s.session_date ASC;
  `;

  db.query(query, [menteeId], (err, results) => {
    if (err) {
      console.error("Error fetching mentee sessions:", err);
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


router.delete('/deleteSessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  const deleteQuery = `DELETE FROM Sessions WHERE session_id = ?`;

  db.query(deleteQuery, [sessionId], (err, result) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ error: "Database error while deleting session" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session deleted successfully" });
  });
});

router.post("/addSession", (req, res) => {
  const {
    session_id,           
    mentor_id,
    mentee_id,
    duration,
    topics_covered,
    session_type,
    session_date,
    location
  } = req.body;

  if (session_id) {
    // First delete the potential session
    const deleteQuery = `DELETE FROM Sessions WHERE session_id = ?`;
  
    db.query(deleteQuery, [session_id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting potential session:", deleteErr);
        return res.status(500).json({ error: "Failed to remove old potential session" });
      }
  
      console.log("Deleted potential session:", session_id);
  
      // Now insert the new Actual session
      const insertQuery = `
        INSERT INTO Sessions 
        (mentor_id, mentee_id, duration, topics_covered, session_type, session_date, location, session_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Actual')
      `;
  
      const values = [
        mentor_id,
        mentee_id,
        duration,
        topics_covered,
        session_type,
        session_date,
        location
      ];
  
      db.query(insertQuery, values, (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Error inserting actual session:", insertErr);
          return res.status(500).json({ error: "Failed to insert new session" });
        }
  
        console.log("New session inserted with ID:", insertResult.insertId);
  
        return res.status(201).json({
          message: "Potential session replaced with new Actual session",
          session_id: insertResult.insertId
        });
      });
    });
  } else {
    const insertQuery = `
      INSERT INTO Sessions 
      (mentor_id, mentee_id, duration, topics_covered, session_type, session_date, location, session_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Actual')
    `;

    const values = [
      mentor_id,
      mentee_id,
      duration,
      topics_covered,
      session_type,
      session_date,
      location
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting new session:", err);
        return res.status(500).json({ error: "Error inserting new session" });
      }

      return res.status(201).json({ message: "Session added", session_id: result.insertId });
    });
  }
});



export default router;
