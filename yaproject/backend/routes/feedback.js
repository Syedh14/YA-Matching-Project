// routes/feedback.js
import express from 'express';
import db from '../db.js';  // your mysql connection

const router = express.Router();

// POST /feedback  (add feedback to the other party)
router.post('/', (req, res) => {
  const meId = req.session.userId;
  const meRole = req.session.userRole; // "Mentor" or "Mentee"
  const { otherId, score, comment } = req.body;

  // Basic validation
  const numericScore = parseInt(score, 10);
  if (!(numericScore >= 1 && numericScore <= 5)) {
    return res.status(400).send("Score must be between 1 and 5");
  }

  let insertSql, params;
  if (meRole === "Mentor") {
    // Mentor → Mentee feedback
    insertSql = `
      INSERT INTO Mentee_Feedback
        (mentee_id, mentor_id, feedback_score, comments)
      VALUES (?, ?, ?, ?)
    `;
    params = [otherId, meId, numericScore, comment];
  } else if (meRole === "Mentee") {
    // Mentee → Mentor feedback
    insertSql = `
      INSERT INTO Mentor_Feedback
        (mentor_id, mentee_id, feedback_score, comments)
      VALUES (?, ?, ?, ?)
    `;
    params = [otherId, meId, numericScore, comment];
  } else {
    return res.status(403).send("Only mentors or mentees can give feedback");
  }

  db.query(insertSql, params, (err) => {
    if (err) {
      console.error("Feedback insert error:", err);
      return res.status(500).send("Could not save feedback");
    }
    res.status(201).send("Feedback saved");
  });
});

// GET /feedback  (view feedback received by me)
router.get('/', (req, res) => {
  const meId = req.session.userId;
  const meRole = req.session.userRole;

  let selectSql, params;
  if (meRole === "Mentor") {
    // show feedback that mentees gave **to** this mentor
    selectSql = `
      SELECT mentee_id, feedback_score, comments
      FROM Mentor_Feedback
      WHERE mentor_id = ?
      ORDER BY feedback_id DESC
    `;
    params = [meId];
  } else if (meRole === "Mentee") {
    // show feedback that mentors gave **to** this mentee
    selectSql = `
      SELECT mentor_id, feedback_score, comments
      FROM Mentee_Feedback
      WHERE mentee_id = ?
      ORDER BY feedback_id DESC
    `;
    params = [meId];
  } else {
    return res.status(403).send("Only mentors or mentees can view feedback");
  }

  db.query(selectSql, params, (err, rows) => {
    if (err) {
      console.error("Feedback fetch error:", err);
      return res.status(500).send("Could not load feedback");
    }
    res.json(rows);
  });
});

export default router;
