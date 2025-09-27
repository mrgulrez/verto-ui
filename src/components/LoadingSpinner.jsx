import React from 'react';

const LoadingSpinner = ({ message = "Loading quiz questions..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full backdrop-blur-sm bg-white/90">
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
              <div className="text-2xl animate-bounce">🧠</div>
            </div>
          </div>
          
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">Please Wait</h3>
          <p className="text-gray-600">{message}</p>
          
          <div className="flex justify-center space-x-2 pt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;