import { Request, Response, NextFunction } from 'express';

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    type?: string;
    minimum?: number;
    maximum?: number;
    enum?: string[];
  };
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}