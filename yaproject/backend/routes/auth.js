import express from "express";
import db from "../db.js";

const router = express.Router();


router.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    const query = `
      SELECT * FROM Users 
      WHERE username = ? AND password = ?`
    ;
  
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.log("SQL Error", err);
        return res.status(500).json({ error: err.message });
        }
  
      if (results.length > 0) {
        res.status(200).json({ message: "Login successful", user: results[0] });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    });
  });

router.post("/signup", (req, res) => {
    const {
      username,
      password,
      firstName,
      lastName,
      role,
      emails,
      phones,
      // Mentor-specific
      activeStatus,
      skills,
      academicBackground,
      // Mentee-specific
      academicStatus,
      institution,
      // Common
      goals
    } = req.body;
  
    // Step 1: Insert into Users
    const userQuery = `
      INSERT INTO Users (username, password, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    const userValues = [username, password, firstName, lastName, role];
  
    db.query(userQuery, userValues, (err, userResult) => {
      if (err) {
        console.error("User insert error:", err);
        return res.status(500).json({ error: err.message });
      }
  
      const userId = userResult.insertId;
  
      // Step 2: Insert emails
      const emailQuery = `
        INSERT INTO Emails (user_id, email) VALUES ?
      `;
      const emailValues = emails.map((email) => [userId, email]);
  
      db.query(emailQuery, [emailValues], (err) => {
        if (err) {
          console.error("Email insert error:", err);
          return res.status(500).json({ error: err.message });
        }
  
        // Step 3: Insert phones
        const phoneQuery = `INSERT INTO Phones (user_id, phone) VALUES ?`;
        const phoneValues = phones.map((phone) => [userId, phone]);
  
        db.query(phoneQuery, [phoneValues], (err) => {
          if (err) {
            console.error("Phone insert error:", err);
            return res.status(500).json({ error: err.message });
          }
  
          const dateJoined = new Date();
  
          // Step 4: Role-specific insert
          if (role === "Mentor") {
            const mentorQuery = `
              INSERT INTO Mentors 
              (mentor_id, active_status, goals, date_joined, skills, academic_background)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            const mentorValues = [
              userId,
              activeStatus ?? true,
              goals,
              dateJoined,
              skills,
              academicBackground
            ];
            db.query(mentorQuery, mentorValues, finishSignup);
          } else if (role === "Mentee") {
            const menteeQuery = `
              INSERT INTO Mentees 
              (mentee_id, skills, academic_status, goals, date_joined, institution)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            const menteeValues = [
              userId,
              skills,
              academicStatus,
              goals,
              dateJoined,
              institution
            ];
            db.query(menteeQuery, menteeValues, finishSignup);
          } else if (role === "Admin") {
            const adminQuery = `
              INSERT INTO Admins (admin_id, permission)
              VALUES (?, ?)
            `;
            db.query(adminQuery, [userId, true], finishSignup);
          } else {
            return res.status(400).json({ error: "Invalid role" });
          }
  
          function finishSignup(err) {
            if (err) {
              console.error("Role-specific insert error:", err);
              return res.status(500).json({ error: err.message });
            }
  
            return res.status(201).json({
              message: "Signup successful",
              userId: userId
            });
          }
        });
      });
    });
  });

export default router;

