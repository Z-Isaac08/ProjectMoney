import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Response } from 'express';
import { JWTPayload, TokenResult } from '../types/utils';
import { User } from '../types/auth';

const prisma = require('../lib/prisma');

export const signToken = (id: string, email: string, role: string = 'USER'): string => {
  return jwt.sign(
    { userId: id, id, email, role } as JWTPayload,
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const createSendToken = async (
  user: User, 
  statusCode: number, 
  res: Response, 
  message: string = 'Success'
): Promise<void> => {
  const token = signToken(user.id, user.email, user.role);
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // Calculate expiry dates
  const jwtExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  // Set HTTP-only cookies
  const cookieOptions = {
    expires: jwtExpires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/'
  };

  res.cookie('auth_token', token, cookieOptions);
  res.cookie('refresh_token', refreshToken, { 
    ...cookieOptions, 
    expires: refreshExpires 
  });

  // Send response without password
  const { password, ...userWithoutPassword } = user as any;

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: userWithoutPassword,
      token: process.env.NODE_ENV === 'development' ? token : undefined
    }
  });
};

export const generateTempToken = (userId: string): string => {
  return jwt.sign({ userId, type: 'temp' }, process.env.JWT_SECRET!, {
    expiresIn: '15m'
  });
};

export const generate2FACode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('auth_token', { 
    path: '/', 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.clearCookie('refresh_token', { 
    path: '/', 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};