import axios, { AxiosResponse } from "axios";
import { ApiResponse, User, LoginFormData, RegisterFormData } from "../types/auth";
import { DashboardData, UserManagement } from "../types/admin";

const API_BASE_URL = "http://localhost:3001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // No need to manually add auth token - cookies are sent automatically
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Évite une boucle infinie : si /auth/refresh échoue, ne réessaye pas
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") // << ajoute cette ligne
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");

        return api(originalRequest);
      } catch (refreshError) {
        // Clear authentication data without redirecting
        if (typeof window !== "undefined") {
          // Clear cookies
          document.cookie = "auth_token=; Max-Age=0; path=/;";
          document.cookie = "refresh_token=; Max-Age=0; path=/;";
          
          // Only redirect if this is not an initialization request
          if (!originalRequest.url.includes("/auth/me")) {
            window.location.href = "/";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  checkEmail: async (email) => {
    const response = await api.post("/auth/check-email", { email });
    return response.data;
  },

  loginExistingUser: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  registerNewUser: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  verify2FA: async (tempToken, code) => {
    const response = await api.post("/auth/verify-2fa", { tempToken, code });
    return response.data;
  },

  resend2FA: async (tempToken) => {
    const response = await api.post("/auth/resend-2fa", { tempToken });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

// Services d'administration
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUserStats: () => api.get('/admin/users/stats'),
  getUsers: (filters) => api.get('/admin/users', { params: filters }),
  updateUserStatus: (userId, status) => api.patch(`/admin/users/${userId}/status`, status),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getSecurityLogs: (filters) => api.get('/admin/security/logs', { params: filters }),
  getSystemHealth: () => api.get('/admin/system/health'),
  getAnalytics: (timeRange, metric) => api.get('/admin/analytics', { 
    params: { timeRange, metric } 
  }),
  getEventStats: () => api.get('/admin/events/stats'),
  // LIBRARY FEATURE COMMENTED OUT FOR MVP
  // getLibraryStats: () => api.get('/admin/library/stats'),
  getFinancialStats: () => api.get('/admin/financial/stats'),
  updateSystemConfig: (config) => api.patch('/admin/system/config', config),
  sendNotification: (notification) => api.post('/admin/notifications', notification),
  createBackup: () => api.post('/admin/system/backup'),
  restoreBackup: (backupId) => api.post(`/admin/system/restore/${backupId}`),
  generateReport: (type, period) => api.post('/admin/reports/generate', { type, period })
};

// LIBRARY API FUNCTIONS - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
// Library API functions
export const libraryAPI = {
  // Categories
  getCategories: (includeInactive = false) => 
    api.get('/library/categories', { params: { includeInactive } }),
  
  createCategory: (categoryData) => 
    api.post('/library/categories', categoryData),
  
  updateCategory: (categoryId, updateData) => 
    api.put(`/library/categories/${categoryId}`, updateData),
  
  deleteCategory: (categoryId) => 
    api.delete(`/library/categories/${categoryId}`),

  // Books
  getBooks: (filters = {}, config = {}) => 
    api.get('/library/books', { params: filters, ...config }),
  
  getBookById: (bookId) => 
    api.get(`/library/books/${bookId}`),
  
  createBook: (bookData) => 
    api.post('/library/books', bookData),
  
  updateBook: (bookId, updateData) => 
    api.put(`/library/books/${bookId}`, updateData),
  
  deleteBook: (bookId) => 
    api.delete(`/library/books/${bookId}`),
  
  // Admin - get all books including private
  getAllBooks: (filters = {}) => 
    api.get('/library/admin/books', { params: filters }),

  // Bookmarks
  getUserBookmarks: (page = 1, limit = 20) => 
    api.get('/library/bookmarks', { params: { page, limit } }),
  
  toggleBookmark: (bookId) => 
    api.post(`/library/books/${bookId}/bookmark`),

  // Reviews
  getBookReviews: (bookId, page = 1, limit = 10) => 
    api.get(`/library/books/${bookId}/reviews`, { params: { page, limit } }),
  
  addReview: (bookId, reviewData) => 
    api.post(`/library/books/${bookId}/reviews`, reviewData),
  
  updateReview: (bookId, reviewData) => 
    api.post(`/library/books/${bookId}/reviews`, reviewData),
  
  deleteReview: (bookId) => 
    api.delete(`/library/books/${bookId}/reviews`),

  // Downloads
  downloadBook: (bookId) => 
    api.get(`/library/books/${bookId}/download`),

  // Statistics
  getLibraryStats: () => 
    api.get('/library/stats'),

  // Search and filters
  searchBooks: (query, filters = {}) => 
    api.get('/library/books', { params: { search: query, ...filters } }),
  
  getBooksByCategory: (categoryId, filters = {}) => 
    api.get('/library/books', { params: { categoryId, ...filters } }),
  
  getBooksByAuthor: (author, filters = {}) => 
    api.get('/library/books', { params: { author, ...filters } }),
  
  getBooksByLanguage: (language, filters = {}) => 
    api.get('/library/books', { params: { language, ...filters } }),
  
  getBooksByFileType: (fileType, filters = {}) => 
    api.get('/library/books', { params: { fileType, ...filters } }),

  // Orders and Payments
  createOrder: (orderData) => 
    api.post('/library/orders', orderData),
  
  getUserOrders: (page = 1, limit = 20) => 
    api.get('/library/orders', { params: { page, limit } }),
  
  getOrderById: (orderId) => 
    api.get(`/library/orders/${orderId}`),
  
  processPayment: (orderId, paymentData) => 
    api.post(`/library/orders/${orderId}/payment`, paymentData),
  
  getPaymentStatus: (orderId) => 
    api.get(`/library/orders/${orderId}/payment/status`)
};
*/

// Empty library API for MVP
export const libraryAPI = {};

export default api;
