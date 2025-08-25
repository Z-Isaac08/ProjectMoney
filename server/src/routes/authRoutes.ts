import express from 'express';
import type { Request, Response } from 'express';
import {
  checkEmailSchema,
  loginSchema,
  registerSchema,
  verify2FASchema,
  resend2FASchema
} from '../schemas/authSchemas';
import * as authController from '../controllers/authController';
import { protect, requireVerified, cleanupExpiredSessions } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { authLimiter, strictAuthLimiter } from '../middleware/security';

const router = express.Router();

// Cleanup expired sessions occasionally
router.use(cleanupExpiredSessions);

// Public routes (with rate limiting and validation)
router.post('/check-email', 
  authLimiter, 
  validate(checkEmailSchema), 
  authController.checkEmail
);

router.post('/login', 
  authLimiter, 
  validate(loginSchema), 
  authController.loginExistingUser
);

router.post('/register', 
  strictAuthLimiter, 
  validate(registerSchema), 
  authController.registerNewUser
);

router.post('/verify-2fa', 
  strictAuthLimiter, 
  validate(verify2FASchema), 
  authController.verify2FA
);

router.post('/resend-2fa', 
  authLimiter, 
  validate(resend2FASchema), 
  authController.resend2FA
);

router.post('/refresh', 
  authLimiter, 
  authController.refreshToken
);

// Protected routes
router.get('/me', 
  protect, 
  authController.getCurrentUser
);

router.post('/logout', 
  protect, 
  authController.logout
);

// Admin only routes (example)
router.get('/sessions', 
  protect, 
  requireVerified,
  // restrictTo('ADMIN'), // Uncomment when needed
  async (req, res) => {
    // Get user's active sessions
    const sessions = await require('../lib/prisma').session.findMany({
      where: {
        userId: req.user.id,
        isRevoked: false,
        expiresAt: { gt: new Date() }
      },
      select: {
        id: true,
        createdAt: true,
        userAgent: true,
        ipAddress: true,
        expiresAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { sessions }
    });
  }
);

router.delete('/sessions/:sessionId', 
  protect, 
  requireVerified,
  async (req, res) => {
    const { sessionId } = req.params;
    
    try {
      await require('../lib/prisma').session.update({
        where: {
          id: sessionId,
          userId: req.user.id // Ensure user can only revoke their own sessions
        },
        data: { isRevoked: true }
      });

      res.json({
        success: true,
        message: 'Session revoked successfully'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
  }
);

export default router;