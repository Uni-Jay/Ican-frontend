# ICAN ExamHack - Frontend Application

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Navigation-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Navigation" />
</div>

<div align="center">
  <h3>🏆 ICAN Hackathon 2024 - Team 1 Submission</h3>
  <p><strong>A Modern, Professional Member Portal for the Institute of Chartered Accountants of Nigeria</strong></p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [API Integration](#api-integration)
- [Styling & Theming](#styling--theming)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🎯 Overview

The ICAN ExamHack Frontend is a comprehensive React Native application built with Expo, designed to serve as the primary interface for ICAN members. This application provides a modern, intuitive, and feature-rich platform for professional development, financial management, event participation, and community engagement.

### 🌟 Key Highlights

- **Cross-Platform**: Runs seamlessly on iOS, Android, and Web
- **Modern UI/UX**: Professional design with warm, educational aesthetics
- **Real-Time Features**: Live chat, notifications, and updates
- **Comprehensive Functionality**: Complete member portal with all essential features
- **Production-Ready**: Optimized for performance and scalability

---

## ✨ Features

### 🔐 Authentication & Security
- **Secure Registration**: Multi-step validation with real-time feedback
- **JWT Authentication**: Token-based authentication with refresh tokens
- **Password Security**: Strong password requirements with validation
- **Biometric Support**: Ready for fingerprint/face ID integration
- **Session Management**: Automatic token refresh and secure logout

### 📊 Dashboard & Analytics
- **Personalized Dashboard**: Welcome section with user avatar and details
- **Financial Overview**: Account balance, transaction history, and payment tracking
- **CPD Progress**: Continuing Professional Development points and module tracking
- **Quick Actions**: One-tap access to frequently used features
- **Real-Time Stats**: Live updates on events, notifications, and activities

### 💰 Financial Services
- **Payment Processing**: Secure dues payment with multiple payment methods
- **Transaction History**: Detailed financial records and receipts
- **Balance Management**: Real-time account balance tracking
- **Payment Verification**: Automated payment confirmation system
- **Financial Reports**: Comprehensive financial summaries

### 📚 Continuing Professional Development (CPD)
- **Module Catalog**: Browse and enroll in CPD modules
- **Progress Tracking**: Monitor completion status and earned points
- **Interactive Learning**: Engaging educational content
- **Certification**: Digital certificates upon completion
- **Requirements Tracking**: Monitor annual CPD requirements

### 🎉 Events Management
- **Event Discovery**: Browse upcoming ICAN events and conferences
- **Registration System**: Seamless event registration and payment
- **Calendar Integration**: Personal event calendar and reminders
- **Event Details**: Comprehensive event information and schedules
- **Networking**: Connect with other attendees

### 🗳️ Voting & Surveys
- **Democratic Participation**: Vote in ICAN elections and polls
- **Survey Participation**: Contribute to professional development surveys
- **Results Tracking**: View voting results and survey outcomes
- **Anonymous Voting**: Secure and private voting system
- **Poll Creation**: Create polls for community engagement

### 💬 Communication & Chat
- **Real-Time Messaging**: Live chat with other ICAN members
- **Study Groups**: Join or create study groups for collaboration
- **Professional Networks**: Connect with peers in your field
- **Announcements**: Receive important updates and notifications
- **Moderated Channels**: Safe and professional communication environment

### 🔔 Notifications
- **Push Notifications**: Real-time alerts for important updates
- **Email Integration**: Synchronized email notifications
- **Customizable Preferences**: Control notification types and frequency
- **Priority Levels**: Different notification levels for various events
- **Notification History**: Access to past notifications and updates

---

## 🛠️ Technology Stack

### **Core Framework**
- **React Native**: 0.72.x - Cross-platform mobile development
- **Expo**: 49.x - Development platform and build tools
- **TypeScript**: 5.x - Type-safe JavaScript development

### **Navigation & State Management**
- **React Navigation**: 6.x - Navigation library for React Native
- **Context API**: Built-in React state management
- **AsyncStorage**: Local data persistence

### **UI & Styling**
- **React Native Elements**: UI component library
- **Expo Vector Icons**: Comprehensive icon library
- **Custom Styling**: Professional design system with consistent theming

### **Networking & API**
- **Axios**: HTTP client for API communication
- **Socket.io Client**: Real-time communication
- **JWT Decode**: Token management and validation

### **Development Tools**
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **Metro**: JavaScript bundler for React Native
- **Expo CLI**: Command-line tools for development

### **Testing & Quality Assurance**
- **Jest**: JavaScript testing framework
- **React Native Testing Library**: Component testing utilities
- **TypeScript Compiler**: Type checking and validation

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your development machine:

### **Required Software**
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: Latest version for version control
- **Expo CLI**: Global installation required

### **Development Environment**
```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 8.x or higher

# Install Expo CLI globally
npm install -g @expo/cli

# Verify Expo CLI installation
expo --version
```

### **Platform-Specific Requirements**

#### **For iOS Development**
- **macOS**: Required for iOS development
- **Xcode**: Latest version from Mac App Store
- **iOS Simulator**: Included with Xcode
- **CocoaPods**: For iOS dependencies

#### **For Android Development**
- **Android Studio**: Latest version
- **Android SDK**: API level 30 or higher
- **Android Emulator**: Configured virtual device
- **Java Development Kit (JDK)**: Version 11 or higher

#### **For Web Development**
- **Modern Browser**: Chrome, Firefox, Safari, or Edge
- **Web Browser Developer Tools**: For debugging

---

## 🚀 Installation

### **1. Clone the Repository**
```bash
# Clone the main repository
git clone https://github.com/your-organization/ican-hackathon.git

# Navigate to the frontend directory
cd ican-hackathon/Ican-frontend
```

### **2. Install Dependencies**
```bash
# Install all project dependencies
npm install

# Verify installation
npm list --depth=0
```

### **3. Install Platform-Specific Dependencies**
```bash
# For iOS (macOS only)
cd ios && pod install && cd ..

# For Android (if using bare React Native)
# Dependencies are automatically handled by Expo
```

### **4. Verify Installation**
```bash
# Check if all dependencies are properly installed
npm run doctor

# Run basic health check
expo doctor
```

---

## ⚙️ Configuration

### **Environment Variables**

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Configure the following variables in `.env`:

```env
# API Configuration
API_BASE_URL=https://team1-ican-hackathon-api.onrender.com
API_TIMEOUT=30000

# Environment
NODE_ENV=development
EXPO_PUBLIC_ENV=development

# App Configuration
APP_NAME=ICAN Portal
APP_VERSION=1.0.0

# Feature Flags
ENABLE_BIOMETRIC_AUTH=true
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_ANALYTICS=false

# Development Settings
DEBUG_MODE=true
LOG_LEVEL=debug
```

### **App Configuration**

Update `app.json` for your specific deployment:

```json
{
  "expo": {
    "name": "ICAN Portal",
    "slug": "ican-portal",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3182ce"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.ican.portal"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3182ce"
      },
      "package": "com.ican.portal"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    }
  }
}
```

---

## 🏃‍♂️ Running the Application

### **Development Mode**

#### **Start the Development Server**
```bash
# Start Expo development server
npm start

# Alternative: Start with specific platform
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web Browser
```

#### **Platform-Specific Commands**
```bash
# iOS Development
npm run ios
# Opens iOS Simulator automatically

# Android Development
npm run android
# Opens Android Emulator automatically

# Web Development
npm run web
# Opens in default web browser at http://localhost:19006
```

### **Production Build**

#### **Build for Production**
```bash
# Build for all platforms
expo build

# Platform-specific builds
expo build:ios     # iOS App Store
expo build:android # Google Play Store
expo build:web     # Web deployment
```

#### **Preview Production Build**
```bash
# Create production preview
expo export

# Serve production build locally
npx serve dist
```

### **Development Workflow**

1. **Start Backend Server** (if running locally):
   ```bash
   cd ../Ican-backend
   npm start
   ```

2. **Start Frontend Development Server**:
   ```bash
   npm start
   ```

3. **Open on Device/Simulator**:
   - **iOS**: Press `i` in terminal or scan QR code with Camera app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in terminal or visit http://localhost:19006

---

## 📁 Project Structure

```
Ican-frontend/
├── 📱 App.tsx                 # Main application entry point
├── 📄 app.json               # Expo configuration
├── 📦 package.json           # Dependencies and scripts
├── 🔧 tsconfig.json          # TypeScript configuration
├── 📝 index.ts               # Application bootstrap
├── 🎨 assets/                # Static assets (images, fonts, etc.)
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
├── 📂 src/                   # Source code directory
│   ├── 🔐 contexts/          # React Context providers
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── 🧩 components/        # Reusable UI components
│   │   ├── ui/               # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── Header.tsx        # Navigation header
│   │   └── CustomDrawer.tsx  # Drawer navigation component
│   ├── 📱 screens/           # Application screens
│   │   ├── auths/            # Authentication screens
│   │   │   ├── LoginScreenSimple.tsx
│   │   │   ├── RegisterScreenSimple.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   └── main/             # Main application screens
│   │       ├── DashboardScreenSimple.tsx
│   │       ├── FinancialScreen.tsx
│   │       ├── CPDScreen.tsx
│   │       ├── EventsScreen.tsx
│   │       ├── ChatScreen.tsx
│   │       ├── Voting.tsx
│   │       └── ProfileSecurityScreen.tsx
│   ├── 🧭 navigations/       # Navigation configuration
│   │   ├── AuthNavigator.tsx # Authentication flow navigation
│   │   ├── MainNavigator.tsx # Main app navigation
│   │   └── DashboardTabs.tsx # Dashboard tab navigation
│   ├── 🌐 services/          # API and external services
│   │   └── api.ts            # API service layer
│   ├── 🎨 styles/            # Styling and theming
│   │   └── theme.ts          # Application theme configuration
│   └── 📝 types/             # TypeScript type definitions
│       └── api.ts            # API response types
└── 📚 docs/                  # Documentation files
    └── API.md                # API integration guide
```

---

## 🔑 Key Components

### **Authentication System**

#### **AuthContext**
```typescript
// src/contexts/AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication methods
  const login = async (credentials: LoginRequest) => { /* ... */ };
  const register = async (userData: RegisterRequest) => { /* ... */ };
  const logout = async () => { /* ... */ };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### **Login Screen**
```typescript
// src/screens/auths/LoginScreenSimple.tsx
const LoginScreenSimple: React.FC<Props> = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Real-time validation
  const validateEmail = (value: string): string => {
    if (!value.trim()) return "Email is required";
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Form submission with error handling
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const success = await login({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (success) onLogin();
    } catch (error) {
      // Handle login errors
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Login form implementation */}
    </SafeAreaView>
  );
};
```

### **Dashboard System**

#### **Dashboard Screen**
```typescript
// src/screens/main/DashboardScreenSimple.tsx
const DashboardScreenSimple: React.FC<Props> = ({ navigation, onLogout }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard data with fallback
  const loadDashboardData = async () => {
    try {
      const [statsResponse, notificationsResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getNotifications({ limit: 5 }),
      ]);

      // Handle successful responses
    } catch (error) {
      // Graceful fallback to mock data
      console.log("API not available, using mock data");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Dashboard content */}
      </ScrollView>
    </SafeAreaView>
  );
};
```

### **Navigation System**

#### **Main Navigator**
```typescript
// src/navigations/MainNavigator.tsx
const MainNavigator: FC = () => {
  const { logout } = useAuth();

  return (
    <Drawer.Navigator
      initialRouteName="dashboard"
      drawerContent={(props) => <CustomDrawer {...props} onLogout={logout} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={24}
            style={{ marginLeft: 15 }}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
      })}
    >
      <Drawer.Screen name="dashboard" options={{ title: "Dashboard" }}>
        {(props) => <DashboardTabs {...props} onLogout={logout} />}
      </Drawer.Screen>
      {/* Other screens */}
    </Drawer.Navigator>
  );
};
```

---

## 🌐 API Integration

### **API Service Layer**

The application uses a centralized API service for all backend communication:

```typescript
// src/services/api.ts
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Dashboard methods
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>('/dashboard/stats');
  }

  // Generic request method with error handling
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
}

export default new ApiService();
```

### **API Endpoints**

The frontend integrates with the following backend endpoints:

#### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

#### **User Management**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-password` - Change password

#### **Dashboard**
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activities

#### **Financial Services**
- `GET /api/financial/transactions` - Get transaction history
- `GET /api/financial/balance` - Get account balance
- `POST /api/financial/payment` - Initiate payment

#### **CPD Management**
- `GET /api/cpd/modules` - Get CPD modules
- `POST /api/cpd/modules/:id/enroll` - Enroll in module
- `PUT /api/cpd/modules/:id/progress` - Update progress

#### **Events**
- `GET /api/events` - Get events list
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/unregister` - Unregister from event

#### **Communication**
- `GET /api/chat/rooms` - Get chat rooms
- `GET /api/chat/rooms/:id/messages` - Get messages
- `POST /api/chat/rooms/:id/messages` - Send message

#### **Notifications**
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

---

## 🎨 Styling & Theming

### **Design System**

The application uses a comprehensive design system with consistent colors, typography, and spacing:

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3182ce', // Main brand color
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#fefce8',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Accent color
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Success color
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Error color
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f7fafc',
      tertiary: '#edf2f7',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      tertiary: '#718096',
      inverse: '#ffffff',
    },
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};
```

### **Component Styling**

Components use consistent styling patterns:

```typescript
// Example: Button component styling
const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: theme.colors.primary[500],
  },
  secondary: {
    backgroundColor: theme.colors.secondary[500],
  },
  text: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
});
```

---

## 🧪 Testing

### **Testing Strategy**

The application uses a comprehensive testing approach:

#### **Unit Testing**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### **Component Testing**
```typescript
// Example: Login screen test
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreenSimple from '../src/screens/auths/LoginScreenSimple';

describe('LoginScreenSimple', () => {
  it('should render login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreenSimple onLogin={jest.fn()} navigate={jest.fn()} />
    );

    expect(getByPlaceholderText('Email Address')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('should validate email input', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreenSimple onLogin={jest.fn()} navigate={jest.fn()} />
    );

    const emailInput = getByPlaceholderText('Email Address');
    fireEvent.changeText(emailInput, 'invalid-email');

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });
});
```

#### **Integration Testing**
```typescript
// Example: API integration test
import apiService from '../src/services/api';

describe('API Service', () => {
  it('should login successfully with valid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const response = await apiService.login(credentials);

    expect(response.success).toBe(true);
    expect(response.data.token).toBeDefined();
    expect(response.data.user).toBeDefined();
  });
});
```

### **Testing Commands**

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode for development
npm run test:watch

# Run specific test file
npm test LoginScreenSimple.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should validate"
```

---

## 🚀 Deployment

### **Web Deployment**

#### **Build for Web**
```bash
# Build web version
npm run build:web

# Preview web build locally
npm run preview:web
```

#### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod

# Custom domain deployment
vercel --prod --alias your-domain.com
```

#### **Deploy to Netlify**
```bash
# Build the project
npm run build:web

# Deploy dist folder to Netlify
# Upload the 'dist' folder via Netlify dashboard
```

### **Mobile Deployment**

#### **iOS App Store**
```bash
# Build for iOS
expo build:ios

# Submit to App Store
expo upload:ios
```

#### **Google Play Store**
```bash
# Build for Android
expo build:android

# Submit to Play Store
expo upload:android
```

### **Environment-Specific Builds**

#### **Production Configuration**
```json
// app.config.js
export default {
  expo: {
    name: process.env.NODE_ENV === 'production' ? 'ICAN Portal' : 'ICAN Portal (Dev)',
    slug: 'ican-portal',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://team1-ican-hackathon-api.onrender.com'
        : 'http://localhost:5000',
    },
  },
};
```

#### **Build Scripts**
```json
// package.json
{
  "scripts": {
    "build:dev": "NODE_ENV=development expo export",
    "build:staging": "NODE_ENV=staging expo export",
    "build:prod": "NODE_ENV=production expo export",
    "deploy:web": "npm run build:prod && vercel --prod",
    "deploy:ios": "expo build:ios --release-channel production",
    "deploy:android": "expo build:android --release-channel production"
  }
}
```

---

## 🤝 Contributing

### **Development Guidelines**

#### **Code Style**
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow React Native best practices

#### **Git Workflow**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

#### **Commit Message Convention**
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

#### **Pull Request Process**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation
7. Submit pull request with detailed description

### **Code Review Checklist**
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Performance considerations addressed

---

## 🔧 Troubleshooting

### **Common Issues**

#### **Metro Bundler Issues**
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear Expo cache
expo start --clear

# Clear npm cache
npm cache clean --force
```

#### **iOS Simulator Issues**
```bash
# Reset iOS Simulator
xcrun simctl erase all

# Rebuild iOS
cd ios && pod install && cd ..
npm run ios
```

#### **Android Emulator Issues**
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Restart ADB
adb kill-server && adb start-server

# Run Android
npm run android
```

#### **Web Build Issues**
```bash
# Clear web cache
rm -rf .expo/web

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart development server
npm start
```

### **Performance Optimization**

#### **Bundle Size Optimization**
```bash
# Analyze bundle size
npx expo export --dump-assetmap

# Remove unused dependencies
npm prune

# Use dynamic imports for large components
const LargeComponent = React.lazy(() => import('./LargeComponent'));
```

#### **Memory Management**
```typescript
// Cleanup subscriptions
useEffect(() => {
  const subscription = someService.subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);

// Optimize images
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/>
```

### **Debugging Tools**

#### **React Native Debugger**
```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Enable debugging
# Shake device -> Debug -> Enable Remote JS Debugging
```

#### **Flipper Integration**
```bash
# Install Flipper
brew install --cask flipper

# Add Flipper to your app
npm install --save-dev react-native-flipper
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

### **Getting Help**

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and community support

### **Contact Information**

- **Team Lead**: [Your Name](mailto:your.email@example.com)
- **Project Repository**: [GitHub Repository](https://github.com/your-org/ican-hackathon)
- **Live Demo**: [https://team1-ican-eduhack.vercel.app](https://team1-ican-eduhack.vercel.app)

---

<div align="center">
  <p><strong>Built with ❤️ for ICAN Hackathon 2024</strong></p>
  <p>© 2024 Team 1 - All Rights Reserved</p>
</div>
