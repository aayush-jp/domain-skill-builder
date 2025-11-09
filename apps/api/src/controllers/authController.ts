import { Response } from 'express';
import { createUser, loginUser } from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import { ZodError } from 'zod';
import User from '../database/models/User';
import { AuthenticatedRequest } from '../interfaces'; // <-- THIS LINE WAS MISSING

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse({ body: req.body }).body;
    const user = await createUser({ name, email, password });
    const userResponse = { id: user._id, name: user.name, email: user.email };
    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.issues }});
    }
    if (error instanceof Error) {
       return res.status(400).json({ error: { code: 'REGISTRATION_FAILED', message: error.message }});
    }
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' }});
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = loginSchema.parse({ body: req.body }).body;
    const token = await loginUser(email, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
     if (error instanceof ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.issues }});
    }
    if (error instanceof Error) {
       return res.status(401).json({ error: { code: 'AUTHENTICATION_FAILED', message: error.message }});
    }
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' }});
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized' }});
  }

  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }
    res.status(200).json(user);
  } catch (error) {
     res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' }});
  }
};