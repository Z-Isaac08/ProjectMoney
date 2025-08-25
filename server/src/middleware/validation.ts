import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Generic validation middleware factory
export const validate = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.validatedData = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Erreur de validation:', error.issues);
        res.status(400).json({
          success: false,
          error: 'Échec de la validation',
          details: error.issues?.map(err => ({
            field: err.path?.join('.') || 'inconnu',
            message: err.message || 'Erreur de validation',
            code: err.code || 'inconnu',
            received: (err as any).received
          })) || [],
          rawErrors: error.issues
        });
        return;
      }
      console.error('Non-Zod validation error:', error);
      next(error);
    }
  };
};

// Validate query parameters
export const validateQuery = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Échec de la validation des paramètres de requête',
          details: error.issues?.map(err => ({
            field: err.path?.join('.') || 'inconnu',
            message: err.message || 'Erreur de validation',
            code: err.code || 'inconnu'
          })) || []
        });
        return;
      }
      next(error);
    }
  };
};

// Validate URL parameters
export const validateParams = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.validatedParams = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Échec de la validation des paramètres',
          details: error.issues?.map(err => ({
            field: err.path?.join('.') || 'inconnu',
            message: err.message || 'Erreur de validation',
            code: err.code || 'inconnu'
          })) || []
        });
        return;
      }
      next(error);
    }
  };
};

