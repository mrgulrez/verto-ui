import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminLoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      console.log('Login result:', result); // Debug log
      if (result.success) {
        // Check if user is staff
        console.log('User data:', result.user); // Debug log
        console.log('Is staff:', result.user?.is_staff); // Debug log
        console.log('All user fields:', Object.keys(result.user || {})); // Debug log
        
        // Check multiple possible field names for staff status
        const isStaff = result.user?.is_staff || result.user?.isStaff || result.user?.staff || false;
        console.log('Final staff check:', isStaff); // Debug log
        
        if (isStaff) {
          onSuccess?.();
        } else {
          setError('Access denied. Staff privileges required for admin panel.');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="text-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
            <span className="text-white text-lg">⚙️</span>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Admin Access</h3>
          <p className="text-gray-600 text-xs">Sign in to access the admin panel</p>
        </div>
        
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 text-base font-medium bg-white border-2 border-gray-200 rounded-t-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 placeholder-gray-400"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 text-base font-medium bg-white border-2 border-gray-200 rounded-b-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 placeholder-gray-400"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="text-red-400 mr-2">⚠️</div>
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <h4 className="text-blue-800 font-semibold mb-1 text-center text-xs">Test Credentials</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Username:</span>
                  <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-mono">adminuser</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Password:</span>
                  <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-mono">admin123</code>
                </div>
              </div>
              <p className="text-blue-600 text-xs mt-1 text-center">
                Use these credentials to test admin functionality
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
