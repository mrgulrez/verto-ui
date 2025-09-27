import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quizService';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [config, setConfig] = useState({
    timer_duration: 10,
    is_active: true,
    max_attempts: 1,
    show_results_immediately: true
  });
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState({});
  const [questionStats, setQuestionStats] = useState([]);
  const [activeTab, setActiveTab] = useState('config');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dataLoading, setDataLoading] = useState({
    config: false,
    stats: false,
    attempts: false,
    questions: false
  });
  const [error, setError] = useState({
    config: null,
    stats: null,
    attempts: null,
    questions: null
  });
  const [backendStatus, setBackendStatus] = useState(null);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    fetchConfig();
    fetchStats();
  }, []);

  const fetchConfig = async () => {
    setDataLoading(prev => ({ ...prev, config: true }));
    setError(prev => ({ ...prev, config: null }));
    try {
      const response = await quizService.getQuizConfig();
      setConfig(response);
    } catch (error) {
      console.error('Failed to fetch config:', error);
      setError(prev => ({ ...prev, config: 'Failed to load configuration' }));
    } finally {
      setDataLoading(prev => ({ ...prev, config: false }));
    }
  };

  const fetchStats = async () => {
    setDataLoading(prev => ({ ...prev, stats: true }));
    setError(prev => ({ ...prev, stats: null }));
    try {
      const response = await quizService.getQuizStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError(prev => ({ ...prev, stats: 'Failed to load statistics' }));
    } finally {
      setDataLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const fetchAttempts = async () => {
    setDataLoading(prev => ({ ...prev, attempts: true }));
    setError(prev => ({ ...prev, attempts: null }));
    try {
      const response = await quizService.getQuizAttempts();
      setAttempts(response);
    } catch (error) {
      console.error('Failed to fetch attempts:', error);
      setError(prev => ({ ...prev, attempts: 'Failed to load attempts' }));
    } finally {
      setDataLoading(prev => ({ ...prev, attempts: false }));
    }
  };

  const fetchQuestionStats = async () => {
    setDataLoading(prev => ({ ...prev, questions: true }));
    setError(prev => ({ ...prev, questions: null }));
    try {
      const response = await quizService.getQuestionStats();
      setQuestionStats(response);
    } catch (error) {
      console.error('Failed to fetch question stats:', error);
      setError(prev => ({ ...prev, questions: 'Failed to load question statistics' }));
    } finally {
      setDataLoading(prev => ({ ...prev, questions: false }));
    }
  };

  const checkBackendStatus = async () => {
    try {
      const status = await quizService.getBackendStatus();
      setBackendStatus(status);
    } catch (error) {
      console.error('Failed to check backend status:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    onBack?.();
  };

  const handleConfigUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await quizService.updateQuizConfig(config);
      setMessage('Configuration updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Quiz Admin Panel</h1>
                <p className="text-blue-100 text-lg">Manage your quiz settings and view analytics</p>
                {user && (
                  <p className="text-blue-200 text-sm mt-1">
                    Welcome, {user.first_name || user.username} {user.is_staff && '(Staff)'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onBack}
                className="bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                ← Back to Quiz
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'config'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">⚙️</span>
                <span>Configuration</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('stats'); fetchStats(); }}
              className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">📊</span>
                <span>Statistics</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('attempts'); fetchAttempts(); }}
              className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'attempts'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">📋</span>
                <span>Attempts</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('questions'); fetchQuestionStats(); }}
              className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'questions'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">❓</span>
                <span>Questions</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('debug'); checkBackendStatus(); }}
              className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'debug'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🔧</span>
                <span>Debug</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'config' && (
              <form onSubmit={handleConfigUpdate} className="space-y-6">
                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timer Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={config.timer_duration}
                      onChange={(e) => handleInputChange('timer_duration', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Attempts
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={config.max_attempts}
                      onChange={(e) => handleInputChange('max_attempts', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Quiz Active</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.show_results_immediately}
                      onChange={(e) => handleInputChange('show_results_immediately', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Show Results Immediately</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Save Configuration'
                  )}
                </button>
              </form>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                {dataLoading.stats && (
                  <div className="flex justify-center items-center py-8">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span>Loading statistics...</span>
                    </div>
                  </div>
                )}

                {error.stats && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-red-400 mr-2">⚠️</div>
                      <div className="text-red-700">
                        {error.stats}
                        <button 
                          onClick={fetchStats}
                          className="bg-red-100 text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200 ml-2 text-sm"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!dataLoading.stats && !error.stats && (
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total_attempts || 0}</div>
                      <div className="text-gray-600">Total Attempts</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{stats.average_score || 0}%</div>
                      <div className="text-gray-600">Average Score</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {stats.average_time_taken ? formatTime(stats.average_time_taken) : '0m 0s'}
                      </div>
                      <div className="text-gray-600">Average Time</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-amber-600 mb-2">{stats.total_questions || 0}</div>
                      <div className="text-gray-600">Total Questions</div>
                    </div>
                  </div>
                )}

                {stats.score_distribution && (
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Distribution</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.score_distribution.excellent || 0}</div>
                        <div className="text-sm text-gray-600">Excellent (90-100%)</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.score_distribution.good || 0}</div>
                        <div className="text-sm text-gray-600">Good (70-89%)</div>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">{stats.score_distribution.average || 0}</div>
                        <div className="text-sm text-gray-600">Average (50-69%)</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{stats.score_distribution.poor || 0}</div>
                        <div className="text-sm text-gray-600">Needs Improvement (&lt;50%)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'attempts' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Attempts</h3>
                  <div className="flex items-center space-x-2">
                    {dataLoading.attempts && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Loading...</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">{attempts.length} attempts</span>
                  </div>
                </div>

                {error.attempts && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-red-400 mr-2">⚠️</div>
                      <div className="text-red-700">
                        {error.attempts}
                        <button 
                          onClick={fetchAttempts}
                          className="bg-red-100 text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200 ml-2 text-sm"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!dataLoading.attempts && !error.attempts && (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                      <tbody className="divide-y divide-gray-200">
                        {attempts.length > 0 ? (
                          attempts.map((attempt) => (
                            <tr key={attempt.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {attempt.username || attempt.username_display || 'Anonymous'}
                                  </span>
                                  {attempt.user && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      Registered
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Session: {attempt.user_session?.slice(0, 8)}...
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`font-semibold ${
                                  attempt.percentage >= 70 ? 'text-green-600' : 
                                  attempt.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {attempt.percentage}%
                                </span>
                                <span className="text-gray-500 ml-1">
                                  ({attempt.score}/{attempt.total_questions})
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatTime(attempt.time_taken)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatDate(attempt.completed_at)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                              No attempts found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Question Statistics</h3>
                  <div className="flex items-center space-x-2">
                    {dataLoading.questions && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Loading...</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">{questionStats.length} questions</span>
                  </div>
                </div>

                {error.questions && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-red-400 mr-2">⚠️</div>
                      <div className="text-red-700">
                        {error.questions}
                        <button 
                          onClick={fetchQuestionStats}
                          className="bg-red-100 text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200 ml-2 text-sm"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!dataLoading.questions && !error.questions && (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {questionStats.length > 0 ? (
                          questionStats.map((question) => (
                            <tr key={question.question_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                                {question.question_text}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {question.difficulty}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {question.total_attempts}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`font-semibold ${
                                  question.accuracy >= 70 ? 'text-green-600' : 
                                  question.accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {question.accuracy}%
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                              No question statistics available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'debug' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Backend Debug Information</h3>
                  <button
                    onClick={checkBackendStatus}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Refresh Status
                  </button>
                </div>

                {backendStatus && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Connection Status</h4>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${backendStatus.isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={backendStatus.isHealthy ? 'text-green-600' : 'text-red-600'}>
                          {backendStatus.isHealthy ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {backendStatus.lastError && (
                        <p className="text-red-600 text-sm mt-2">Error: {backendStatus.lastError}</p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">API Configuration</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Base URL:</strong> {backendStatus.baseUrl}</p>
                        <p><strong>Timeout:</strong> {backendStatus.timeout}ms</p>
                        <p><strong>Question Stats Endpoint:</strong> {backendStatus.endpoints.ADMIN_QUESTION_STATS}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Troubleshooting Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Check if your backend server is running on {backendStatus.baseUrl}</li>
                        <li>• Verify the question stats endpoint is implemented</li>
                        <li>• Check backend logs for any errors</li>
                        <li>• Try increasing the timeout if the endpoint is slow</li>
                        <li>• Ensure CORS is properly configured on the backend</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Current Behavior</h4>
                      <p className="text-sm text-yellow-700">
                        The app will automatically retry failed requests and fall back to mock data if the backend is unavailable. 
                        This ensures the admin panel remains functional even when the backend is slow or down.
                      </p>
                    </div>
                  </div>
                )}

                {!backendStatus && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Click "Refresh Status" to check backend connection</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;