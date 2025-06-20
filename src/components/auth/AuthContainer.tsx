import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

interface AuthContainerProps {
  onAuthSuccess?: () => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  return (
    <>
      {isLogin ? (
        <Login onSwitchToRegister={switchToRegister} onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}; 