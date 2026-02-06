import response from '../utils/response.js';
import { ClientError } from '../exceptions/index.js';

const ErrorHandler = (err, req, res, next ) => {
	//handler clientError and its subclasses (invariantError, NotFoundError)
	if (err instanceof ClientError) {
		return response(res, err.statusCode, err.message, null);
		
	}
	//handle Joi validations errors
	if (err.isJoi) {
		return response(res, 400, err.details[0].message, null);
	}
	
	//handle JWT errors
	if (err.name === 'JsonWebTokenError') {
		return response(res, 401, 'Token tidak valid', null);
	}
	
	if (err.name === 'TokenExpiredError') {
		return response(res, 401, 'Token telah kadaluarsa', null);
	}
	
	//handle Multer Errors
	if (err.name === 'MulterError') {
		if (err.code === 'LIMIT_SIZE_FILE') {
			return response(res, 413, 'Ukuran file terlalu besar', null);
			
		}
		return response(res, 400, err.message, null);
	}
	
	const status = err.statusCode || err.status || 500;
	const message = err.message || 'Internal Server Error';
	
	console.error('Unhandlerd error:', {
		message: err.message,
		stack: err.stack,
		timestamp: new Date().toISOString(),
	});
	return response(res, status, message, null);
	
};

export default ErrorHandler;
