import express from "express";
import db from "../db.js";

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

  
  
  

export default router;
