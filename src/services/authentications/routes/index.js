import { Router } from 'express';
import { login, refreshToken, logout, register } from '../controller/authentication-controller.js';
import validate from '../../../middlewares/validate.js';
import {
 postAuthenticationPayloadSchema,
 putAuthenticationPayloadSchema,
 deleteAuthenticationPayloadSchema,
 registerPayloadSchema,
} from '../validator/schema.js';
import {authLimiter} from '../../../config/rate-limit.config.js';
 
const router = Router();

router.post('/register', authLimiter, validate(registerPayloadSchema), register) 
router.post('/login',authLimiter,  validate(postAuthenticationPayloadSchema), login);
router.put('/refresh-token', validate(putAuthenticationPayloadSchema), refreshToken);
router.delete('/logout', validate(deleteAuthenticationPayloadSchema), logout);

export default router;