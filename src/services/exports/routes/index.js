import { Router } from 'express';
import { exportNotes } from '../controllers/export-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { exportPayloadSchema } from '../validator/schema.js';

 
const router = Router();
 
router.post('/export/notes', authenticateToken, validate(exportPayloadSchema),  exportNotes);
 
export default router;