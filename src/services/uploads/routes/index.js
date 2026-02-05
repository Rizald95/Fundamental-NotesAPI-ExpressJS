import { Router } from 'express';
import { uploadImages } from '../controller/upload-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import { upload } from '../storage/storage-config.js';
import multer from 'multer';
import {uploadLimiter} from '../../../config/rate-limit.config.js';

 
const router = Router();


router.post('/images', 
	authenticateToken, 
	uploadLimiter,
	upload.single('image'), 
	uploadImages);
 
export default router; 