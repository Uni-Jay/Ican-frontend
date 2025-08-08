import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
} from '../types/api';
import apiService from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<boolean>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('user_data');

      if (token) {
        // If we have stored user data, use it immediately for better UX
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            dispatch({ type: 'AUTH_SUCCESS', payload: userData });
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }

        // Try to get fresh user profile to verify token is still valid
        try {
          const response = await apiService.getUserProfile();
          if (response.success && response.data && response.data.user) {
            // Update with fresh data
            await AsyncStorage.setItem(
              'user_data',
              JSON.stringify(response.data.user)
            );
            dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
          } else {
            // Token might be invalid, try getCurrentUser as fallback
            const fallbackResponse = await apiService.getCurrentUser();
            if (fallbackResponse.success && fallbackResponse.data) {
              await AsyncStorage.setItem(
                'user_data',
                JSON.stringify(fallbackResponse.data)
              );
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: fallbackResponse.data,
              });
            } else {
              throw new Error('Unable to fetch user data');
            }
          }
        } catch (apiError) {
          console.error('API error during auth check:', apiError);

          // If we have stored user data, continue using it
          if (storedUser) {
            console.log('Using stored user data due to API error');
            return; // Keep the stored user data
          } else {
            // No stored data and API failed, logout
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        }
      } else {
        // No token, clear everything
        await AsyncStorage.removeItem('user_data');
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear invalid token and user data
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await apiService.login(credentials);

      if (response.success && response.data) {
        // Store user data locally for persistence
        await AsyncStorage.setItem(
          'user_data',
          JSON.stringify(response.data.user)
        );
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
        return true;
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Login failed',
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await apiService.register(userData);

      if (response.success && response.data) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
        return true;
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Registration failed',
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const forgotPassword = async (
    data: ForgotPasswordRequest
  ): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await apiService.forgotPassword(data);

      if (response.success) {
        dispatch({ type: 'CLEAR_ERROR' });
        return true;
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Failed to send reset email',
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send reset email';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
