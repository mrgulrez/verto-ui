import React from 'react';

const StartScreen = ({ onStartQuiz, totalQuestions, timeLimit }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4 lg:p-8">
      <div className="max-w-4xl xl:max-w-6xl w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-lg">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Quiz Challenge
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with our comprehensive quiz platform. Challenge yourself and see how much you really know!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-white/95">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-100">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📝</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalQuestions}</div>
              <div className="text-gray-600 font-medium">Questions</div>
              <div className="text-sm text-gray-500 mt-1">Carefully curated</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center border border-amber-100">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">⏱️</span>
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-2">{timeLimit} Min</div>
              <div className="text-gray-600 font-medium">Time Limit</div>
              <div className="text-sm text-gray-500 mt-1">Think carefully</div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">What to Expect</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-green-50 border border-green-100">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Multiple Choice</div>
                  <div className="text-sm text-gray-600">Choose the best answer from options</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">📊</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Instant Results</div>
                  <div className="text-sm text-gray-600">Get detailed feedback immediately</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">⇄</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Navigate Freely</div>
                  <div className="text-sm text-gray-600">Go back and review your answers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={onStartQuiz}
              className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
              <span className="relative flex items-center">
                <span className="mr-2">🚀</span>
                Start Quiz Challenge
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Ready to test your knowledge? Click above to begin!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;