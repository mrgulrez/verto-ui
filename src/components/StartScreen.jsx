import React from 'react';

const StartScreen = ({ onStartQuiz, totalQuestions, timeLimit }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧠 Quiz Challenge</h1>
          <p className="text-gray-600">Test your knowledge with our interactive quiz!</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
              <div className="text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{timeLimit}:00</div>
              <div className="text-gray-600">Time Limit</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600 text-left mb-6">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Multiple choice questions</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Instant results with detailed feedback</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Navigate between questions freely</span>
          </div>
        </div>

        <button
          onClick={onStartQuiz}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Start Quiz Now
        </button>
      </div>
    </div>
  );
};

export default StartScreen;