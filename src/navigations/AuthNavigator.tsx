import React, { useState, FC } from "react";
<<<<<<< HEAD
import LoginScreenSimple from "../screens/auths/LoginScreenSimple";
import RegisterScreenSimple from "../screens/auths/RegisterScreenSimple";
=======
import LoginScreen from "../screens/auths/LoginScreen";
import RegisterScreen from "../screens/auths/RegisterScreen";
>>>>>>> feat: update project
import ForgotPasswordScreen from "../screens/auths/ForgotPasswordScreen";
import { useAuth } from "../contexts/AuthContext";

type ScreenName = "login" | "register" | "forgot";

const AuthNavigator: FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("login");
  const { isAuthenticated } = useAuth();

  const navigateToScreen = (screenName: ScreenName) => {
    setCurrentScreen(screenName);
  };

  const handleAuthSuccess = () => {
    // The context will handle the authentication state change
    // No need to do anything here as the app will automatically navigate
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
<<<<<<< HEAD
          <LoginScreenSimple
=======
          <LoginScreen
>>>>>>> feat: update project
            onLogin={handleAuthSuccess}
            navigate={navigateToScreen}
          />
        );
      case "register":
        return (
<<<<<<< HEAD
          <RegisterScreenSimple
=======
          <RegisterScreen
>>>>>>> feat: update project
            navigate={navigateToScreen}
            onRegister={handleAuthSuccess}
          />
        );
      case "forgot":
        return <ForgotPasswordScreen navigate={navigateToScreen} />;
      default:
        return (
<<<<<<< HEAD
          <LoginScreenSimple
=======
          <LoginScreen
>>>>>>> feat: update project
            onLogin={handleAuthSuccess}
            navigate={navigateToScreen}
          />
        );
    }
  };

  return renderScreen();
};

export default AuthNavigator;
