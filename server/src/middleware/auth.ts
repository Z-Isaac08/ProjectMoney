import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types/express';

// Verify JWT token middleware (cookie-based)
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1) Check if token exists in cookies
    let token = req.cookies.auth_token;
    
    // Fallback to Authorization header for API compatibility
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'You are not logged in! Please log in to get access.'
      });
      return;
    }

    // 2) Verify token
    const decoded = await verifyToken(token);

    // 3) Check if session is valid in database
    const session = await prisma.session.findFirst({
      where: {
        token,
        userId: decoded.id,
        isRevoked: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            isVerified: true
          }
        }
      }
    });

    if (!session || !session.user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Invalid session. Please log in again!'
      });
      return;
    }

    // 4) Attach user to request
    req.user = {
      ...session.user,
      createdAt: new Date(),
      updatedAt: new Date()
    } as User;
    req.session = session;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token. Please log in again!'
    });
    return;
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.auth_token;
    
    if (token) {
      const decoded = await verifyToken(token);
      
      const session = await prisma.session.findFirst({
        where: {
          token,
          userId: decoded.id,
          isRevoked: false,
          expiresAt: {
            gt: new Date()
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              isActive: true,
              isVerified: true
            }
          }
        }
      });

      if (session && session.user.isActive) {
        req.user = {
          ...session.user,
          createdAt: new Date(),
          updatedAt: new Date()
        } as User;
        req.session = session;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we just continue without user
    next();
  }
};

// Role-based access control
export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action'
      });
      return;
    }
    next();
  };
};

// Require email verification
export const requireVerified = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.isVerified) {
    res.status(403).json({
      success: false,
      error: 'Please verify your email address to access this resource'
    });
    return;
  }
  next();
};

// Session management
export const cleanupExpiredSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Clean up expired sessions (run occasionally)
    if (Math.random() < 0.01) { // 1% chance to run cleanup
      await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });
    }
    next();
  } catch (error) {
    // Don't fail the request if cleanup fails
    next();
  }
};

// Middleware to verify admin privileges
export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    // Check if user has ADMIN role
    if (req.user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: 'Admin privileges required'
      });
      return;
    }

    // Check if admin account is active and verified
    if (!req.user.isActive || !req.user.isVerified) {
      res.status(403).json({
        success: false,
        error: 'Admin account inactive or unverified'
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

