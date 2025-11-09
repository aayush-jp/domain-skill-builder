import { Request, Response } from 'express';
import * as quizService from '../services/quizService';

export const getQuizzesByDomain = async (req: Request, res: Response) => {
  try {
    const { domainSlug } = req.params;
    const quizzes = await quizService.findQuizzesByDomain(domainSlug);
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error in getQuizzesByDomain:', error); // Added for debugging
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch quizzes' } });
  }
};