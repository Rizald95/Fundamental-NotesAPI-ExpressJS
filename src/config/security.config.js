import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';


/**
 * Security Configuration
 * Implements security best practices including:
 * - Security headers (Helmet)
 * - CORS configuration
 * - XSS protection
 */
 
 // CORS Configuration
 export const corsOptions = {
	 origin: (origin, callback) => {
		 // allowed origins from environment variable or default
		 const allowedOrigins = process.env.ALLOWED_ORIGINS
		 ? process.env.ALLOWED_ORIGINS.split(',')
		 : ['http://localhost:3000', 'http://localhost:5000'];
		 
		 // Allow requests with no origin (mobile apps, Postman, Etc)
		 if (!origin || allowedOrigins.includes(origin)) {
			 callback(null, true);
		 } else {
			 callback(new Error('Not Allowed by CORS'));
		 }
	 },
	 
	 credentials: true,	//allow cookies to be sent
	 optionsSuccessStatus: 200,
	 methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	 allowedHeaders: [
		'Content-Type',
		'Authorization',
		'X-Requested-With',
		'Accept',
		'Origin',
	 ],
	 exposedHeaders: ['Set-Cookie'],
	 maxAge: 86400,	// 24 hours
 };
 
 //Helmet Configuration
 export const helmetConfig = helmet({
	 contentSecurityPolicy: {
		 directives: {
			 defaultSrc: [" 'self' "],
			 styleSrc: [" 'self' ", " 'unsafe-inline' "],	//for swagger UI
			 scriptSrc: [" 'self' ", " 'unsafe-inline' "],
			 imgSrc: ["'self'", 'data:', 'https:'],
		 },
	 },
	 crossOriginEmbedderPolicy: false,
	 hsts: {
		 maxAge: 31536000,
		 includeSubDomains: true,
		 preload: true,
	 },
	 frameguard: {
		 actions: 'deny',
	 },
	 xssFilter: true,
	 noSniff: true,
	 referrerPolicy: {
		 policy: 'strict-origin-when-cross-origin',
	 },
 });
 
 //XSS Clean configuration
 export const xssClean = xss();
 
 export function applySecurity(app) {
	 // Helmet - Security headers
	 app.use(helmetConfig);
	 
	 //CORS - Cross-Origin Resource Sharing
	 app.use(cors(corsOptions));
	 
	 //XSS Protection - Sanitize user input
	 app.use(xssClean);
	 
	 //Disable X-Powered-By headers
	 app.disable('x-powered-by');
	 
	 console.log('Security middlewares applied');
	 
	 
 }
 
 export default {
	 corsOptions,
	 helmetConfig,
	 xssClean,
	 applySecurity,
 };
 
 