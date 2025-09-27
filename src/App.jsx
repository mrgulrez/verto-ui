import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import QuizView from './components/QuizView';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { quizService } from './services/quizService';
import { useCountdown } from './hooks/useCountdown';
import { useSession } from './hooks/useSession';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [quizState, setQuizState] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(5); // Default fallback
  const [questionsCountLoading, setQuestionsCountLoading] = useState(true);
  const [quizUsername, setQuizUsername] = useState(''); // For anonymous users
  const { sessionId } = useSession();
  const { isAuthenticated, user } = useAuth();

  const { timeLeft, start: startTimer, stop: stopTimer, reset: resetTimer, formattedTime } = useCountdown(
    (quizConfig?.timer_duration || 10) * 60,
    handleTimeUp
  );

  function handleTimeUp() {
    if (quizState === 'active') {
      handleSubmit();
    }
  }

  const fetchQuizConfig = useCallback(async () => {
    try {
      const config = await quizService.getQuizConfig();
      setQuizConfig(config);
    } catch (error) {
      console.error('Failed to load quiz config');
    }
  }, []);

  const fetchQuestionsCount = useCallback(async () => {
    try {
      setQuestionsCountLoading(true);
      const count = await quizService.getQuestionsCount();
      setTotalQuestionsCount(count);
    } catch (error) {
      console.error('Failed to load questions count, using default');
      setTotalQuestionsCount(5);
    } finally {
      setQuestionsCountLoading(false);
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    try {
      setError(null);
      const quizData = await quizService.fetchQuizQuestions();
      setQuestions(quizData);
      setTotalQuestionsCount(quizData.length); // Update count with actual questions
      setQuizState('active');
      startTimer();
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
      setQuizState('start');
    }
  }, [startTimer]);

  useEffect(() => {
    fetchQuizConfig();
    fetchQuestionsCount();
  }, [fetchQuizConfig, fetchQuestionsCount]);

  const handleStartQuiz = () => {
    if (!quizConfig?.is_active) {
      setError('Quiz is currently unavailable. Please try again later.');
      return;
    }
    setError(null);
    setQuizState('loading');
    fetchQuestions();
  };

  const handleSelectAnswer = (questionId, choiceId) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setQuizState('loading');
      stopTimer();
      const timeTaken = (quizConfig?.timer_duration || 10) * 60 - timeLeft;
      
      // Determine username for submission
      let username = null;
      if (isAuthenticated && user) {
        // Use authenticated user's username
        username = user.username;
      } else if (quizUsername.trim()) {
        // Use provided username for anonymous users
        username = quizUsername.trim();
      }
      
      const submissionResults = await quizService.submitQuizAnswers(
        userAnswers, 
        timeTaken, 
        sessionId,
        username
      );
      setResults(submissionResults);
      setQuizState('results');
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      setQuizState('active');
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setResults(null);
    setError(null);
    setQuizUsername(''); // Reset username
    resetTimer();
    setQuizState('start');
  };

  const handleRetry = () => {
    setError(null);
    if (quizState === 'start') {
      handleStartQuiz();
    } else if (quizState === 'active') {
      fetchQuestions();
    }
  };

  const handleShowAdmin = () => {
    setQuizState('admin');
  };

  const handleAdminLoginSuccess = () => {
    setQuizState('admin');
  };

  const handleBackToQuiz = () => {
    setQuizState('start');
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handleRestart}
              className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizState === 'loading') {
    return <LoadingSpinner />;
  }

  if (quizState === 'admin') {
    return (
      <ProtectedRoute requireStaff={true}>
        <AdminPanel onBack={handleBackToQuiz} />
      </ProtectedRoute>
    );
  }

  if (quizState === 'start') {
    return (
      <StartScreen
        onStartQuiz={handleStartQuiz}
        onShowAdmin={handleShowAdmin}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        totalQuestions={questionsCountLoading ? "..." : totalQuestionsCount}
        timeLimit={quizConfig?.timer_duration || 10}
        isQuizActive={quizConfig?.is_active !== false}
        quizUsername={quizUsername}
        setQuizUsername={setQuizUsername}
      />
    );
  }

  if (quizState === 'results' && results) {
    return (
      <ResultsScreen
        results={results}
        userAnswers={userAnswers}
        questions={questions}
        onRestart={handleRestart}
        config={quizConfig}
        username={isAuthenticated ? user?.username : quizUsername}
      />
    );
  }

  if (quizState === 'active' && currentQuestion) {
    return (
      <QuizView
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        userAnswers={userAnswers}
        onSelectAnswer={handleSelectAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        timeLeft={formattedTime}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
        config={quizConfig}
        username={isAuthenticated ? user?.username : quizUsername}
      />
    );
  }

  return <LoadingSpinner />;
}

export default App;