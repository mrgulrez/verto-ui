import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance for authentication
const authApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

// Token management
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  isAuthenticated: () => !!localStorage.getItem('accessToken'),
};

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await authApi.post(API_CONFIG.ENDPOINTS.AUTH_REFRESH, {
            refresh: refreshToken
          });

          const { access } = response.data;
          tokenManager.setTokens(access, refreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await authApi.post(API_CONFIG.ENDPOINTS.AUTH_REGISTER, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // Login user
  login: async (username, password) => {
    try {
      const response = await authApi.post(API_CONFIG.ENDPOINTS.AUTH_LOGIN, {
        username,
        password
      });
      
      const { tokens, user } = response.data;
      tokenManager.setTokens(tokens.access, tokens.refresh);
      
      return { user, tokens };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await authApi.post(API_CONFIG.ENDPOINTS.AUTH_LOGOUT, {
          refresh: refreshToken
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error.message);
    } finally {
      tokenManager.clearTokens();
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await authApi.get(API_CONFIG.ENDPOINTS.AUTH_PROFILE);
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await authApi.post(API_CONFIG.ENDPOINTS.AUTH_PROFILE_UPDATE, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await authApi.post(API_CONFIG.ENDPOINTS.AUTH_CHANGE_PASSWORD, {
        old_password: oldPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  },

  // Check if user is staff
  isStaff: async () => {
    try {
      const profile = await authService.getProfile();
      return profile.is_staff;
    } catch (error) {
      return false;
    }
  }
};

export default authService;
