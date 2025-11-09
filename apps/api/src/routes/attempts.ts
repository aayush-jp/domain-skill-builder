import { Router } from 'express';
import { submitAttempt } from '../controllers/attemptController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// This is a protected route
router.post('/', authMiddleware, submitAttempt);

export default router;