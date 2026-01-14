import express from  'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/auth.js';
import projrouter from './routes/proj.js';
import statsrouter from './routes/stats.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', router);
app.use('/api/projects', projrouter);
app.use('/api/stats', statsrouter);




//connect to mongo
 connectDB();


 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));