import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
<<<<<<< HEAD
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { theme } from "../../styles/theme";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
=======
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
>>>>>>> feat: update project

const { width, height } = Dimensions.get("window");

type LoginScreenProps = {
  onLogin: () => void;
  navigate: (screen: "forgot" | "register" | "dashboard") => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const { login, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    if (error) {
      Alert.alert("Login Error", error);
      clearError();
    }
  }, [error]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }
<<<<<<< HEAD

    const success = await login({
      email: email.toLowerCase().trim(),
      password,
    });

=======

    const success = await login({
      email: email.toLowerCase().trim(),
      password,
    });

>>>>>>> feat: update project
    if (success) {
      onLogin();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>ICAN</Text>
              </View>
              <Text style={styles.appTitle}>EduHack</Text>
              <Text style={styles.subtitle}>
                Institute of Chartered Accountants of Nigeria
              </Text>
            </View>
          </View>

<<<<<<< HEAD
          <Card variant="elevated" padding="lg" style={styles.formCard}>
            <View style={styles.titleContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.loginSubtext}>
                Sign in to continue your professional development journey
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                leftIcon="mail-outline"
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                variant="filled"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError("");
                }}
                leftIcon="lock-closed-outline"
                rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
                onRightIconPress={() => setShowPassword(!showPassword)}
                error={passwordError}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                variant="filled"
              />
            </View>

            <View style={styles.forgotContainer}>
              <Button
                title="Forgot Password?"
                onPress={() => navigate("forgot")}
                variant="ghost"
                size="sm"
              />
            </View>

            <Button
              title={isLoading ? "Signing In..." : "Sign In"}
=======
          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.loginSubtext}>
              Sign in to continue to your account
            </Text>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  emailError ? styles.inputError : null,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <View
                style={[
                  styles.inputWrapper,
                  passwordError ? styles.inputError : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigate("forgot")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
>>>>>>> feat: update project
              onPress={handleLogin}
              variant="primary"
              size="lg"
              disabled={isLoading}
<<<<<<< HEAD
              loading={isLoading}
              fullWidth
              style={{ marginTop: theme.spacing[6] }}
            />
=======
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>
                    Signing In...
                  </Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
>>>>>>> feat: update project

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.biometricButton}>
              <Ionicons name="finger-print" size={24} color="#3182ce" />
              <Text style={styles.biometricText}>Use Biometric Login</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
<<<<<<< HEAD
              <Button
                title="Sign Up"
                onPress={() => navigate("register")}
                variant="ghost"
                size="sm"
              />
=======
              <TouchableOpacity onPress={() => navigate("register")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
>>>>>>> feat: update project
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: theme.colors.background.secondary,
=======
    backgroundColor: "#f7fafc",
>>>>>>> feat: update project
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: theme.spacing[6],
  },
  header: {
<<<<<<< HEAD
    backgroundColor: theme.colors.primary[500],
    paddingTop: theme.layout.isWeb ? theme.spacing[6] : theme.spacing[12],
    paddingBottom: theme.spacing[10],
    alignItems: "center",
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
=======
    backgroundColor: "#1a365d",
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
>>>>>>> feat: update project
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
<<<<<<< HEAD
    backgroundColor: theme.colors.secondary[500],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[4],
    ...theme.shadows.md,
  },
  logoText: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  appTitle: {
    fontSize: theme.typography.fontSize["4xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[100],
    textAlign: "center",
    paddingHorizontal: theme.spacing[5],
    lineHeight: theme.typography.lineHeight.relaxed,
=======
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a365d",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5e0",
    textAlign: "center",
    paddingHorizontal: 20,
>>>>>>> feat: update project
  },
  formCard: {
    marginHorizontal: theme.spacing[6],
    marginTop: -theme.spacing[8],
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  welcomeText: {
<<<<<<< HEAD
    fontSize: theme.typography.fontSize["3xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  loginSubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  inputContainer: {
    marginBottom: theme.spacing[6],
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: theme.spacing[6],
=======
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 8,
  },
  loginSubtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: "#1a202c",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#3182ce",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#3182ce",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#3182ce",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    width: "100%",
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
>>>>>>> feat: update project
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
<<<<<<< HEAD
    marginVertical: theme.spacing[6],
=======
    marginBottom: 20,
>>>>>>> feat: update project
  },
  dividerLine: {
    flex: 1,
    height: 1,
<<<<<<< HEAD
    backgroundColor: theme.colors.border.light,
  },
  dividerText: {
    marginHorizontal: theme.spacing[4],
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
=======
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
>>>>>>> feat: update project
  },
  biometricButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[4],
    marginBottom: theme.spacing[6],
    backgroundColor: theme.colors.primary[50],
  },
  biometricText: {
    marginLeft: theme.spacing[3],
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.medium,
    fontSize: theme.typography.fontSize.base,
=======
    borderColor: "#3182ce",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 30,
  },
  biometricText: {
    marginLeft: 10,
    color: "#3182ce",
    fontWeight: "600",
>>>>>>> feat: update project
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
<<<<<<< HEAD
    alignItems: "center",
    marginTop: theme.spacing[4],
  },
  signupText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    marginRight: theme.spacing[2],
=======
  },
  signupText: {
    color: "#666",
    fontSize: 16,
  },
  signupLink: {
    color: "#3182ce",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputError: {
    borderColor: "#e53e3e",
    borderWidth: 2,
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
>>>>>>> feat: update project
  },
});

export default LoginScreen;
