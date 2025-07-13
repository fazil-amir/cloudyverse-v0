import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/auth.service.js';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = {
  // Middleware to authenticate JWT token
  authenticate: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = authService.verifyToken(token);
      
      // Add user info to request
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },

  // Middleware to get full user object (optional - adds user to req.user)
  getUser: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const user = authService.getUserFromToken(token);
      
      // Add full user object to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },

  // Optional authentication - doesn't fail if no token
  optionalAuth: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      
      if (token) {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
      }
      
      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  }
}; 