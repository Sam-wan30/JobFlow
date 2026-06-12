import { Router } from 'express';
import { createNote, updateNote, deleteNote } from '../controllers/noteController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken as any);

router.post('/', createNote as any);
router.put('/:id', updateNote as any);
router.delete('/:id', deleteNote as any);

export default router;
