import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  membershipId: string;
  password: string;
  confirmPassword: string;
};

type RegisterScreenProps = {
  navigate: (screen: 'login' | 'dashboard') => void;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigate }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    membershipId: '',
    password: '',
    confirmPassword: '',
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    key: keyof FormData,
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setFormData({ ...formData, [key]: event.nativeEvent.text });
  };

  const handleRegister = async () => {
    const { firstName, lastName, email, membershipId, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !membershipId || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://team1-ican-hackathon-api.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: `${firstName} ${lastName}`,
          email,
          phone_number: membershipId,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message || 'Account created successfully!', [
          { text: 'OK', onPress: () => navigate('login') },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <Text style={styles.headerText}>Create Account</Text>

          {/* First Name */}
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChange={(e) => handleChange('firstName', e)}
            value={formData.firstName}
          />

          {/* Last Name */}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChange={(e) => handleChange('lastName', e)}
            value={formData.lastName}
          />

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChange={(e) => handleChange('email', e)}
            value={formData.email}
            autoCapitalize="none"
          />

          {/* Membership ID */}
          <TextInput
            style={styles.input}
            placeholder="Membership ID"
            onChange={(e) => handleChange('membershipId', e)}
            value={formData.membershipId}
            autoCapitalize="none"
          />

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              onChange={(e) => handleChange('password', e)}
              value={formData.password}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              secureTextEntry={!isConfirmPasswordVisible}
              onChange={(e) => handleChange('confirmPassword', e)}
              value={formData.confirmPassword}
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <Ionicons
                name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigate('login')}>
            <Text style={styles.loginLink}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#1E90FF',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default RegisterScreen;
