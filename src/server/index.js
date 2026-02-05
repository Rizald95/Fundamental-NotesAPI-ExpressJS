import express from 'express';
import routes from '../routes/index.js';
import ErrorHandler from '../middlewares/error.js'; 
import { swaggerUi, swaggerDocument, swaggerOptions } from '../swagger-config.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Security configurations
import { applySecurity } from '../config/security.config.js';
import { generalLimiter } from '../config/rate-limit.config.js';
import { applySessionConfig } from '../config/session.config.js';

const app = express();

// ==========================================
// 1. LOGGING MIDDLEWARE
// ==========================================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ==========================================
// 2. SECURITY MIDDLEWARES (PRIORITY HIGH)
// ==========================================
// Apply all security headers (Helmet, CORS, XSS)
applySecurity(app);

// ==========================================
// 3. BODY PARSING
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 4. SESSION & COOKIE MANAGEMENT
// ==========================================
applySessionConfig(app, cookieParser);

// ==========================================
// 5. RATE LIMITING
// ==========================================
// General rate limiter untuk semua routes
app.use(generalLimiter);

// ==========================================
// 6. HEALTH CHECK ENDPOINT
// ==========================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ==========================================
// 7. API DOCUMENTATION (SWAGGER)
// ==========================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// ==========================================
// 8. STATIC FILES
// ==========================================
app.use('/uploads', express.static('src/services/uploads/files/images'));

// ==========================================
// 9. API ROUTES
// ==========================================
app.use(routes);

// ==========================================
// 10. 404 HANDLER (must be after all routes)
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Endpoint tidak ditemukan',
  });
});

// ==========================================
// 11. ERROR HANDLER (must be last)
// ==========================================
app.use(ErrorHandler);

// ==========================================
// GRACEFUL SHUTDOWN HANDLER
// ==========================================
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  // Note: app.close() doesn't exist in Express
  // Use server.close() instead when you have the server instance
  process.exit(0);
});

export default app;