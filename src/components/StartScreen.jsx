import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthWrapper from './AuthWrapper';
import ProfileEdit from './ProfileEdit';

const StartScreen = ({ onStartQuiz, onShowAdmin, onAdminLoginSuccess, totalQuestions, timeLimit, isQuizActive, quizUsername, setQuizUsername }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4 lg:p-8">
      <div className="max-w-4xl xl:max-w-6xl w-full mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">
                    {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-800 font-semibold text-lg">
                      Welcome back, {user?.first_name || user?.username}!
                    </div>
                    {user?.is_staff && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                        Staff
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm">{user?.email}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-lg">
                Take the quiz to test your knowledge
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            {!isAuthenticated && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2"
              >
                <span className="text-lg">🔐</span>
                <span>Login / Register</span>
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={() => setShowProfileEdit(true)}
                className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 border border-blue-200 shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                <span className="text-lg">✏️</span>
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={() => {
                if (isAuthenticated && user?.is_staff) {
                  onShowAdmin();
                } else {
                  setShowAdminModal(true);
                }
              }}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2"
            >
              <span className="text-lg">⚙️</span>
              <span>Admin Panel</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={logout}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>


        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-2xl">🧠</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Quiz Challenge
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {isAuthenticated 
              ? `Welcome back, ${user?.first_name || user?.username}! Ready to test your knowledge?`
              : "Test your knowledge with our comprehensive quiz platform. Challenge yourself and see how much you really know!"
            }
          </p>
        </div>

        {!isQuizActive && (
          <div className="bg-yellow-100 border border-yellow-400 rounded-2xl p-6 text-center mb-8">
            <div className="text-yellow-600 font-semibold text-lg">
              ⚠️ Quiz is currently under maintenance
            </div>
            <p className="text-yellow-700 mt-2">
              The quiz is temporarily unavailable. Please check back later.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Username Input for Anonymous Users */}
          {!isAuthenticated && (
            <div className="mb-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Enter Your Name (Optional)
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Your name will be displayed in the admin panel for tracking purposes
                </p>
              </div>
              
              <div className="max-w-sm mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={quizUsername}
                    onChange={(e) => setQuizUsername(e.target.value)}
                    placeholder="Enter your name (optional)"
                    className="w-full px-6 py-4 text-lg text-center font-medium bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-gray-400 text-xl">✏️</span>
                  </div>
                </div>
                {quizUsername && (
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Playing as: {quizUsername}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📝</span>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {totalQuestions === "..." ? (
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                ) : (
                  totalQuestions
                )}
              </div>
              <div className="text-gray-600 font-semibold text-lg">Questions</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⏱️</span>
              </div>
              <div className="text-4xl font-bold text-amber-600 mb-2">{timeLimit}</div>
              <div className="text-gray-600 font-semibold text-lg">Minutes</div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onStartQuiz}
              disabled={!isQuizActive}
              className={`group relative inline-flex items-center justify-center px-16 py-6 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                isQuizActive 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center">
                <span className="mr-3 text-2xl">🚀</span>
                {isQuizActive ? 'Start Quiz Challenge' : 'Quiz Unavailable'}
                <span className="ml-3 text-xl transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
            
            <p className="text-gray-500 mt-6 text-lg">
              {isQuizActive 
                ? 'Ready to test your knowledge? Click above to begin!' 
                : 'Please check back later when the quiz is active.'
              }
            </p>
          </div>
        </div>

        {/* Regular User Authentication Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 relative">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔐</span>
                    <div>
                      <h2 className="text-xl font-bold">Welcome Back</h2>
                      <p className="text-blue-100 text-sm mt-1">Sign in to your account or create a new one</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
                  >
                    <span className="text-lg">×</span>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <AuthWrapper 
                  onAuthSuccess={() => setShowAuthModal(false)} 
                  isAdmin={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Admin Authentication Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto border border-gray-200 relative">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl p-4 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⚙️</span>
                    <div>
                      <h2 className="text-base font-bold">Admin Access</h2>
                      <p className="text-blue-100 text-xs mt-1">Sign in to access the admin panel</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAdminModal(false)}
                    className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
                  >
                    <span className="text-lg">×</span>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <AuthWrapper 
                  onAuthSuccess={() => {
                    setShowAdminModal(false);
                    onAdminLoginSuccess();
                  }} 
                  isAdmin={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Profile Edit Modal */}
        {showProfileEdit && (
          <ProfileEdit onClose={() => setShowProfileEdit(false)} />
        )}
      </div>
    </div>
  );
};

export default StartScreen;