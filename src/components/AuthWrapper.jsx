import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AdminLoginForm from './AdminLoginForm';

const AuthWrapper = ({ onAuthSuccess, isAdmin = false }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = () => {
    onAuthSuccess?.();
  };

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  // If this is for admin access, show admin login only
  if (isAdmin) {
    return (
      <div>
        <AdminLoginForm onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // For regular users, show login/register toggle
  return (
    <div>
      {isLogin ? (
        <LoginForm 
          onSwitchToRegister={switchToRegister}
          onSuccess={handleAuthSuccess}
        />
      ) : (
        <RegisterForm 
          onSwitchToLogin={switchToLogin}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default AuthWrapper;
