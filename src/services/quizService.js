import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { tokenManager } from './authService';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

// Request interceptor to add auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await api.post(API_CONFIG.ENDPOINTS.AUTH_REFRESH, {
            refresh: refreshToken
          });

          const { access } = response.data;
          tokenManager.setTokens(access, refreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        tokenManager.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const mockQuizData = [
  {
    id: 1,
    text: "What is the capital of France?",
    choices: [
      { id: 1, text: "London" },
      { id: 2, text: "Berlin" },
      { id: 3, text: "Paris", is_correct: true },
      { id: 4, text: "Madrid" }
    ]
  },
  {
    id: 2,
    text: "Which programming language is known for its use in web development?",
    choices: [
      { id: 5, text: "Python" },
      { id: 6, text: "JavaScript", is_correct: true },
      { id: 7, text: "Java" },
      { id: 8, text: "C++" }
    ]
  },
  {
    id: 3,
    text: "What does HTML stand for?",
    choices: [
      { id: 9, text: "Hypertext Markup Language", is_correct: true },
      { id: 10, text: "High Tech Modern Language" },
      { id: 11, text: "Home Tool Markup Language" },
      { id: 12, text: "Hyperlink and Text Markup Language" }
    ]
  },
  {
    id: 4,
    text: "Which company developed React?",
    choices: [
      { id: 13, text: "Google" },
      { id: 14, text: "Microsoft" },
      { id: 15, text: "Facebook (Meta)", is_correct: true },
      { id: 16, text: "Apple" }
    ]
  },
  {
    id: 5,
    text: "What is the time complexity of binary search?",
    choices: [
      { id: 17, text: "O(n)" },
      { id: 18, text: "O(log n)", is_correct: true },
      { id: 19, text: "O(n²)" },
      { id: 20, text: "O(1)" }
    ]
  }
];

export const quizService = {
  getQuizConfig: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.QUIZ_CONFIG);
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch quiz config, using default');
      return {
        timer_duration: 10,
        is_active: true,
        max_attempts: 1,
        show_results_immediately: true
      };
    }
  },

  updateQuizConfig: async (config) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.QUIZ_CONFIG_UPDATE, config);
      return response.data;
    } catch (error) {
      console.error('Failed to update quiz config:', error);
      throw error;
    }
  },

  fetchQuizQuestions: async () => {
    try {
      console.log('Fetching quiz questions from API...');
      const response = await api.get(API_CONFIG.ENDPOINTS.QUIZ);
      console.log('Successfully fetched questions:', response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      } else {
        console.warn('Invalid data structure, using mock data');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockQuizData;
      }
    } catch (error) {
      console.warn('API request failed, using mock data:', error.message);
      // Add more specific error handling
      if (error.code === 'ECONNREFUSED') {
        console.warn('Backend server is not running, using mock data');
      } else if (error.response?.status === 404) {
        console.warn('Quiz endpoint not found, using mock data');
      } else if (error.response?.status >= 500) {
        console.warn('Server error, using mock data');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockQuizData;
    }
  },

  submitQuizAnswers: async (answers, timeTaken, sessionId, username = null, retryCount = 0) => {
    try {
      console.log(`Submitting answers to API... (attempt ${retryCount + 1})`, answers);
      
      // Prepare submission data
      const submissionData = {
        answers: answers,
        time_taken: timeTaken,
        session_id: sessionId
      };

      // Add username if provided (for anonymous users or explicit username)
      if (username) {
        submissionData.username = username;
      }

      const response = await api.post(API_CONFIG.ENDPOINTS.QUIZ_SUBMIT, submissionData);
      console.log('Successfully submitted:', response.data);
      return response.data;
    } catch (error) {
      // Retry logic for timeout errors
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout') && retryCount < 2) {
        console.warn(`API submission timed out (attempt ${retryCount + 1}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        return quizService.submitQuizAnswers(answers, timeTaken, sessionId, username, retryCount + 1);
      }
      
      // More specific error handling
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.warn('API submission timed out after 3 attempts - backend may be slow or unresponsive');
      } else if (error.response?.status === 404) {
        console.warn('Quiz submission endpoint not found - backend may not be fully implemented');
      } else if (error.code === 'ECONNREFUSED') {
        console.warn('Backend server is not running');
      } else {
        console.warn('API submission failed:', error.message);
      }
      
      console.log('Falling back to mock evaluation...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let score = 0;
      const results = [];
      
      mockQuizData.forEach(question => {
        const userAnswerId = answers[question.id];
        const correctChoice = question.choices.find(choice => choice.is_correct);
        const userChoice = question.choices.find(choice => choice.id === userAnswerId);
        
        const isCorrect = userChoice && userChoice.is_correct;
        if (isCorrect) score += 10;
        
        results.push({
          question_id: question.id,
          question_text: question.text,
          user_answer_text: userChoice ? userChoice.text : "No answer",
          correct_answer_text: correctChoice ? correctChoice.text : "Answer not available",
          is_correct: isCorrect,
          points: isCorrect ? 10 : 0
        });
      });
      
      const percentage = (score / (mockQuizData.length * 10)) * 100;
      
      return {
        score: score,
        total_points: mockQuizData.length * 10,
        percentage: Math.round(percentage),
        time_taken: timeTaken,
        results: results
      };
    }
  },

  getQuizAttempts: async (retryCount = 0) => {
    try {
      console.log('Fetching quiz attempts from API...');
      const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_ATTEMPTS);
      console.log('Successfully fetched attempts:', response.data);
      return response.data;
    } catch (error) {
      // Retry logic for timeout errors
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout') && retryCount < 2) {
        console.warn(`Attempts API timed out (attempt ${retryCount + 1}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return quizService.getQuizAttempts(retryCount + 1);
      }
      
      console.warn('Failed to fetch attempts, using empty array:', error.message);
      return [];
    }
  },

  getQuizStats: async (retryCount = 0) => {
    try {
      console.log('Fetching quiz stats from API...');
      const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_STATS);
      console.log('Successfully fetched stats:', response.data);
      return response.data;
    } catch (error) {
      // Retry logic for timeout errors
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout') && retryCount < 2) {
        console.warn(`Stats API timed out (attempt ${retryCount + 1}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return quizService.getQuizStats(retryCount + 1);
      }
      
      console.warn('Failed to fetch stats, using default values:', error.message);
      return {
        total_attempts: 0,
        average_score: 0,
        average_time_taken: 0,
        total_questions: 5
      };
    }
  },

  getQuestionStats: async (retryCount = 0) => {
    try {
      console.log('Fetching question stats from API...');
      // Use a longer timeout specifically for question stats (60 seconds)
      const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN_QUESTION_STATS, {
        timeout: 60000 // 60 seconds timeout for question stats
      });
      console.log('Successfully fetched question stats:', response.data);
      return response.data;
    } catch (error) {
      // Retry logic for timeout errors
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout') && retryCount < 1) {
        console.warn(`Question stats API timed out (attempt ${retryCount + 1}), retrying with longer timeout...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retry
        
        // Try with even longer timeout on retry
        try {
          const retryResponse = await api.get(API_CONFIG.ENDPOINTS.ADMIN_QUESTION_STATS, {
            timeout: 90000 // 90 seconds timeout on retry
          });
          console.log('Successfully fetched question stats on retry:', retryResponse.data);
          return retryResponse.data;
        } catch (retryError) {
          console.warn('Retry also failed, using mock data:', retryError.message);
          return quizService.getQuestionStats(retryCount + 1);
        }
      }
      
      console.warn('Failed to fetch question stats, using mock data:', error.message);
      
      // More specific error handling
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.warn('Question stats API timed out - backend may be slow or unresponsive');
      } else if (error.response?.status === 404) {
        console.warn('Question stats endpoint not found - backend may not be fully implemented');
      } else if (error.code === 'ECONNREFUSED') {
        console.warn('Backend server is not running');
      } else if (error.response?.status >= 500) {
        console.warn('Backend server error - question stats endpoint may be having issues');
      }
      
      // Return mock question stats data
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockQuizData.map((question, index) => ({
        question_id: question.id,
        question_text: question.text,
        difficulty: index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard',
        total_attempts: Math.floor(Math.random() * 50) + 10,
        accuracy: Math.floor(Math.random() * 40) + 60 // 60-100% accuracy
      }));
    }
  },

  getQuestionsCount: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.QUIZ);
      if (Array.isArray(response.data)) {
        return response.data.length;
      }
      return 5; // Default fallback
    } catch (error) {
      console.warn('Failed to fetch questions count, using default');
      return 5;
    }
  },

  // Test backend connection for debugging
  testBackendConnection: async () => {
    try {
      console.log('Testing backend connection...');
      const response = await api.get('/health', { timeout: 5000 });
      console.log('Backend is healthy:', response.data);
      return true;
    } catch (error) {
      console.warn('Backend health check failed:', error.message);
      return false;
    }
  },

  // Get backend status for debugging
  getBackendStatus: async () => {
    const status = {
      baseUrl: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      endpoints: API_CONFIG.ENDPOINTS,
      isHealthy: false,
      lastError: null
    };

    try {
      // Test basic connectivity
      const response = await api.get(API_CONFIG.ENDPOINTS.QUIZ, { timeout: 10000 });
      status.isHealthy = true;
      console.log('Backend status: Healthy');
    } catch (error) {
      status.isHealthy = false;
      status.lastError = error.message;
      console.warn('Backend status: Unhealthy -', error.message);
    }

    return status;
  }
};