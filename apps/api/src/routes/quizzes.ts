import { Router } from 'express';
import { getQuizzesByDomain } from '../controllers/quizController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// This route is protected. The user must provide a valid JWT.
router.get('/:domainSlug', authMiddleware, getQuizzesByDomain);

export default router;