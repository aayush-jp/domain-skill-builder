import { Request, Response } from 'express';
import { createUser, loginUser } from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import { ZodError } from 'zod';

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { name, email, password } = registerSchema.parse({ body: req.body }).body;

    // This call now matches the expected type in the service
    const user = await createUser({ name, email, password });
    
    // For security, don't send password hash in response
    const userResponse = { id: user._id, name: user.name, email: user.email };

    res.status(201).json({ message: 'User registered successfully', user: userResponse });

  } catch (error) {
    if (error instanceof ZodError) {
      // Correct property is .issues
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.issues }});
    }
    if (error instanceof Error) {
       return res.status(400).json({ error: { code: 'REGISTRATION_FAILED', message: error.message }});
    }
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' }});
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse({ body: req.body }).body;

    const token = await loginUser(email, password);

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
     if (error instanceof ZodError) {
      // Correct property is .issues
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.issues }});
    }
    if (error instanceof Error) {
       return res.status(401).json({ error: { code: 'AUTHENTICATION_FAILED', message: error.message }});
    }
    res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' }});
  }
};