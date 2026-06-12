import { create } from 'zustand';
import API, { setAuthHeader } from '../api/axios';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setTokenAndUser: (token: string, user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, token) => {
    setAuthHeader(token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      setAuthHeader(null);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      // Call refresh to check if refresh token cookie exists and is valid
      const res = await API.post('/auth/refresh');
      const { user, accessToken } = res.data;
      setAuthHeader(accessToken);
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // Refresh token doesn't exist or is invalid
      setAuthHeader(null);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
  
  setTokenAndUser: (token: string, user: User) => {
    setAuthHeader(token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },
}));
