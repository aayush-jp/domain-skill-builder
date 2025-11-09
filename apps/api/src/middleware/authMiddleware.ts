import { Response, NextFunction } from 'express'; // Request is no longer needed from here
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces'; // <-- ADD THIS IMPORT

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

interface JwtPayload {
  userId: string;
  role: string;
}

// Use AuthenticatedRequest here instead of Request
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'NO_TOKEN', message: 'Authentication token is required.' } });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // This will now be type-safe
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired.' } });
  }
};