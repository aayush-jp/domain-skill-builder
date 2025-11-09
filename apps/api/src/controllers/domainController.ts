import { Request, Response } from 'express';
import * as domainService from '../services/domainService';

export const getAllDomains = async (req: Request, res: Response) => {
  try {
    const domains = await domainService.findAllDomains();
    res.status(200).json(domains);
  } catch (error) {
    console.error('Error in getAllDomains:', error); // Added for debugging
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch domains' } });
  }
};

export const getDomainBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const domain = await domainService.findDomainBySlug(slug);
    res.status(200).json(domain);
  } catch (error) {
    if (error instanceof Error && error.message === 'Domain not found') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: error.message } });
    }
    console.error('Error in getDomainBySlug:', error); // Added for debugging
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch domain details' } });
  }
};