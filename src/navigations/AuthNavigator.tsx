import React, { useState, FC } from 'react';
import LoginScreen from '../screens/auths/LoginScreen';
import RegisterScreen from '../screens/auths/RegisterScreen';
import ForgotPasswordScreen from '../screens/auths/ForgotPasswordScreen';

type ScreenName = 'login' | 'register' | 'forgot' | 'dashboard';

interface AuthNavigatorProps {
  onLogin: () => void;
}

const AuthNavigator: FC<AuthNavigatorProps> = ({ onLogin }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('login');

  const navigateToScreen = (screenName: ScreenName) => {
    setCurrentScreen(screenName);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={onLogin} navigate={navigateToScreen} />;
      case 'register':
        return <RegisterScreen navigate={navigateToScreen} />;
      case 'forgot':
        return <ForgotPasswordScreen navigate={navigateToScreen} />;
      default:
        return <LoginScreen onLogin={onLogin} navigate={navigateToScreen} />;
    }
  };

  return renderScreen();
};

export default AuthNavigator;
