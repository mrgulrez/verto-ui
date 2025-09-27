import React, { useEffect } from 'react';

const QuizView = ({
  question,
  questionNumber,
  totalQuestions,
  userAnswers,
  onSelectAnswer,
  onNext,
  onPrevious,
  timeLeft,
  isLastQuestion,
  config,
  username
}) => {
  const selectedChoiceId = userAnswers[question.id];
  const answeredQuestions = Object.keys(userAnswers).length;
  const progressPercentage = (questionNumber / totalQuestions) * 100;
  const isTimeRunningOut = timeLeft && timeLeft.includes(':') && parseInt(timeLeft.split(':')[0]) < 2;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '1' && e.key <= '4') {
        const choiceIndex = parseInt(e.key) - 1;
        if (choiceIndex < question.choices.length) {
          onSelectAnswer(question.id, question.choices[choiceIndex].id);
        }
      } else if (e.key === 'ArrowLeft' && questionNumber > 1) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && selectedChoiceId) {
        onNext();
      } else if (e.key === 'Enter' && selectedChoiceId) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [question.id, question.choices, questionNumber, selectedChoiceId, onSelectAnswer, onPrevious, onNext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4 lg:p-8">
      <div className="max-w-4xl xl:max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 backdrop-blur-sm bg-white/95">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                Question {questionNumber} of {totalQuestions}
              </div>
              <div className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${
                isTimeRunningOut 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
              }`}>
                ⏱️ {timeLeft}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {username && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Playing as</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {username}
                  </div>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-semibold text-gray-700">
                  {answeredQuestions}/{totalQuestions} answered
                </div>
              </div>
              <div className="hidden lg:block text-xs text-gray-400">
                <div>Press 1-4 to select</div>
                <div>← → to navigate</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/95">
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {questionNumber}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                  {question.text}
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {question.choices.map((choice, index) => {
              const isSelected = selectedChoiceId === choice.id;
              const choiceLabels = ['A', 'B', 'C', 'D'];
              
              return (
                <div
                  key={choice.id}
                  onClick={() => onSelectAnswer(question.id, choice.id)}
                  className={`group relative p-4 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 transform scale-[1.02] shadow-lg'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600 group-hover:border-blue-400 group-hover:bg-blue-100'
                    }`}>
                      {choiceLabels[index]}
                    </div>
                    <span className="text-gray-800 text-lg flex-1">{choice.text}</span>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={onPrevious}
              disabled={questionNumber === 1}
              className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                questionNumber === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">←</span>
                Previous Question
              </span>
            </button>
            
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span>Question {questionNumber} of {totalQuestions}</span>
              {!selectedChoiceId && (
                <span className="text-amber-600 font-medium">Please select an answer</span>
              )}
            </div>
            
            <button
              onClick={onNext}
              disabled={!selectedChoiceId}
              className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                !selectedChoiceId
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isLastQuestion
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <span className="flex items-center justify-center">
                {isLastQuestion ? (
                  <>
                    <span className="mr-2">🎯</span>
                    Submit Quiz
                  </>
                ) : (
                  <>
                    Next Question
                    <span className="ml-2">→</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizView;