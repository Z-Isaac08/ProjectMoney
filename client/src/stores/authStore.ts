import { create } from "zustand";
import { authAPI } from "../services/api";
import { User, AuthState, LoginFormData, RegisterFormData, ApiResponse } from "../types/auth";

interface AuthStoreState extends AuthState {
  authState: "logged_out" | "awaiting_2fa" | "logged_in";
  userEmail: string;
  tempToken: string;
  initialized: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  resend2FA: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  // États d'authentification
  authState: "logged_out", // 'logged_out' | 'awaiting_2fa' | 'logged_in'
  userEmail: "",
  tempToken: "",
  user: null,
  loading: false,
  error: null,
  initialized: false, // Track if auth has been initialized

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Étape 1 - Connexion avec email/password
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.loginExistingUser(email, password);

      set({
        authState: "awaiting_2fa",
        userEmail: email,
        tempToken: response.data.tempToken,
        loading: false,
      });

      return {
        success: true,
        message: response.message || "Code de vérification envoyé par email",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Erreur de connexion";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  loginExistingUser: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.loginExistingUser(email, password);

      set({
        authState: "awaiting_2fa",
        userEmail: email,
        tempToken: response.data.tempToken,
        loading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Email ou mot de passe incorrect";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  registerNewUser: async ({ email, firstName, lastName, password }) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.registerNewUser({
        email,
        firstName,
        lastName,
        password,
      });

      set({
        authState: "awaiting_2fa",
        userEmail: email,
        tempToken: response.data.tempToken,
        loading: false,
      });

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = "Erreur lors de la création du compte";
      
      if (error.response?.data) {
        // Handle validation errors with details
        if (error.response.data.details && Array.isArray(error.response.data.details)) {
          errorMessage = error.response.data.details.map(detail => detail.message).join(', ');
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  checkEmail: async (email) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.checkEmail(email);

      if (response.data.exists) {
        set({
          authState: "existing_user_login",
          userEmail: email,
          loading: false,
        });
      } else {
        set({
          authState: "new_user_registration",
          userEmail: email,
          loading: false,
        });
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de la vérification";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Étape 2 - Vérification du code 2FA
  verify2FA: async (code) => {
    set({ loading: true, error: null });

    try {
      const tempToken = get().tempToken;
      const response = await authAPI.verify2FA(tempToken, code);

      // No need to store token - it's in HTTP-only cookies
      // Just store user data for UI purposes if needed

      set({
        authState: "logged_in",
        user: response.data.user,
        loading: false,
        tempToken: "", // Clear temp token
      });

      return {
        success: true,
        message: response.message || "Connexion réussie",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Code de vérification incorrect";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      // Always clear local state (cookies are cleared by server)
      set({
        authState: "logged_out",
        userEmail: "",
        tempToken: "",
        user: null,
        error: null,
      });
    }
  },

  // Resend 2FA code
  resend2FA: async () => {
    const tempToken = get().tempToken;
    if (!tempToken) return;

    set({ loading: true, error: null });

    try {
      const response = await authAPI.resend2FA(tempToken);

      set({ loading: false });
      return {
        success: true,
        message: response.message || "Nouveau code envoyé",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Erreur lors du renvoi";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Retour à l'étape de login depuis 2FA
  backToLogin: () => {
    set({
      authState: "logged_out",
      userEmail: "",
      tempToken: "",
      error: null,
    });
  },

  // Check authentication status on app startup
  checkAuthStatus: async () => {
    try {
      const response = await authAPI.getCurrentUser();

      set({
        authState: "logged_in",
        user: response.data.user,
        loading: false,
        error: null,
      });

      return response.data.user;
    } catch {
      // Not authenticated or session expired
      set({
        authState: "logged_out",
        user: null,
        loading: false,
        error: null,
      });
      return null;
    }
  },

  // Initialize auth state
  initAuth: async () => {
    // Prevent multiple initialization attempts
    if (get().initialized) {
      return;
    }
    
    set({ loading: true, initialized: true });
    try {
      await get().checkAuthStatus();
    } catch (error) {
      // Silently fail on initialization - don't throw errors
      console.log('Auth initialization: No valid session found', error);
      set({
        authState: "logged_out",
        user: null,
        loading: false,
        error: null,
      });
    }
  },

  // Helpers
  isLoggedIn: () => get().authState === "logged_in",
  isAwaitingTwoFA: () => get().authState === "awaiting_2fa",
  isLoggedOut: () => get().authState === "logged_out",

  // Nouveaux helpers nécessaires pour le flow
  isEmailVerification: () => get().authState === "email_verification",
  isNewUserRegistration: () => get().authState === "new_user_registration",
  isExistingUserLogin: () => get().authState === "existing_user_login",
}));
