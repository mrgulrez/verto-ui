import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';
// Fallback URL if needed: 'https://verto-backend.vercel.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Mock data for demonstration/fallback
const mockQuizData = [
  {
    id: 1,
    text: "What is the capital of France?",
    choices: [
      { id: 1, text: "London" },
      { id: 2, text: "Berlin" },
      { id: 3, text: "Paris" },
      { id: 4, text: "Madrid" }
    ]
  },
  {
    id: 2,
    text: "Which programming language is known for its use in web development and has a coffee-related name?",
    choices: [
      { id: 5, text: "Python" },
      { id: 6, text: "JavaScript" },
      { id: 7, text: "Java" },
      { id: 8, text: "C++" }
    ]
  },
  {
    id: 3,
    text: "What does HTML stand for?",
    choices: [
      { id: 9, text: "Hypertext Markup Language" },
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
      { id: 15, text: "Facebook (Meta)" },
      { id: 16, text: "Apple" }
    ]
  },
  {
    id: 5,
    text: "What is the time complexity of binary search?",
    choices: [
      { id: 17, text: "O(n)" },
      { id: 18, text: "O(log n)" },
      { id: 19, text: "O(n²)" },
      { id: 20, text: "O(1)" }
    ]
  },
  {
    id: 6,
    text: "Which CSS property is used to change the text color?",
    choices: [
      { id: 21, text: "text-color" },
      { id: 22, text: "color" },
      { id: 23, text: "font-color" },
      { id: 24, text: "text-style" }
    ]
  },
  {
    id: 7,
    text: "What does CSS stand for?",
    choices: [
      { id: 25, text: "Cascading Style Sheets" },
      { id: 26, text: "Computer Style Sheets" },
      { id: 27, text: "Creative Style Sheets" },
      { id: 28, text: "Colorful Style Sheets" }
    ]
  },
  {
    id: 8,
    text: "Which method is used to add an element to the end of an array in JavaScript?",
    choices: [
      { id: 29, text: "push()" },
      { id: 30, text: "add()" },
      { id: 31, text: "append()" },
      { id: 32, text: "insert()" }
    ]
  },
  {
    id: 9,
    text: "What is the purpose of the 'useState' hook in React?",
    choices: [
      { id: 33, text: "To manage component state" },
      { id: 34, text: "To create side effects" },
      { id: 35, text: "To fetch data" },
      { id: 36, text: "To handle events" }
    ]
  },
  {
    id: 10,
    text: "Which of the following is NOT a JavaScript data type?",
    choices: [
      { id: 37, text: "string" },
      { id: 38, text: "boolean" },
      { id: 39, text: "float" },
      { id: 40, text: "number" }
    ]
  }
];

const mockSubmissionResults = {
  score: 0,
  total_questions: 10,
  results: []
};

// Correct answers for mock data
const correctAnswers = {
  1: 3, // Paris
  2: 7, // Java
  3: 9, // Hypertext Markup Language
  4: 15, // Facebook (Meta)
  5: 18, // O(log n)
  6: 22, // color
  7: 25, // Cascading Style Sheets
  8: 29, // push()
  9: 33, // To manage component state
  10: 39 // float
};

export const quizService = {
  // Fetch all quiz questions
  fetchQuizQuestions: async () => {
    try {
      console.log('Attempting to fetch quiz questions from API...');
      const response = await api.get('/quiz/');
      console.log('Successfully fetched questions from API:', response.data);
      
      // Validate the data structure
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('Questions data structure:', response.data[0]);
        return response.data;
      } else {
        console.warn('Invalid data structure from API, using mock data');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockQuizData;
      }
    } catch (error) {
      console.warn('API request failed, using mock data:', error.message);
      
      // Return mock data with a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockQuizData;
    }
  },

  // Submit quiz answers
  submitQuizAnswers: async (answers, questionsData = null) => {
    try {
      console.log('Attempting to submit answers to API...', answers);
      const response = await api.post('/quiz/submit/', answers);
      console.log('Successfully submitted to API:', response.data);
      return response.data;
    } catch (error) {
      console.warn('API submission failed, using mock evaluation:', error.message);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use provided questions data or fall back to mock data
      const evaluationData = questionsData || mockQuizData;
      const correctAnswersData = questionsData ? {} : correctAnswers;
      
      // If using real questions data, we need to determine correct answers differently
      if (questionsData) {
        questionsData.forEach(question => {
          // Find the correct choice (this assumes the backend marks correct choices)
          const correctChoice = question.choices.find(choice => choice.is_correct || choice.correct);
          if (correctChoice) {
            correctAnswersData[question.id] = correctChoice.id;
          } else {
            // If no correct answer is marked, default to first choice (fallback)
            console.warn(`No correct answer found for question ${question.id}, defaulting to first choice`);
            correctAnswersData[question.id] = question.choices[0]?.id;
          }
        });
      }
      
      // Mock evaluation logic
      const results = [];
      let score = 0;
      
      evaluationData.forEach(question => {
        const userAnswerId = answers[question.id];
        const correctAnswerId = correctAnswersData[question.id];
        const isCorrect = userAnswerId === correctAnswerId;
        
        if (isCorrect) score++;
        
        const userAnswerText = question.choices.find(c => c.id === userAnswerId)?.text || "No answer provided";
        const correctAnswerText = question.choices.find(c => c.id === correctAnswerId)?.text || "Answer not available";
        
        console.log(`Question ${question.id}:`, {
          question: question.text,
          userAnswerId,
          correctAnswerId,
          userAnswerText,
          correctAnswerText,
          isCorrect
        });
        
        results.push({
          question_id: question.id,
          question_text: question.text,
          user_answer_text: userAnswerText,
          correct_answer_text: correctAnswerText,
          is_correct: isCorrect
        });
      });
      
      console.log('Mock evaluation completed:', { score, total_questions: evaluationData.length, results });
      
      return {
        score,
        total_questions: evaluationData.length,
        results
      };
    }
  },

  // Health check method
  checkApiHealth: async () => {
    try {
      const response = await api.get('/health');
      return { status: 'connected', data: response.data };
    } catch (error) {
      return { status: 'disconnected', error: error.message };
    }
  }
};