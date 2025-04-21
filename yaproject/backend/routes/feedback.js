// routes/feedback.js
import express from 'express';
import db from '../db.js'; // your mysql connection

const router = express.Router();

// POST /feedback (add feedback to the other party)
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

// GET /feedback (view feedback received by me)
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

// GET /mentor/mentees (fetch mentees assigned to the current mentor)
router.get('/mentor/mentees', (req, res) => {
  const mentorId = req.session.userId;
  if (!mentorId || req.session.userRole !== 'Mentor') {
    return res.status(403).send('Unauthorized');
  }
  const sql = `
    SELECT 
      m.mentee_id,
      u.first_name,
      u.last_name,
      m.skills,
      m.academic_status,
      m.goals,
      m.date_joined,
      m.institution,
      (SELECT email FROM Emails WHERE user_id = m.mentee_id LIMIT 1) as email,
      (SELECT phone FROM Phones WHERE user_id = m.mentee_id LIMIT 1) as phone
    FROM Mentees m
    JOIN Users u ON m.mentee_id = u.user_id
    WHERE m.mentor_id = ?
  `;
  db.query(sql, [mentorId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    const mentees = results.map(row => ({
      id: row.mentee_id,
      name: `${row.first_name} ${row.last_name}`,
      phone: row.phone,
      email: row.email,
      goals: row.goals,
      dateJoined: row.date_joined,
      skills: row.skills,
      institution: row.institution,
      status: row.academic_status
    }));
    res.json(mentees);
  });
});

router.get('/mentee/mentor', (req, res) => {
  const menteeId = req.session.userId;
  if (!menteeId || req.session.userRole !== 'Mentee') {
    return res.status(403).send('Unauthorized');
  }
  const sql = `
    SELECT 
      m.mentor_id,
      u.first_name,
      u.last_name,
      m.goals,
      m.date_joined,
      m.skills,
      m.academic_background,
      (SELECT email FROM Emails WHERE user_id = m.mentor_id LIMIT 1) as email,
      (SELECT phone FROM Phones WHERE user_id = m.mentor_id LIMIT 1) as phone
    FROM Mentees me
    JOIN Mentors m ON me.mentor_id = m.mentor_id
    JOIN Users u ON m.mentor_id = u.user_id
    WHERE me.mentee_id = ?
  `;
  db.query(sql, [menteeId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(404).send('No mentor assigned');
    }
    const mentor = results[0];
    const mentorData = {
      id: mentor.mentor_id,
      name: `${mentor.first_name} ${mentor.last_name}`,
      phone: mentor.phone,
      email: mentor.email,
      goals: mentor.goals,
      dateJoined: mentor.date_joined,
      skills: mentor.skills,
      academicBackground: mentor.academic_background
    };
    res.json(mentorData);
  });
});

export default router;