//validate Request Body
const validate = (schema) => (req, res, next) => {
	const {error, value} = schema.validate(req.body, {
		abortEarly: false,
		allowUnkown: false,
		stripUnknown: true
	});
	
	if (error) return next(error);
	req.validated = value;
	next();
	
};

//validate Query Parameters
export const validateQuery = (schema) => (req, res, next) => {
	const {error, value } = schema.validate(req.query , {
		abortEarly: false,
		allowUnkown: false,
		stripUnknown: true
	});
	
	if (error) return next(error);
	req.validateQuery = value;
	next();
	
};

//validate URL Parameters
export const validateParams = (schema) => (req, res, next) => {
	const {error, value} = schema.validate(req.params, {
		abortEarly: false,
		allowUnkown: false,
		stripUnknown: true
	});
	
	if (error) return next(error);
	req.validatedParams = value;
	next();
};

export default validate;
