import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/invariant-error.js';

const TokenManager = {
	generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
		expiresIn: '15m'
	}),
	generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
		expiresIn: '7d'
	}),
	
	verify: (token, secretKey) => {
		try {
			const payload = jwt.verify(token, secretKey);
			return payload;
		} catch (error) {
			if (error.name === 'TokenExpiredError') {
				throw new InvariantError('Token telah kadaluarsa');
			}
			throw new InvariantError('Token tidak valid');
		}
	},
	
	verifyRefreshToken: (refreshToken) => {
		try {
			const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
			return payload;
		} catch (error) {
			console.log(error);
			throw new InvariantError('Refresh token tidak valid');
   }
 },
};
 
export default TokenManager;

