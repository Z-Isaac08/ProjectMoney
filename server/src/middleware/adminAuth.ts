import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthenticatedRequest } from '../types/express';

// Middleware to verify admin privileges
export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if user is authenticated (normally done by protect middleware)
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

    // Log successful admin access
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware for super-admin actions (optional)
export const requireSuperAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // First check normal admin privileges
    await new Promise<void>((resolve, reject) => {
      requireAdmin(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Check super admin role (if implemented)
    if (req.user && req.user.role !== 'SUPER_ADMIN') {
      res.status(403).json({
        success: false,
        error: 'Super admin privileges required'
      });
      return;
    }


    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to validate admin parameters
export const validateAdminParams = (requiredParams: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const missingParams = [];

      // Check required parameters
      for (const param of requiredParams) {
        if (param.includes('.')) {
          // Support for nested parameters (e.g., 'body.userId')
          const [source, key] = param.split('.');
          if (!req[source] || req[source][key] === undefined) {
            missingParams.push(param);
          }
        } else {
          if (req.params[param] === undefined && req.query[param] === undefined && req.body[param] === undefined) {
            missingParams.push(param);
          }
        }
      }

      if (missingParams.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Missing parameters',
          missingParams
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware to limit sensitive actions (with confirmation)
export const requireConfirmation = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { confirmation } = req.body;

      if (!confirmation || confirmation !== `CONFIRM_${action.toUpperCase()}`) {
        res.status(400).json({
          success: false,
          error: `Confirmation required. Please include "confirmation": "CONFIRM_${action.toUpperCase()}" in your request`
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware for logging admin actions
export const logAdminAction = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Store action in request for later use
    (req as any).adminAction = action;
    
    // Intercept response to log result
    const originalSend = res.send;
    res.send = function(data) {
      // Log action result
      const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
      
      return originalSend.call(this, data);
    };

    next();
  };
};

// Admin-specific rate limiting middleware
export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher for admins
  message: {
    success: false,
    error: 'Too many admin requests. Please wait.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many admin requests. Please wait.'
    });
  }
});

