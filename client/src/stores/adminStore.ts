import { create } from 'zustand';
import { adminAPI } from '../services/api';

export const useAdminStore = create((set, get) => ({
  // État du dashboard
  dashboardData: null,
  users: [],
  loading: false,
  error: null,

  // Actions pour les données du dashboard
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adminAPI.getDashboardStats();
      set({ 
        dashboardData: {
          ...get().dashboardData,
          ...response.data,
          lastUpdated: new Date().toISOString()
        },
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Erreur lors du chargement des données',
        loading: false 
      });
    }
  },

  // Actions pour les statistiques utilisateurs
  fetchUserStats: async () => {
    try {
      const response = await adminAPI.getUserStats();
      set(state => ({
        dashboardData: {
          ...state.dashboardData,
          userStats: response.data
        }
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des stats utilisateurs:', error);
    }
  },

  // Actions pour la gestion des utilisateurs
  fetchUsers: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adminAPI.getUsers(filters);
      set({ users: response.data.users, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Erreur lors du chargement des utilisateurs',
        loading: false 
      });
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status);
      
      // Mettre à jour l'utilisateur dans la liste
      set(state => ({
        users: state.users.map(user => 
          user.id === userId ? { ...user, ...status } : user
        )
      }));

      // Rafraîchir les stats
      get().fetchUserStats();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  },

  deleteUser: async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      
      // Supprimer l'utilisateur de la liste
      set(state => ({
        users: state.users.filter(user => user.id !== userId)
      }));

      // Rafraîchir les stats
      get().fetchUserStats();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  },

  // Actions pour la santé du système
  fetchSystemHealth: async () => {
    try {
      const response = await adminAPI.getSystemHealth();
      set(state => ({
        dashboardData: {
          ...state.dashboardData,
          systemHealth: response.data
        }
      }));
    } catch (error) {
      console.error('Erreur lors du chargement de la santé système:', error);
    }
  },

  // Actions pour les logs de sécurité
  fetchSecurityLogs: async (filters = {}) => {
    try {
      const response = await adminAPI.getSecurityLogs(filters);
      set(state => ({
        dashboardData: {
          ...state.dashboardData,
          securityLogs: response.data
        }
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des logs de sécurité:', error);
    }
  },

  // Actions pour les analytics
  fetchAnalytics: async (timeRange = '7d', metric = 'users') => {
    try {
      const response = await adminAPI.getAnalytics(timeRange, metric);
      set(state => ({
        dashboardData: {
          ...state.dashboardData,
          analytics: {
            ...state.dashboardData?.analytics,
            [metric]: {
              ...state.dashboardData?.analytics?.[metric],
              [timeRange]: response.data
            }
          }
        }
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    }
  },

  // Actions pour les événements
  fetchEventStats: async () => {
    try {
      const response = await adminAPI.getEventStats();
      set(state => ({
        dashboardData: {
          ...state.dashboardData,
          events: response.data
        }
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des stats événements:', error);
    }
  },

  // LIBRARY STATS COMMENTED OUT FOR MVP
  // Actions pour la bibliothèque
  // fetchLibraryStats: async () => {
  //   try {
  //     const response = await adminAPI.getLibraryStats();
  //     set(state => ({
  //       dashboardData: {
  //         ...state.dashboardData,
  //         library: response.data
  //       }
  //     }));
  //   } catch (error) {
  //     console.error('Erreur lors du chargement des stats bibliothèque:', error);
  //   }
  // },
  fetchLibraryStats: async () => {
    // Empty function for MVP
  },

  // Actions pour les statistiques financières
  fetchFinancialStats: async () => {
    try {
      const response = await adminAPI.getFinancialStats();
      set(state => ({
        dashboardData: {
          ...state.dashboardData,
          financial: response.data
        }
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des stats financières:', error);
    }
  },

  // Action pour tout rafraîchir
  refreshAllData: async () => {
    const actions = [
      get().fetchDashboardData,
      get().fetchUserStats,
      get().fetchSystemHealth,
      get().fetchSecurityLogs,
      get().fetchEventStats,
      get().fetchLibraryStats,
      get().fetchFinancialStats
    ];

    await Promise.allSettled(actions.map(action => action()));
  },

  // Réinitialiser l'état
  reset: () => {
    set({
      dashboardData: null,
      users: [],
      loading: false,
      error: null
    });
  },

  // Nettoyer les erreurs
  clearError: () => {
    set({ error: null });
  },

  // Actions pour la configuration
  updateSystemConfig: async (config) => {
    try {
      await adminAPI.updateSystemConfig(config);
      
      // Rafraîchir la santé du système
      get().fetchSystemHealth();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour de la configuration');
    }
  },

  // Actions pour les notifications admin
  sendNotification: async (notification) => {
    try {
      await adminAPI.sendNotification(notification);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de l\'envoi de la notification');
    }
  },

  // Actions pour les sauvegardes
  createBackup: async () => {
    try {
      const response = await adminAPI.createBackup();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création de la sauvegarde');
    }
  },

  restoreBackup: async (backupId) => {
    try {
      await adminAPI.restoreBackup(backupId);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la restauration');
    }
  },

  // Actions pour les rapports
  generateReport: async (type, period) => {
    try {
      const response = await adminAPI.generateReport(type, period);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la génération du rapport');
    }
  },

  // Actions pour les métriques en temps réel
  subscribeToRealTimeMetrics: () => {
    // Simulation d'une connexion WebSocket pour les métriques en temps réel
    const interval = setInterval(() => {
      const currentData = get().dashboardData;
      if (currentData) {
        set(state => ({
          dashboardData: {
            ...state.dashboardData,
            onlineUsers: Math.floor(Math.random() * 50) + 10,
            realtimeMetrics: {
              activeConnections: Math.floor(Math.random() * 100) + 50,
              requestsPerMinute: Math.floor(Math.random() * 500) + 200,
              errorRate: Math.random() * 2,
              lastUpdate: new Date().toISOString()
            }
          }
        }));
      }
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  },

  // Helpers pour les calculs
  calculateGrowthRate: (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  formatNumber: (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  // Validation des permissions admin
  validateAdminAccess: () => {
    const { user } = get();
    return user && user.role === 'ADMIN';
  }
}));