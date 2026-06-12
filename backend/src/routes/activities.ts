import { Router } from 'express';
import { getActivitiesByJob } from '../controllers/activityController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/job/:id', authenticateToken as any, getActivitiesByJob as any);

export default router;
