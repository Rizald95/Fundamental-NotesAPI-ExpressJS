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

export default validate;
