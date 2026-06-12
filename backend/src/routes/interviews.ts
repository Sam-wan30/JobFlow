import { Router } from 'express';
import { scheduleInterview, updateInterview, deleteInterview, getInterviews } from '../controllers/interviewController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken as any);

router.post('/', scheduleInterview as any);
router.get('/', getInterviews as any);
router.put('/:id', updateInterview as any);
router.delete('/:id', deleteInterview as any);

export default router;
