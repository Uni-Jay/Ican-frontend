import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Modern Educational Platform Design System
export const theme = {
  // Color Palette - Warm and Professional
  colors: {
    // Primary Colors - Warm Blues and Teals
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main primary
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Secondary Colors - Warm Orange/Amber
    secondary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main secondary
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Accent Colors - Warm Green
    accent: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main accent
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Neutral Colors - Warm Grays
    neutral: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
    
    // Semantic Colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
    
    // Background Colors
    background: {
      primary: '#ffffff',
      secondary: '#fafaf9',
      tertiary: '#f5f5f4',
      card: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Text Colors
    text: {
      primary: '#1c1917',
      secondary: '#44403c',
      tertiary: '#78716c',
      inverse: '#ffffff',
      muted: '#a8a29e',
    },
    
    // Border Colors
    border: {
      light: '#e7e5e4',
      medium: '#d6d3d1',
      dark: '#a8a29e',
    },
  },
  
  // Typography Scale
  typography: {
    fontFamily: {
      regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
      medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
      bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
    },
    
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing Scale
  spacing: {
    0: 0,
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
    24: 96,
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Layout
  layout: {
    screenWidth,
    screenHeight,
    isSmallScreen: screenWidth < 375,
    isMediumScreen: screenWidth >= 375 && screenWidth < 768,
    isLargeScreen: screenWidth >= 768,
    isWeb: Platform.OS === 'web',
    
    // Container widths
    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    
    // Header heights
    headerHeight: Platform.OS === 'ios' ? 88 : 64,
    tabBarHeight: 60,
  },
  
  // Animation
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

// Component-specific styles
export const componentStyles = {
  // Button variants
  button: {
    primary: {
      backgroundColor: theme.colors.primary[500],
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[6],
      ...theme.shadows.base,
    },
    secondary: {
      backgroundColor: theme.colors.secondary[500],
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[6],
      ...theme.shadows.base,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary[500],
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[6],
    },
  },
  
  // Card variants
  card: {
    default: {
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[6],
      ...theme.shadows.base,
    },
    elevated: {
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[6],
      ...theme.shadows.md,
    },
  },
  
  // Input variants
  input: {
    default: {
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text.primary,
    },
    focused: {
      borderColor: theme.colors.primary[500],
      borderWidth: 2,
      ...theme.shadows.sm,
    },
    error: {
      borderColor: theme.colors.error,
      borderWidth: 2,
    },
  },
};

export default theme;
