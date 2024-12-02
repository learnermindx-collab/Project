import express from  'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/auth.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', router);

//connect to mongo
 connectDB();


 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));