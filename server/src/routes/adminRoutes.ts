import express from 'express';
import { Request, Response } from 'express';
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getSecurityLogs,
  getSystemHealth,
  getAnalytics
} = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

// Tous les routes admin nécessitent une authentification et des privilèges admin
router.use(protect);
router.use(requireAdmin);

// Routes des statistiques du dashboard
router.get('/dashboard', authLimiter, getDashboardStats);

// Routes de gestion des utilisateurs
router.get('/users', authLimiter, getUsers);
router.patch('/users/:userId/status', authLimiter, updateUserStatus);
router.delete('/users/:userId', authLimiter, deleteUser);

// Routes de sécurité et audit
router.get('/security/logs', authLimiter, getSecurityLogs);

// Routes de santé système
router.get('/system/health', authLimiter, getSystemHealth);

// Routes d'analytics
router.get('/analytics', authLimiter, getAnalytics);

export default router;