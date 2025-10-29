import express from 'express';

import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './db/connectionToDatabase.js';
import authRoutes from './routes/auth-route.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5010;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

// rotas de API 
app.use('/api/auth', authRoutes); 

app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use("/logos", express.static(path.join(__dirname, "../assets/logos")));
app.use("/images", express.static(path.join(__dirname, "../assets/images")));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});



