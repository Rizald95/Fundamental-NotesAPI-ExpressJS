import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import UserRepositories from '../../users/repositories/user-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';

import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import {
	setAuthCookie,
	clearAuthCookie,
	getRefreshTokenFromCookie,
	regenerateSession,
	destroySession,
} from '../../../config/session.config.js';



export const login = async (req, res, next) => {
	try {
		const {username, password} = req.validated;
		
		//verify credentials
		const user = await UserRepositories.getUserById(username);
		if (!user) {
			return next (new AuthenticationError('Kredential yang anda berikan salah'));
		}
		
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if(!isPasswordValid) {
			return next(new AuthenticationError('Kredential yang anda berikan salah'));
		}
		
		//generate tokens
		const payload = {
			id: user.id,
			username: user.username
		};
		const accessToken = TokenManager.generateAccessToken(payload);
		const refreshToken = TokenManager.generateRefreshToken(payload);
		
		//store refresh token in database
		await AuthenticationRepositories.addRefreshToken(refreshToken);
		
		//set cookies
		setAuthCookie(res, {accessToken, refreshToken});
		
		//generate session after login (security)
		await regenerateSession(req, user.id);
		
		//store user info in session
		req.session.user = {
			id: user.id,
			username: user.username,
		};
		
		return response(res, 200, 'Login berhasil', {
			accessToken,
			refreshToken,
			user: {
				id: user.id,
				username: user.username,
				fullname: user.fullname,
			},
		});
		
	} catch (error) {
		next(error);
	}
};

export const register = async (req, res, next) => {
	try {
		const {username, password, fullname} = req.validated;
		
		//Check if username already exists
		const existingUser = await UserRepositories.verifyNewUsername(username);
		if (existingUser) {
			return next(new InvariantError('Username sudah digunakan'));
		}
		
		//hash password
		const hashedPassword = await bcrypt.hash(password, 10);
		
		//create user
		const userId = await UserRepositories.createUser({
			username,
			password: hashedPassword,
			fullname,
		});
		
		return response(res, 201, 'User berhasil ditambahkan', {userId} );
	} catch (error) {
		next(error);
	}
};



export const refreshToken = async (req, res, next) => {
	try {
		//try to get refresh token from body, cookie, or header
		let refreshToken = req.validated?.refreshToken || getRefreshTokenFromCookie(req) || req.headers['x-refresh-token'];
		if (!refreshToken) {
			return next(new AuthenticationError('Refresh token tidak ditemukan'));	
		}
		//verify refresh token exists in database
		await AuthenticationRepositories.verifyRefreshToken(refreshToken);
		
		//verify token signature
		const payload = TokenManager.verifyRefreshToken(refreshToken);
		
		//generate new access token 
		const accessToken = TokenManager.generateAccessToken({
			id: payload.id,
			username: payload.username, 
		});
		
		//update access token in cookie if using cookie-based auth 
		if (getRefreshTokenFromCookie(req)) {
			setAuthCookie(res, {
				accessToken, refreshToken
			});
		}
		return response(res, 200, 'Access token berhasil diperbarui', {
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};


export const logout = async (req, res, next) => {
	try {
		//Get refresh token from body, cookie, or header 
		const refreshToken = req.body?.refreshToken ||
							getRefreshTokenFromCookie(req) ||
							req.headers['x-refresh-token'];
		
		if (!refreshToken) {
			return next(new InvariantError('refresh token tidak ditemukan'));
		}
		
		//delete refresh token from database 
		await AuthenticationRepositories.deleteRefreshToken(refreshToken);
		
		//clear cookies
		clearAuthCookie(res);
		
		//destroy session 
		if (req.session) {
			await destroySession(req);
		}
		return response(res, 200, 'Logout berhasil', null);

	} catch (error) {
		next(error);
	}
};
