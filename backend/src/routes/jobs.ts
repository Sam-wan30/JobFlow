import { Router } from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob, getDashboardStats } from '../controllers/jobController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken as any);

router.post('/', createJob as any);
router.get('/', getJobs as any);
router.get('/stats', getDashboardStats as any);
router.get('/:id', getJobById as any);
router.put('/:id', updateJob as any);
router.delete('/:id', deleteJob as any);

export default router;
