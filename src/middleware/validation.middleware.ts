import { Request, Response, NextFunction } from 'express';

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface TestData {
  random_string: string;
}

// Validation middleware for pagination
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query as PaginationQuery;
  
  const pageNum = parseInt(page || '1');
  const limitNum = parseInt(limit || '10');
  
  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.'
    });
  }
  
  // Add validated values to request
  req.body.validatedPage = pageNum;
  req.body.validatedLimit = limitNum;
  
  next();
};

// Validation middleware for test data
export const validateTestData = (req: Request, res: Response, next: NextFunction) => {
  const { random_string } = req.body as TestData;
  
  if (!random_string || typeof random_string !== 'string') {
    return res.status(400).json({
      error: 'random_string is required and must be a string'
    });
  }
  
  if (random_string.length > 1000) {
    return res.status(400).json({
      error: 'random_string must be less than 1000 characters'
    });
  }
  
  next();
};

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
}; 