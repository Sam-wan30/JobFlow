import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import interviewRoutes from './routes/interviews';
import noteRoutes from './routes/notes';
import activityRoutes from './routes/activities';
import { frontendUrls, validateEnvironment, port } from './config/env';

dotenv.config();
validateEnvironment();

const app = express();

// Configuration
const corsOptions = {
  origin: frontendUrls,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Request logging (simple)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/activities', activityRoutes);

// Base route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'JobFlow Server is running smoothly.' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
