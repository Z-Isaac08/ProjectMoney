import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Invalid token'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expired'
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      statusCode: 400,
      message: Object.values(err.errors).map((val: any) => val.message).join(', ')
    };
  }

  // Prisma errors
  if (err.code === 'P2002') {
    error = {
      statusCode: 400,
      message: 'Duplicate field value entered'
    };
  }

  if (err.code === 'P2025') {
    error = {
      statusCode: 404,
      message: 'Record not found'
    };
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;