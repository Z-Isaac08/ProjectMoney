import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN';
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date | null;
  password?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}