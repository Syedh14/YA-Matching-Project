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
  
  

export default router;
