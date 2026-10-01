import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDatabase from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorResponse } from './utils/apiResponse.js';
import { apiLimiter } from './middleware/rateLimit.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must be set to at least 32 characters in production.');
}

app.disable('x-powered-by');
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pine City Made API is running.',
  });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, [], 404);
});

app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err);
  return errorResponse(res, 'Internal server error.', [err.message || 'Unknown error'], 500);
});

const startServer = async () => {
  try {
    await connectDatabase();
  } catch (error) {
    console.warn('MongoDB unavailable. The server continues to run without a database connection.');
  }

  app.listen(port, () => {
    console.log(`Pine City Made server running on http://localhost:${port}`);
  });
};

startServer();

export default app;
