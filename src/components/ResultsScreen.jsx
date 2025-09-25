import React from 'react';

const ResultsScreen = ({ results, onRestart }) => {
  const { score, results: detailedResults, total_questions } = results;
  const percentage = Math.round((score / total_questions) * 100);

  const getScoreColor = (percent) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (percent) => {
    if (percent >= 80) return '🎉';
    if (percent >= 60) return '👍';
    return '💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
          <div className="text-6xl mb-4">{getScoreEmoji(percentage)}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
          
          <div className={`text-5xl font-bold mb-2 ${getScoreColor(percentage)}`}>
            {percentage}%
          </div>
          
          <p className="text-gray-600 text-lg mb-6">
            You scored {score} out of {total_questions} questions correctly
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="h-4 rounded-full transition-all duration-1000"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${
                  percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'
                }, ${percentage >= 80 ? '#34d399' : percentage >= 60 ? '#fbbf24' : '#f87171'})`
              }}
            ></div>
          </div>

          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 inline-flex items-center"
          >
            ↻ Take Quiz Again
          </button>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Results</h2>
          
          <div className="space-y-6">
            {detailedResults.map((result, index) => (
              <div
                key={result.question_id}
                className={`border-2 rounded-lg p-6 ${
                  result.is_correct
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1">
                    {index + 1}. {result.question_text}
                  </h3>
                  <span
                    className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      result.is_correct
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.is_correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div
                    className={`p-3 rounded border-2 ${
                      result.is_correct
                        ? 'border-green-300 bg-green-25'
                        : 'border-red-300 bg-red-25'
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-1">Your answer:</div>
                    <div className="font-medium">{result.user_answer_text}</div>
                  </div>

                  {!result.is_correct && (
                    <div className="p-3 rounded border-2 border-green-300 bg-green-25">
                      <div className="text-sm text-gray-600 mb-1">Correct answer:</div>
                      <div className="font-medium text-green-800">{result.correct_answer_text}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;