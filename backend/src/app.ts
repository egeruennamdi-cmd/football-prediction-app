import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import converterRouter from './modules/converter/converter.routes';
import doctorRouter from './modules/doctor/doctor.routes';
import arbitrageRouter from './modules/arbitrage/arbitrage.routes';
import authRouter from './modules/auth/auth.routes';

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Root API Welcome & Endpoint Directory
const apiIndexHandler = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    name: 'BetMines Enterprise API Gateway',
    version: 'v1.0.0',
    description: 'Option C 50-Bookmaker Converter Engine, AI Bet Doctor & Arbitrage API',
    endpoints: {
      healthCheck: 'GET /api/v1/health',
      authRegister: 'POST /api/v1/auth/register',
      authLogin: 'POST /api/v1/auth/login',
      converterEngine: 'POST /api/v1/converter/convert',
      doctorAudit: 'POST /api/v1/doctor/audit',
      arbitrageScanner: 'GET /api/v1/arbitrage/scan'
    },
    timestamp: new Date().toISOString()
  });
};

app.get('/', apiIndexHandler);
app.get('/api', apiIndexHandler);
app.get('/api/v1', apiIndexHandler);

// Health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    service: 'BetMines Backend Service',
    timestamp: new Date().toISOString()
  });
});

// API Module Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/converter', converterRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/arbitrage', arbitrageRouter);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[BetMines API Error]:', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;
