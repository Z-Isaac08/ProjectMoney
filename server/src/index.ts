import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { env } from './config/env';
import './types/express';

dotenv.config();

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import errorHandler from './middleware/errorHandler';
import {
  helmetConfig,
  globalLimiter,
  speedLimiter,
  xssProtection,
  csrfProtection,
  inputValidation,
  trustProxy
} from './middleware/security';

const app = express();
const PORT = env.PORT;

// Trust proxy for accurate IP detection
app.use(trustProxy);

// Security middleware
app.use(helmetConfig);

// CORS configuration
app.use(cors({
  origin: [
    env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));

// Rate limiting and speed limiting
app.use(globalLimiter);
app.use(speedLimiter);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req: Request, _res: Response, buf: Buffer) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser(env.COOKIE_SECRET));

// Security validation middleware
app.use(inputValidation);
app.use(xssProtection);
app.use(csrfProtection);

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    security: 'enhanced'
  });
});

// API status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      server: 'ProjectMoney API',
      version: '2.0.0',
      status: 'operational',
      features: {
        authentication: true,
        rateLimit: true,
        csrf: true,
        xss: true,
        cookies: true,
        audit: true
      },
      timestamp: new Date().toISOString()
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// LIBRARY ROUTES COMMENTED OUT FOR MVP
// app.use('/api/library', require('../routers/libraryRoutes'));

// Catch all for API routes
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    error: 'API endpoint not found' 
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler for non-API routes
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM reçu, arrêt gracieux du serveur');
  const prismaModule = await import('./lib/prisma');
  await prismaModule.default.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT reçu, arrêt gracieux du serveur');
  const prismaModule = await import('./lib/prisma');
  await prismaModule.default.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🔒 Security: Enhanced with CSRF, XSS, Rate Limiting`);
  console.log(`🍪 Cookies: Secure HTTP-only cookies enabled`);
  console.log(`🗄️  Database: PostgreSQL with Prisma ORM`);
  console.log(`📊 Audit: Comprehensive logging enabled`);
});

export default app;