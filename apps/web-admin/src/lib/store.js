import { create } from 'zustand';
import { authAPI } from './api';
import { authUtils } from './auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    const tokens = authUtils.getTokens();
    if (tokens.accessToken) {
      try {
        const user = await authAPI.getCurrentUser();
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authUtils.clearTokens();
        set({ user: null, isAuthenticated: false });
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authAPI.login(email, password);
      const { access_token, refresh_token } = response;

      authUtils.saveTokens(access_token, refresh_token);

      // 从token中解析用户信息
      const tokenData = authUtils.parseJWT(access_token);
      const user = {
        email: tokenData.sub,
        role: tokenData.role
      };

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  signup: async (email, password, role = 'Author') => {
    set({ isLoading: true, error: null });

    try {
      const user = await authAPI.signup(email, password, role);
      set({ isLoading: false, error: null });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Signup failed';
      set({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    authUtils.clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  },

  clearError: () => set({ error: null })
}));
