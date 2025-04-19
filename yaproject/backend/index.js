import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',   // URL of your React app
    credentials: true                 // allow credentials (cookies) to be sent
  }));
  app.use(session({
    secret: 'yourSecretKey',          // replace with env variable in production
    resave: false,                    // don't save session if unmodified
    saveUninitialized: false,         // don't create session until something stored
    cookie: {
      httpOnly: true,                 // cookie not accessible via JS (secure)
      secure: false,                  // set true if using HTTPS
      sameSite: 'lax'                 // lax is usually fine for same-site requests
      // (no `maxAge` set here means cookie expires when browser is closed)
    }
  }));
app.use(express.json());
app.use("/auth", authRoutes);




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});