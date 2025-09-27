// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000, // Increased to 30 seconds
  ENDPOINTS: {
    // Authentication endpoints
    AUTH_REGISTER: '/auth/register/',
    AUTH_LOGIN: '/auth/login/',
    AUTH_REFRESH: '/auth/refresh/',
    AUTH_LOGOUT: '/auth/logout/',
    AUTH_PROFILE: '/auth/profile/',
    AUTH_PROFILE_UPDATE: '/auth/profile/update/',
    AUTH_CHANGE_PASSWORD: '/auth/change-password/',
    
    // Quiz endpoints (public)
    QUIZ: '/quiz/',
    QUIZ_CONFIG: '/quiz/config/',
    QUIZ_SUBMIT: '/quiz/submit/',
    
    // Admin endpoints (require authentication)
    QUIZ_CONFIG_UPDATE: '/quiz/config/update/',
    ADMIN_ATTEMPTS: '/admin/attempts/',
    ADMIN_STATS: '/admin/stats/',
    ADMIN_QUESTION_STATS: '/admin/question-stats/'
  }
};

// Quiz Configuration
export const QUIZ_CONFIG = {
  DEFAULT_TIMER_DURATION: parseInt(import.meta.env.VITE_DEFAULT_TIMER_DURATION) || 10,
  DEFAULT_MAX_ATTEMPTS: parseInt(import.meta.env.VITE_DEFAULT_MAX_ATTEMPTS) || 1,
  DEFAULT_SHOW_RESULTS: true
};
