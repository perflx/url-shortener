
import express, { Request, Response } from 'express';
import { rateLimit} from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  limit: 50, 
  standardHeaders: 'draft-7', 
  legacyHeaders: false, 
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many attempts from your IP address. Try again later.',
    });
  },
});