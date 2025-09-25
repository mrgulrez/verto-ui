import axios from 'axios';

const API_BASE_URL = 'https://verto-backend.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizService = {
  // Fetch all quiz questions
  fetchQuizQuestions: async () => {
    try {
      const response = await api.get('/quiz/');
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  },

  // Submit quiz answers
  submitQuizAnswers: async (answers) => {
    try {
      const response = await api.post('/quiz/submit/', answers);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz answers:', error);
      throw error;
    }
  },
};