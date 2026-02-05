import express from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  editNoteById,
  deleteNoteById
} from '../controller/note-controller.js';
import validate, {validateQuery} from '../../../middlewares/validate.js';
import { notePayloadSchema, noteUpdatePayloadSchema, noteQuerySchema} from '../../../services/notes/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';
import { readLimiter, writeLimiter } from '../../../config/rate-limit.config.js';

const router = express.Router();

router.post('/notes', authenticateToken, writeLimiter, validate(notePayloadSchema), createNote);
router.get('/notes', authenticateToken, readLimiter, validateQuery(noteQuerySchema),getNotes);
router.get('/notes/:id', authenticateToken, readLimiter, getNoteById);
router.put('/notes/:id', authenticateToken, writeLimiter, validate(noteUpdatePayloadSchema),editNoteById);
router.delete('/notes/:id', authenticateToken, writeLimiter, deleteNoteById);

export default router;