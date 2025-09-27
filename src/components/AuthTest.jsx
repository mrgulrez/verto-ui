import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-semibold mb-2">Authentication Status</h3>
      <p className="text-green-700">✅ Authenticated as: {user?.username}</p>
      <p className="text-green-700">📧 Email: {user?.email}</p>
      <p className="text-green-700">👤 Name: {user?.first_name} {user?.last_name}</p>
      <p className="text-green-700">🔑 Staff: {isStaff ? 'Yes' : 'No'}</p>
      <button
        onClick={logout}
        className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default AuthTest;
