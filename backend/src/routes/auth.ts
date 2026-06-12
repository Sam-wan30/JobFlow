import { Router } from 'express';
import { register, login, logout, refresh, getMe, googleAuthSuccess, googleAuthFailed, updateAvatar } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import passport from '../config/googleOAuth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authenticateToken as any, getMe as any);
router.put('/avatar', authenticateToken as any, updateAvatar as any);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthSuccess);
router.get('/google/failure', googleAuthFailed);

export default router;
