import React from "react";
import {
  StatusBar,
  Platform,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigations/MainNavigator";
import AuthNavigator from "./src/navigations/AuthNavigator";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3182ce" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#1a365d"
          translucent={Platform.OS === "android"}
        />
        {!isAuthenticated ? <AuthNavigator /> : <MainNavigator />}
      </NavigationContainer>
    </View>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },
});

export default App;
