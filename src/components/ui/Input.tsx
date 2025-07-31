import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  size = 'md',
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: theme.spacing[4],
    };

    return {
      ...baseStyle,
    };
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
    };

    // Size variants
    const sizeStyles = {
      sm: {
        paddingVertical: theme.spacing[2],
        paddingHorizontal: theme.spacing[3],
      },
      md: {
        paddingVertical: theme.spacing[4],
        paddingHorizontal: theme.spacing[4],
      },
      lg: {
        paddingVertical: theme.spacing[5],
        paddingHorizontal: theme.spacing[5],
      },
    };

    // Variant styles
    const variantStyles = {
      default: {
        backgroundColor: theme.colors.background.secondary,
        borderColor: isFocused ? theme.colors.primary[500] : theme.colors.border.light,
      },
      filled: {
        backgroundColor: theme.colors.neutral[100],
        borderColor: isFocused ? theme.colors.primary[500] : 'transparent',
      },
      outlined: {
        backgroundColor: 'transparent',
        borderColor: isFocused ? theme.colors.primary[500] : theme.colors.border.medium,
      },
    };

    const errorStyle: ViewStyle = error ? {
      borderColor: theme.colors.error,
      borderWidth: 2,
    } : {};

    const focusedStyle: ViewStyle = isFocused && !error ? {
      borderWidth: 2,
      ...theme.shadows.sm,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...errorStyle,
      ...focusedStyle,
    };
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.regular,
    };

    const sizeStyles = {
      sm: {
        fontSize: theme.typography.fontSize.sm,
      },
      md: {
        fontSize: theme.typography.fontSize.base,
      },
      lg: {
        fontSize: theme.typography.fontSize.lg,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
    };
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    };

    return baseStyle;
  };

  const getErrorStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error,
      marginTop: theme.spacing[1],
      marginLeft: theme.spacing[1],
    };

    return baseStyle;
  };

  const getIconSize = () => {
    const iconSizes = {
      sm: 16,
      md: 20,
      lg: 24,
    };
    return iconSizes[size];
  };

  const getIconColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary[500];
    return theme.colors.text.tertiary;
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={getIconSize()}
            color={getIconColor()}
            style={{ marginRight: theme.spacing[3] }}
          />
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.text.muted}
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: theme.spacing[3] }}
          >
            <Ionicons
              name={rightIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[getErrorStyle(), errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
