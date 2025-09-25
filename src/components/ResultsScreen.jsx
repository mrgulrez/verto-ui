import React from 'react';

const ResultsScreen = ({ results, userAnswers, questions, onRestart }) => {
  // Debug logging
  console.log('Results received:', results);
  
  // Handle case where results is undefined or null
  if (!results) {
    console.error('No results data provided to ResultsScreen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Results Not Available</h2>
          <p className="text-gray-600 mb-6">There was an issue loading your quiz results.</p>
          <button
            onClick={onRestart}
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const { score, results: detailedResults, total_questions } = results;
  
  // Safe calculation with fallbacks
  const safeScore = typeof score === 'number' ? score : 0;
  // If total_questions is not provided, calculate it from the results array length
  const safeTotalQuestions = typeof total_questions === 'number' ? total_questions : (detailedResults ? detailedResults.length : 1);
  const percentage = Math.round((safeScore / safeTotalQuestions) * 100);
  
  // Additional safety check
  const finalPercentage = isNaN(percentage) ? 0 : percentage;

  const getScoreData = (percent) => {
    if (percent >= 90) return {
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500 to-green-600',
      emoji: '🏆',
      title: 'Outstanding!',
      message: 'Exceptional performance!'
    };
    if (percent >= 80) return {
      color: 'text-green-600',
      bgGradient: 'from-green-500 to-emerald-600',
      emoji: '🎉',
      title: 'Excellent!',
      message: 'Great job on the quiz!'
    };
    if (percent >= 70) return {
      color: 'text-blue-600',
      bgGradient: 'from-blue-500 to-indigo-600',
      emoji: '👍',
      title: 'Good Job!',
      message: 'Nice work, keep it up!'
    };
    if (percent >= 60) return {
      color: 'text-amber-600',
      bgGradient: 'from-amber-500 to-orange-600',
      emoji: '📚',
      title: 'Not Bad!',
      message: 'Room for improvement!'
    };
    return {
      color: 'text-red-600',
      bgGradient: 'from-red-500 to-pink-600',
      emoji: '💪',
      title: 'Keep Trying!',
      message: 'Practice makes perfect!'
    };
  };

  const scoreData = getScoreData(finalPercentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4 lg:px-8">
      <div className="max-w-4xl xl:max-w-7xl mx-auto w-full">
        {/* Hero Score Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 text-center mb-6 sm:mb-8 backdrop-blur-sm bg-white/95 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-indigo-200/20 to-transparent rounded-full translate-x-20 translate-y-20"></div>
          
          <div className="relative z-10">
            <div className="text-8xl mb-6 animate-bounce">{scoreData.emoji}</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{scoreData.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{scoreData.message}</p>
            
            {/* Score Display */}
            <div className="mb-8">
              <div className={`text-7xl font-bold mb-4 ${scoreData.color}`}>
                {finalPercentage}%
              </div>
              <p className="text-gray-600 text-xl">
                You answered <span className="font-semibold text-gray-800">{safeScore}</span> out of{' '}
                <span className="font-semibold text-gray-800">{safeTotalQuestions}</span> questions correctly
              </p>
            </div>

            {/* Animated Progress Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${finalPercentage * 2.51} 251`}
                    className={scoreData.color}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dasharray 2s ease-in-out',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">{finalPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onRestart}
                className={`group relative px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r ${scoreData.bgGradient} rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center">
                  <span className="mr-2">🔄</span>
                  Take Quiz Again
                </span>
              </button>
              
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-2xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center">
                  <span className="mr-2">📊</span>
                  View Detailed Results
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">{safeScore}</div>
            <div className="text-gray-600">Correct Answers</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">{safeTotalQuestions - safeScore}</div>
            <div className="text-gray-600">Incorrect Answers</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{finalPercentage}%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/95">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Detailed Review</h2>
            <div className="text-sm text-gray-500">
              Review your answers and learn from mistakes
            </div>
          </div>
          
          <div className="space-y-6">
            {(detailedResults || []).map((result, index) => {
              // Get the question data from the questions array
              const question = questions && questions[index];
              const questionText = question?.text || result?.question_text || `Question ${index + 1}`;
              
              // Get user's selected answer from userAnswers
              const userAnswerId = userAnswers && userAnswers[question?.id];
              const userAnswerText = userAnswerId && question ? 
                question.choices.find(c => c.id === userAnswerId)?.text || 'No answer provided' :
                result?.user_answer_text || 'No answer provided';
              
              // Get correct answer from the result or calculate it
              const correctAnswerText = result?.correct_answer_text || 'Answer not available';
              const isCorrect = result?.is_correct || false;
              
              return (
              <div
                key={result?.question_id || index}
                className={`border-2 rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
                  isCorrect
                    ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
                    : 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                        {questionText}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`ml-4 px-4 py-2 rounded-xl text-sm font-semibold flex items-center ${
                      isCorrect
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <span className="mr-1">✅</span>
                        Correct
                      </>
                    ) : (
                      <>
                        <span className="mr-1">❌</span>
                        Incorrect
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-4 ml-8 sm:ml-14">
                  <div
                    className={`p-3 sm:p-4 rounded-xl border-2 ${
                      isCorrect
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-600 mb-2">Your Answer:</div>
                    <div className="font-semibold text-gray-800">{userAnswerText}</div>
                  </div>

                  {!isCorrect && (
                    <div className="p-3 sm:p-4 rounded-xl border-2 border-green-300 bg-green-50">
                      <div className="text-sm font-medium text-gray-600 mb-2">Correct Answer:</div>
                      <div className="font-semibold text-green-800">{correctAnswerText}</div>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;