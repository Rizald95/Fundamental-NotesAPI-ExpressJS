import Joi from 'joi';

export const postAuthenticationPayloadSchema = Joi.object({
	username: Joi.string().min(3).max(50).required().messages({
		'any.required': 'Username harus diisi',
		'string.empty': 'Username tidak boleh kosong',
		'string.min': 'Username minimal 3 karakter',
		'string.max': 'Username maksimal 50 karakter',
	}),
	password: Joi.string().min(6).required().messages({
		'any.required': 'Password harus diisi',
		'string.empty': 'Password tidak boleh kosong',
		'string.min': 'Password minimal 6 karakter',
	}),
});


export const putAuthenticationPayloadSchema = Joi.object({
	refreshToken: Joi.string().required().messages({
		'any.required': 'Refresh token harus diisi',
		'string.empty': 'Refresh token tidak boleh kosong',
		'string.base': 'Refresh token harus berupa string',
	}),
});

export const deleteAuthenticationPayloadSchema = Joi.object({
	refreshToken: Joi.string().required().messages({
		'any.required': 'Refresh token harus diisi',
		'string.empty': 'Refresh token tidak boleh kosong',
		'string.base': 'Refresh token harus berupa string',
	}),
});