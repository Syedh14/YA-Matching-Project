// import express from 'express';
// import db from '../db.js';

// const router = express.Router();

// // GET /resources
// router.get('/', (req, res) => {
//   const sql = `
//     SELECT 
//       resource_id    AS id,
//       title,
//       description,
//       resource_type  AS type,
//       url,
//       DATE_FORMAT(upload_date, '%Y-%m-%d') AS date,
//       user_id        AS creatorId
//     FROM Resources
//     ORDER BY upload_date DESC
//   `;
//   db.query(sql, (err, rows) => {
//     if (err) {
//       console.error('Resources fetch error:', err);
//       return res.status(500).send('Could not load resources');
//     }
//     res.json(rows);
//   });
// });

// // // POST /resources
// // router.post('/', (req, res) => {
// //   const { title, description, type, url } = req.body;
// //   const userId = req.session.userId;  // must be logged in

// //   const sql = `
// //     INSERT INTO Resources
// //       (user_id, title, description, resource_type, url, upload_date)
// //     VALUES (?, ?, ?, ?, ?, NOW())
// //   `;
// //   db.query(sql, [userId, title, description, type, url], (err, result) => {
// //     if (err) {
// //       console.error('Resource insert error:', err);
// //       return res.status(500).send('Could not save resource');
// //     }
// //     // respond with the newly created resource
// //     res.status(201).json({
// //       id: result.insertId,
// //       title,
// //       description,
// //       type,
// //       url,
// //       date: new Date().toISOString().split('T')[0],
// //       creatorId: userId
// //     });
// //   });
// // });

// // POST /resources
// router.post('/', (req, res) => {
//     const userId = req.session.userId;
  
//     // default description to empty string
//     const {
//       title,
//       description = "",
//       resource_type,
//       url = ""
//     } = req.body;
  
//     if (!resource_type) {
//       return res.status(400).json({ error: 'resource_type is required' });
//     }
  
//     const sql = `
//       INSERT INTO Resources
//         (user_id, title, description, resource_type, url, upload_date, visibility)
//       VALUES (?, ?, ?, ?, ?, NOW(), ?)
//     `;
//     db.query(
//       sql,
//       [userId, title, description, resource_type, url],
//       (err, result) => {
//         if (err) {
//           console.error('Error inserting resource:', err);
//           return res.status(500).json({ error: err.message });
//         }
//         res.status(201).json({ resource_id: result.insertId });
//       }
//     );
//   });
  

// export default router;

// backend/routes/resources.js
import express from 'express';
import db from '../db.js';

const router = express.Router();


router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const sql = `
    SELECT 
        r.resource_id,
        r.user_id,
        r.title,
        r.description,
        r.resource_type,
        r.url,
        r.upload_date,
        u.role AS creator_role
    FROM Resources r
    JOIN Users u ON r.user_id = u.user_id
    ORDER BY r.upload_date DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Resources fetch error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


router.post('/', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { title, description, resource_type, url } = req.body;
  const userId = req.session.userId;

  const insertSql = `
    INSERT INTO Resources 
      (user_id, title, description, resource_type, url)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [userId, title, description, resource_type, url];
  db.query(insertSql, params, (err, result) => {
    if (err) {
      console.error("Resource insert error:", err);
      return res.status(500).json({ error: err.message });
    }
    
    const newId = result.insertId;
    db.query(
      `SELECT resource_id, user_id, title, description, resource_type, url, upload_date 
       FROM Resources WHERE resource_id = ?`,
      [newId],
      (err2, rows) => {
        if (err2) {
          console.error("Fetch new resource error:", err2);
          return res.status(500).json({ error: err2.message });
        }
        res.status(201).json(rows[0]);
      }
    );
  });
});

export default router;
