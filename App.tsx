import React from "react";
import { StatusBar, Platform, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigations/MainNavigator";
import AuthNavigator from "./src/navigations/AuthNavigator";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f7fafc",
        }}
      >
        <ActivityIndicator size="large" color="#3182ce" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a365d"
        translucent={Platform.OS === "android"}
      />
      {!isAuthenticated ? <AuthNavigator /> : <MainNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
