import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import { processAndSaveAttempt } from '../services/attemptService';

export const submitAttempt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: { message: 'User not authenticated' } });
    }

    const { quizId, answers } = req.body;
    if (!quizId || !answers) {
      return res.status(400).json({ error: { message: 'quizId and answers are required' } });
    }

    const result = await processAndSaveAttempt(userId, quizId, answers);
    res.status(201).json(result);

  } catch (error) {
    if (error instanceof Error) {
        return res.status(400).json({ error: { message: error.message } });
    }
    res.status(500).json({ error: { message: 'An internal server error occurred' } });
  }
};