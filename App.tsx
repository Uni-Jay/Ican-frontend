import React, { useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigations/MainNavigator';
import AuthNavigator from './src/navigations/AuthNavigator'; // your login/signup navigator
import { navigationRef } from './src/navigations/navigationRef';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a365d"
        translucent={Platform.OS === 'android'}
      />
      {!isAuthenticated ? (
        <AuthNavigator onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <MainNavigator onLogout={() => setIsAuthenticated(false)} />
      )}
    </NavigationContainer>
  );
};

export default App;
