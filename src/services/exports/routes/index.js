import { Router } from 'express';
import { exportNotes } from '../controller/export-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { exportPayloadSchema } from '../validator/schema.js';
import { exportLimiter } from '../../../config/rate-limit.config.js';

 
const router = Router();
 
router.post('/export/notes', authenticateToken, exportLimiter, validate(exportPayloadSchema),  exportNotes);
 
export default router;