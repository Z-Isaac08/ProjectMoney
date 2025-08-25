import type { Request } from 'express';
import type { User } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validatedData?: unknown;
      rawBody?: Buffer;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  session?: unknown;
}

export interface ValidatedRequest<T = unknown> extends Request {
  validatedData?: T;
  validatedQuery?: unknown;
  validatedParams?: unknown;
}

export interface TypedRequest<TParams = unknown, TQuery = unknown, TBody = unknown>
  extends Request<TParams, unknown, TBody, TQuery> {
  user?: User;
}

export interface TypedResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  message?: string;
}