import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import sql from './configs/db.js';     
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());             
app.use(express.json());     

// ====== ROUTES ======
app.use('/auth', authRoutes);    
app.use('/users', userRoutes);   

// ====== DATABASE CHECK ======
(async () => {
  try {
    await sql`SELECT NOW()`;
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
