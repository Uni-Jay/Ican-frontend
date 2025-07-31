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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { theme } from "../../styles/theme";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

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

    const success = await login({
      email: email.toLowerCase().trim(),
      password,
    });

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
              onPress={handleLogin}
              variant="primary"
              size="lg"
              disabled={isLoading}
              loading={isLoading}
              fullWidth
              style={{ marginTop: theme.spacing[6] }}
            />

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
              <Button
                title="Sign Up"
                onPress={() => navigate("register")}
                variant="ghost"
                size="sm"
              />
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
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: theme.spacing[6],
  },
  header: {
    backgroundColor: theme.colors.primary[500],
    paddingTop: theme.layout.isWeb ? theme.spacing[6] : theme.spacing[12],
    paddingBottom: theme.spacing[10],
    alignItems: "center",
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing[6],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  dividerText: {
    marginHorizontal: theme.spacing[4],
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
  },
  biometricButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
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
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing[4],
  },
  signupText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    marginRight: theme.spacing[2],
  },
});

export default LoginScreen;
