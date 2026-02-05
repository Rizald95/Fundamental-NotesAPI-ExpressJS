import rateLimit from 'express-rate-limit';
import CacheService from '../cache/redis-service.js';

/**
 * Rate Limiting Configuration
 * Implements various rate limiting strategies for different endpoints
 */
 
 class RedisStore {
	 constructor() {
		 this.cacheService = new CacheService();
		 this.prefix = 'ratelimit: ';
	 }
	 
	 async increment(key) {
		 const fullkey = this.prefix + key;
		 const current = await this.cacheService.get(fullkey);
		 
		 if (current) {
			 const newValue = parseInt(current) + 1;
			 await this.cacheService.set(fullkey, newValue.toString(), 60); //60 seconds windows
			 return {totalHits: newValue, resetTime: new Date(Date.now() + 60000)};
		 } else {
			 await this.cacheService.set(fullkey, '1', 60);
			 return {totalHits: 1, resetTime: new Date(Date.now() + 60000) };
		 }
	 }
	 
	 async decrement(key) {
		 const fullKey = this.prefix + key;
		 const current = await this.cacheService.get(fullKey);
		 if (current && parseInt(current) > 0) {
			 await this.cacheService.set(fullKey, (parseInt(current) - 1).toString(), 60);
		 }
	 }
	 
	 async resetKey(key) {
		 await this.cacheService.delete(this.prefix + key);
	 }
	 	
 }
 
 	 //standard handler untuk rate limit exceeded
	 const standardHandler = (req, res) => {
		 res.status(429).json({
			 status: 'fail',
			 message: 'Terlalu banyak request, silahkan coba lagi nanti',
			 retryAfter: req.rateLimit.resetTime,
		 });
	 };
	 
	 //1. General API LIMITER - untuk semua endpoints
	 export const generalLimiter = rateLimit({
		 windowMs: 15 * 60 * 1000, //15 minutes
		 max: 100, //limit 200 requests per windowMs
		 message: 'Terlalu banyak request dari IP ini, silahkan coba lagi setelah 15 menit',
		 standardHeaders: true, 	//return rate limit info in headers
		 legacyHeaders: false,
		 handler: standardHandler,
	 });
	 
	 //2. Auth Limiter - Untuk login/register (lebih ketat)
	 export const authLimiter = rateLimit({
		 windowMs: 15 * 60 * 1000,	// 15 minutes
		 max: 5,	//limit 5 login attempts per 15 minutes
		 skipSuccessfulRequests: true, 	
		 message: 'Terlalu banyak percobaan login, silahkan coba lagi setelah 15 menit',
		 handler: standardHandler,
	 });
	 
	 //3. CREATE/WRITE LIMITER - untuk operasi POST/PUT/delete
	 export const writeLimiter = rateLimit({
		 windowMs: 60 * 1000,	// 1 minute
		 max: 10,	// Limit 10 write operations per minute
		 message: 'Terlalu banyak operasi tulis, silahkan coba lagi setelah 1 menit',
		 handler: standardHandler,
	 });
	 
	 //4. File UPLOAD LIMITER - untuk upload file
	 export const uploadLimiter = rateLimit({
		 windowMs: 60 * 60 * 1000,	// 1 hour
		 max: 20,	// Limit 20 uploads per hour
		 message: 'Terlalu banyak upload file, silahkan coba lagi setelah 1 jam',
		 handler: standardHandler,
	 });
	 
	 //5. READ LIMITER - untuk operasi GET (LEBIH longgar)
	 export const readLimiter = rateLimit({
		 windowMs:	60 * 1000, 	// 1 minute
		 max: 30,	// Limit 30 read operations per minute
		 message: 'Terlalu banyak request, silahkan coba lagi setelah 1 menit',
		 handler: standardHandler,
	 });
	 
	// 6. EXPORT LIMITTER - Untuk Operasi export
	export const exportLimiter = rateLimit({
		windowMs: 60 * 60 * 1000,	// 1 hour
		max: 5,	//limit 5 exports per hour
		message: 'Terlalu banyak request export, silahkan coba lagi setelah 1 jam',
		handler: standardHandler,
	});
	
	//helper function untuk apply rate limiter ke routes
	export function applyRateLimiters(app) {
		//General limiter untuk semua routes
		app.use('/api/', generalLimiter);
		
		console.log('Rate limiters configured');
	}

export default {
	generalLimiter,
	authLimiter,
	writeLimiter,
	uploadLimiter,
	readLimiter,
	exportLimiter,
	applyRateLimiters,
};