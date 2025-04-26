import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import campaignRoutes from './routes/campaign.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

// Create Express app
const app = express();

// Configure CORS to allow the deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://outflo-chi.vercel.app',
  'https://outflo.vercel.app'
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin?.includes('vercel.app')) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // For now, allow all origins but log blocked ones
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Outflo API is running' });
});

// Routes
app.use('/campaigns', campaignRoutes);
app.use('/personalized-message', messageRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;
