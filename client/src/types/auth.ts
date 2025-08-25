export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TwoFactorData {
  tempToken: string;
  code: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}