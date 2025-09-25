import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import QuizView from './components/QuizView';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { quizService } from './services/quizService';
import { useCountdown } from './hooks/useCountdown';

const TIME_LIMIT_MINUTES = 10; // 10 minutes timer

function App() {
  const [quizState, setQuizState] = useState('start'); // 'start', 'loading', 'active', 'results'
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const { timeLeft, start: startTimer, stop: stopTimer, reset: resetTimer, formattedTime } = useCountdown(
    TIME_LIMIT_MINUTES * 60,
    handleTimeUp
  );

  function handleTimeUp() {
    if (quizState === 'active') {
      handleSubmit();
    }
  }

  const fetchQuestions = useCallback(async () => {
    try {
      setError(null);
      const quizData = await quizService.fetchQuizQuestions();
      setQuestions(quizData);
      setQuizState('active');
      startTimer(); // Start the timer when questions are loaded
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
      setQuizState('start');
    }
  }, [startTimer]);

  const handleStartQuiz = () => {
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
      const submissionResults = await quizService.submitQuizAnswers(userAnswers, questions);
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
    resetTimer();
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
          <button
            onClick={handleRestart}
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'loading') {
    return <LoadingSpinner />;
  }

  if (quizState === 'start') {
    return (
      <StartScreen
        onStartQuiz={handleStartQuiz}
        totalQuestions={10} // Fixed to show 10 questions as per database
        timeLimit={TIME_LIMIT_MINUTES}
      />
    );
  }

  if (quizState === 'results' && results) {
    return <ResultsScreen results={results} userAnswers={userAnswers} questions={questions} onRestart={handleRestart} />;
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
      />
    );
  }

  return <LoadingSpinner />;
}

export default App;