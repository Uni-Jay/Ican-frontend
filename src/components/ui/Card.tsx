import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  margin?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'none',
  onPress,
  style,
  disabled = false,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
    };

    // Variant styles
    const variantStyles = {
      default: {
        ...theme.shadows.base,
      },
      elevated: {
        ...theme.shadows.md,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border.light,
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    // Padding styles
    const paddingStyles = {
      none: {},
      sm: { padding: theme.spacing[3] },
      md: { padding: theme.spacing[4] },
      lg: { padding: theme.spacing[6] },
    };

    // Margin styles
    const marginStyles = {
      none: {},
      sm: { margin: theme.spacing[2] },
      md: { margin: theme.spacing[4] },
      lg: { margin: theme.spacing[6] },
    };

    const disabledStyle: ViewStyle = disabled ? {
      opacity: 0.6,
    } : {};

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...disabledStyle,
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.95}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

export default Card;
