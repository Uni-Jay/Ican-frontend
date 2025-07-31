import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

interface RegisterScreenProps {
  navigate: (screen: "login" | "forgot") => void;
  onRegister: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  membershipId?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterScreenSimple: React.FC<RegisterScreenProps> = ({
  navigate,
  onRegister,
}) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    membershipId: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert("Registration Error", error);
      clearError();
    }
  }, [error]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateField = (field: keyof FormData, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value.trim()))
          return "Name can only contain letters and spaces";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^(\+234|0)[789][01]\d{8}$/.test(value.replace(/\s/g, ""))) {
          return "Please enter a valid Nigerian phone number";
        }
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])/.test(value))
          return "Password must contain at least one lowercase letter";
        if (!/(?=.*[A-Z])/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/(?=.*\d)/.test(value))
          return "Password must contain at least one number";
        if (!/(?=.*[@$!%*?&])/.test(value))
          return "Password must contain at least one special character";
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";

      case "membershipId":
        if (value && !/^ICAN\/\d{4}\/\d{3,6}$/i.test(value)) {
          return "Membership ID format: ICAN/YYYY/XXX";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const field = key as keyof FormData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldValidation = (field: keyof FormData, value: string) => {
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error || undefined,
    }));
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const success = await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        membershipId: formData.membershipId.trim() || undefined,
      });

      if (success) {
        onRegister();
      }
    } catch (err: any) {
      // Handle backend validation errors
      if (err.response?.data?.errors) {
        const backendErrors: FormErrors = {};

        // Map backend errors to form fields
        err.response.data.errors.forEach((error: any) => {
          if (error.field) {
            backendErrors[error.field as keyof FormErrors] = error.message;
          }
        });

        setErrors((prev) => ({ ...prev, ...backendErrors }));
      } else if (err.response?.data?.message) {
        // Show general error message
        Alert.alert("Registration Error", err.response.data.message);
      }
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigate("login")}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.registerTitle}>Join ICAN</Text>
            <Text style={styles.registerSubtext}>
              Create your account to access professional development resources
            </Text>
          </View>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtext}>
              Fill in your details to get started
            </Text>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name ? styles.inputError : null,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(value) => {
                    handleInputChange("name", value);
                    handleFieldValidation("name", value);
                  }}
                  autoCapitalize="words"
                />
              </View>
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}

              <View
                style={[
                  styles.inputWrapper,
                  errors.email ? styles.inputError : null,
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
                  value={formData.email}
                  onChangeText={(value) => {
                    handleInputChange("email", value);
                    handleFieldValidation("email", value);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}

              <View
                style={[
                  styles.inputWrapper,
                  errors.phone ? styles.inputError : null,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number (e.g., 08012345678)"
                  value={formData.phone}
                  onChangeText={(value) => {
                    handleInputChange("phone", value);
                    handleFieldValidation("phone", value);
                  }}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : null}

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ICAN Membership ID (Optional) - ICAN/YYYY/XXX"
                  value={formData.membershipId}
                  onChangeText={(value) => {
                    handleInputChange("membershipId", value);
                    handleFieldValidation("membershipId", value);
                  }}
                  autoCapitalize="characters"
                />
              </View>
              {errors.membershipId ? (
                <Text style={styles.errorText}>{errors.membershipId}</Text>
              ) : null}

              <View
                style={[
                  styles.inputWrapper,
                  errors.password ? styles.inputError : null,
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
                  placeholder="Password (8+ chars, uppercase, lowercase, number, special)"
                  value={formData.password}
                  onChangeText={(value) => {
                    handleInputChange("password", value);
                    handleFieldValidation("password", value);
                    // Also validate confirm password if it exists
                    if (formData.confirmPassword) {
                      handleFieldValidation(
                        "confirmPassword",
                        formData.confirmPassword
                      );
                    }
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
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}

              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword ? styles.inputError : null,
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
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => {
                    handleInputChange("confirmPassword", value);
                    handleFieldValidation("confirmPassword", value);
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.registerButton,
                isLoading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={[styles.registerButtonText, { marginLeft: 10 }]}>
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigate("login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#3182ce",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  registerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  registerSubtext: {
    fontSize: 16,
    color: "#e2e8f0",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 5,
  },
  registerButton: {
    backgroundColor: "#3182ce",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 16,
  },
  loginLink: {
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
  },
});

export default RegisterScreenSimple;
