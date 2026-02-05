import session from 'express-session';
import {RedisStore} from 'connect-redis';
import CacheService from '../cache/redis-service.js';

/**
* Session & Cookie Configuration
* Implements secure session management with Redis store
*/

//initialize Redis client for session  store
const cacheService = new CacheService();
const redisClient = cacheService.getClient();

//Session Configuration
export const sessionConfig = {
	store: new RedisStore({
		client: redisClient,
		prefix: 'session: ',
	}),
	secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
	resave: false,	// Dont save session if unmodified
	saveUninitialized: false,	//dont create session until something stored
	name: 'sessionId',	//custom session cookie name (hide default)
	cookie: {
		secure: process.env.NODE_ENV === 'production',	//HTTPS only in production
		httpOnly: true,	//prevent XSS attacks
		maxAge: 24 * 60 * 60 * 1000,	// 24 hours
		sameSite: 'strict',	//CSRF protection
		domain: process.env.COOKIE_DOMAIN || undefined,
		path: '/',
	},
	rolling: true,	//reset maxAge on every request
	unset: 'destroy',
};

//Cookie Parser Configuration
export const cookieConfig = {
	secret: process.env.COOKIE_SECRET	|| 'your-cookie-secret-change-this',
	signed: true,	//Enable signed cookies
};

/**
* Session middleware wrapper with error handling
*/
export function sessionMiddleware(req, res, next) {
	const sessionMW = session(sessionConfig);
	
	sessionMW(req, res, (err) => {
		if (err) {
			console.error('Session Error: ', err);
			return res.status(500).json({
				status: 'error',
				message: 'Session error',
			});
		}
		next();
	});
}

/**
* Helper: Set authentication cookie
*/
export function setAuthCookie(res, tokenData) {
	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 7 * 24 * 60 * 60 * 1000, 	// 7 Days
		signed: true,
	};
	
	res.cookie('refreshToken', tokenData.refreshToken, cookieOptions);
	
	//Optional: set access token in cookie (or keep in header)
	res.cookie('accessToken', tokenData.accessToken, {
		...cookieOptions,
		maxAge: 15 * 60 * 1000,	//15 minutes
	});
}

/**
* Helper: Clear authentication cookie
*/
export function clearAuthCookie(res) {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		signed: true,
	});
	
	res.clearCookie('accessToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		signed: true,
	});
}

/**
* Helper: Get refresh token from cookie
*/
export function getRefreshTokenFromCookie(req) {
	// try signed cookie first
	if (req.signedCookies && req.signedCookies.refreshToken) {
		return req.signedCookies.refreshToken;
	}
	
	//fallback to regular cookie
	if (req.cookies && req.cookies.refreshToken) {
		return req.cookies.refreshToken;
	}
	
	return null;
}

/**
* Middleware: Require session (user must be logged in)
*/

export function requireSession(req, res, next) {
	if (!req.session || !req.session.userId) {
		return res.status(401).json({
			status: 'fail',
			message: 'Anda harus login terlebih dahulu',
		});
	}
	next();
}

/**
* Helper: Regenerate session (for after login)
*/
export async function regenerateSession(req, userId) {
	return new Promise((resolve, reject) => {
		req.session.regenerate((err) => {
			if (err) {
				reject(err);
			} else {
				req.session.userId = userId;
				req.session.createdAt = Date.now();
				resolve();
			}
		});
	});
}


/**
* Helper: Destroy session (for logout)
*/
export async function destroySession(req) {
	return new Promise((resolve, reject) => {
		req.session.destroy((err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

/**
* Apply session configuration to Express app
*/
export function applySessionConfig(app, cookieParser) {
	//Cookie parser must be applied before session
	app.use(cookieParser(cookieConfig.secret, {
		signed: cookieConfig.signed,
	}));
	
	//Session middleware 
	app.use(sessionMiddleware);
	
	console.log('Session & Cookie management configured');
}

export default {
	sessionConfig,
	cookieConfig,
	sessionMiddleware,
	requireSession,
	setAuthCookie,
	clearAuthCookie,
	getRefreshTokenFromCookie,
	regenerateSession,
	destroySession,
	applySessionConfig,
};

