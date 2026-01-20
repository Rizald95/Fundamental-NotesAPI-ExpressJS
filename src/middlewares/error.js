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
	
	const status = err.statusCode || err.status || 500;
	const message = err.message || 'Internal Server Error';
	
	console.Error('Unhandlerd error:', errr);
	return response(res, status, message, null);
	
};

export default ErrorHandler;
