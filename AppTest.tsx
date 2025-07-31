import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AppTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ICAN Portal Test</Text>
      <Text style={styles.subtitle}>If you can see this, React Native Web is working!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3182ce",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default AppTest;
