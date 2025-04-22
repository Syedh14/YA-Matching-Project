import express from "express";
import db from "../db.js";
import {runMatching} from "../api/geminiMatcher.js";

const router = express.Router();


router.post("/login", (req, res) => {
    const { username, password, role} = req.body;
  
    const query = `
      SELECT * FROM Users 
      WHERE username = ? AND password = ? AND role = ?`
    ;
  
    db.query(query, [username, password, role], (err, results) => {
      if (err) {
        console.log("SQL Error", err);
        return res.status(500).json({ error: err.message });
        }
  
        if (results.length > 0) {
            const user = results[0];
            req.session.userId = user.user_id;     
            req.session.userRole = user.role;      
            console.log(">> Session after login:", req.session);

            
            res.status(200).json({ 
              message: "Login successful", 
              user: { id: user.user_id, username: user.username, role: user.role } 
            });
          } else {
            res.status(401).json({ message: "Invalid username or password" });
          }
        });
      });

// router.get("/me", (req, res) => {
//   if (req.session.userRole) {
//     res.json({ role: req.session.userRole });
//   } else {
//     res.status(401).json({ role: null });
//   }
// });    \

router.get("/me", (req, res) => {
  if (req.session.userId && req.session.userRole) {
    res.json({
      id:   req.session.userId,
      role: req.session.userRole
    });
  } else {
    res.status(401).json({ id: null, role: null });
  }
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
      activeStatus,
      skills,
      academicBackground,
      academicStatus,
      institution,
      goals,
      availability = []
    } = req.body;
  
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
  
      const emailQuery = `
        INSERT INTO Emails (user_id, email) VALUES ?
      `;
      const emailValues = emails.map((email) => [userId, email]);
  
      db.query(emailQuery, [emailValues], (err) => {
        if (err) {
          console.error("Email insert error:", err);
          return res.status(500).json({ error: err.message });
        }
  
        const phoneQuery = `INSERT INTO Phones (user_id, phone) VALUES ?`;
        const phoneValues = phones.map((phone) => [userId, phone]);
  
        db.query(phoneQuery, [phoneValues], (err) => {
          if (err) {
            console.error("Phone insert error:", err);
            return res.status(500).json({ error: err.message });
          }
  
          const dateJoined = new Date();
  
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
            //db.query(mentorQuery, mentorValues, finishSignup);
            db.query(mentorQuery, mentorValues, (err) => {
              if (err) return finishSignup(err);

              // now insert availability slots for this mentor
              if (availability.length) {
                const availSql = `
                  INSERT INTO Mentor_Availability (mentor_id, available_date)
                  VALUES ?
                `;
                const availVals = availability.map(dt => [userId, dt]);
                db.query(availSql, [availVals], (err) => {
                  if (err) return finishSignup(err);
                  finishSignup();    
                });
              } else {
                finishSignup();
              }
            });
              

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
            //db.query(menteeQuery, menteeValues, finishSignup);
            db.query(menteeQuery, menteeValues, (err) => {
                if (err) return finishSignupWithGemini(err);
  
                // now insert availability slots for this mentee
                if (availability.length) {
                  const availSql = `
                    INSERT INTO Mentee_Availability (mentee_id, available_date)
                    VALUES ?
                  `;
                  const availVals = availability.map(dt => [userId, dt]);
                  db.query(availSql, [availVals], (err) => {
                    if (err) return finishSignupWithGemini(err);
                    finishSignupWithGemini();
                  });
                } else {
                  finishSignupWithGemini();
                }
              });    



              function finishSignupWithGemini(err) {
                if (err) {
                  console.error("Role-specific insert error:", err);
                  return res.status(500).json({ error: err.message });
                }
              
                // respond immediately
                res.status(201).json({
                  message: "Signup successful",
                  userId: userId
                });
              
                // → trigger AI match asynchronously
                const menteeQuery = `
                  SELECT m.mentee_id AS id, m.skills, m.academic_status, m.goals,
                         m.date_joined, m.institution,
                         JSON_ARRAYAGG(ma.available_date) AS availability
                    FROM Mentees m
                    LEFT JOIN Mentee_Availability ma ON m.mentee_id = ma.mentee_id
                   WHERE m.mentee_id = ?
                `;
              
                db.query(menteeQuery, [userId], (err1, menteeRows) => {
                  if (err1 || menteeRows.length === 0) {
                    console.error("❌ Error fetching mentee:", err1 || "Mentee not found");
                    return;
                  }
              
                  const mentee = {
                    ...menteeRows[0],
                    availability: JSON.parse(menteeRows[0].availability)
                  };
              
                  const mentorQuery = `
                    SELECT t.*, JSON_ARRAYAGG(ma.available_date) AS availability
                    FROM (
                      SELECT 
                        mentor_id AS id,
                        skills,
                        academic_background,
                        active_status,
                        date_joined,
                        mentee_assigned_count
                      FROM Mentors
                      WHERE active_status = TRUE
                    ) AS t
                    LEFT JOIN Mentor_Availability ma ON t.id = ma.mentor_id
                    GROUP BY t.id
                  `;
              
                  db.query(mentorQuery, async (err2, mentorRows) => {
                    if (err2) {
                      console.error("❌ Error fetching mentors:", err2);
                      return;
                    }
              
                    const mentors = mentorRows.map(r => ({
                      ...r,
                      availability: JSON.parse(r.availability)
                    }));
              
                    try {
                      const aiOutput = await runMatching(mentee, mentors);
                      const match = JSON.parse(aiOutput);
                      console.log("✅ AI Response:", match);
              
                      const insertMatchQuery = `
                        INSERT INTO Matches
                          (mentor_id, mentee_id, admin_id, ai_model, match_date, success_rate, match_approval_status)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                      `;
              
                      const values = [
                        match.mentor_id,
                        match.mentee_id,
                        match.admin_id,
                        match.ai_model,
                        match.match_date,
                        match.success_rate,
                        match.match_approval_status
                      ];
              
                      db.query(insertMatchQuery, values, (err3) => {
                        if (err3) {
                          console.error("❌ Error inserting match:", err3);
                          return;
                        }
                        console.log("✅ AI match inserted for mentee", userId);
                      });
                    } catch (e) {
                      console.error("❌ AI match error for mentee", userId, e);
                    }
                  });
                });
              }
              
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

router.get("/profile", (req, res) => {
    console.log(">> Session in /profile:", req.session);
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const uid  = req.session.userId;
    const role = req.session.userRole;
  
    const userSql = `
      SELECT 
        user_id,
        username,
        password,
        first_name AS firstName,
        last_name  AS lastName
      FROM Users
      WHERE user_id = ?;
    `;

  
    const emailsSql = "SELECT email FROM Emails WHERE user_id = ?;";
    const phonesSql = "SELECT phone FROM Phones WHERE user_id = ?;";
  
    const mentorSql = `
      SELECT 
        academic_background AS mentorAcademicStatus,
        active_status       AS mentorActiveStatus,
        goals                AS goal,
        skills               AS skill
      FROM Mentors
      WHERE mentor_id = ?;
    `;
    const menteeSql = `
      SELECT
        institution           AS menteeInstitution,
        academic_status       AS menteeAcademicStatus,
        goals                AS goal,
        skills               AS skill
      FROM Mentees
      WHERE mentee_id = ?;
    `;
  
    db.query(userSql, [uid], (e, userRows) => {
      if (e) return res.status(500).json({ message: "DB error" });
      if (!userRows.length) return res.status(404).json({ message: "User not found" });
  
      const profile = {
        ...userRows[0],
        role: role.toLowerCase()
      };
  
      db.query(emailsSql, [uid], (e, emailRows) => {
        if (e) return res.status(500).json({ message: "DB error" });
        profile.emails = emailRows.map(r => r.email);
  
        db.query(phonesSql, [uid], (e, phoneRows) => {
          if (e) return res.status(500).json({ message: "DB error" });
          profile.phones = phoneRows.map(r => r.phone);
  
          if (role === "Mentor") {
            db.query(mentorSql, [uid], (e, mRows) => {
              if (e) return res.status(500).json({ message: "DB error" });
              if (mRows.length) Object.assign(profile, mRows[0]);
              res.json(profile);
            });
          } else if (role === "Mentee") {
            db.query(menteeSql, [uid], (e, mRows) => {
              if (e) return res.status(500).json({ message: "DB error" });
              if (mRows.length) Object.assign(profile, mRows[0]);
              res.json(profile);
            });
          } else {
            res.json(profile);
          }
        });
      });
    });
  });

  router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  router.post("/update-profile", (req, res) => {
    const userId = req.session.userId;
    const role = req.session.userRole;
  
    if (!userId || !role) {
      return res.status(401).json({ error: "Unauthorized: no session found" });
    }
  
    const {
      firstName,
      lastName,
      username,
      password,
      phones,
      emails,
      goal,
      skill,
      academicStatus,
      academicBackground,
      institution,
      activeStatus,
    } = req.body;
  
    const userUpdateQuery = `
      UPDATE Users
      SET first_name = ?, last_name = ?, username = ?, password = ?
      WHERE user_id = ?
    `;
    const userValues = [firstName, lastName, username, password, userId];
  
    db.query(userUpdateQuery, userValues, (err) => {
      if (err) {
        console.error("User update error:", err);
        return res.status(500).json({ error: err.message });
      }
  
      db.query("DELETE FROM Phones WHERE user_id = ?", [userId], (err) => {
        if (err) return res.status(500).json({ error: "Phone delete failed" });
  
        const phoneValues = phones.map((p) => [userId, p]);
        db.query("INSERT INTO Phones (user_id, phone) VALUES ?", [phoneValues], (err) => {
          if (err) return res.status(500).json({ error: "Phone insert failed" });
  
          db.query("DELETE FROM Emails WHERE user_id = ?", [userId], (err) => {
            if (err) return res.status(500).json({ error: "Email delete failed" });
  
            const emailValues = emails.map((e) => [userId, e]);
            db.query("INSERT INTO Emails (user_id, email) VALUES ?", [emailValues], (err) => {
              if (err) return res.status(500).json({ error: "Email insert failed" });
  
              if (role === "Mentor") {
                const normalizedActiveStatus = activeStatus === true || activeStatus === "true" ? 1 : 0;
              
                const mentorQuery = `
                  UPDATE Mentors
                  SET goals = ?, skills = ?, academic_background = ?, active_status = ?
                  WHERE mentor_id = ?
                `;
                const mentorValues = [goal, skill, academicBackground, normalizedActiveStatus, userId];
                db.query(mentorQuery, mentorValues, finishUpdate);
              }
               else if (role === "Mentee") {
                const menteeQuery = `
                  UPDATE Mentees
                  SET goals = ?, skills = ?, academic_status = ?, institution = ?
                  WHERE mentee_id = ?
                `;
                const menteeValues = [goal, skill, academicStatus, institution, userId];
                db.query(menteeQuery, menteeValues, finishUpdate);
              } else if (role === "Admin") {
                finishUpdate();
              } else {
                return res.status(400).json({ error: "Invalid role" });
              }
  
              function finishUpdate(err) {
                if (err) {
                  console.error("Role-specific update error:", err);
                  return res.status(500).json({ error: err.message });
                }
  
                return res.status(200).json({ message: "Profile updated successfully" });
              }
            });
          });
        });
      });
    });
  });
  
  


export default router;

