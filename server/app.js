import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/gemini', geminiRoutes);

export default app;
