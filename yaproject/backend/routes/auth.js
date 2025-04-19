import express from "express";
import db from "../db.js";

const router = express.Router();


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      
      res.status(200).json({ message: "Login successful", user: results[0] });
    } else {
      
      res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

export default router;

