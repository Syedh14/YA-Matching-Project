import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();

const SECRET = process.env.SECRET;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true              
  }));
  app.use(session({
    secret: `${SECRET}`,          
    resave: false,                    
    saveUninitialized: false,        
    cookie: {
      httpOnly: true,        
      secure: false,      
      sameSite: 'lax' 
    }
  }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use('/feedback', feedbackRoutes);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});