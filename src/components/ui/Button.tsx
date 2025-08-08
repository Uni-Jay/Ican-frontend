import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.base,
    };

    // Size variants
    const sizeStyles = {
      sm: {
        paddingVertical: theme.spacing[2],
        paddingHorizontal: theme.spacing[4],
      },
      md: {
        paddingVertical: theme.spacing[4],
        paddingHorizontal: theme.spacing[6],
      },
      lg: {
        paddingVertical: theme.spacing[5],
        paddingHorizontal: theme.spacing[8],
      },
    };

    // Color variants
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary[500],
      },
      secondary: {
        backgroundColor: theme.colors.secondary[500],
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.primary[500],
        shadowOpacity: 0,
        elevation: 0,
      },
      ghost: {
        backgroundColor: "transparent",
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    const disabledStyle: ViewStyle =
      disabled || loading
        ? {
            opacity: 0.6,
          }
        : {};

    const fullWidthStyle: ViewStyle = fullWidth
      ? {
          width: "100%",
        }
      : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
      ...fullWidthStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold as any,
    };

    // Size variants
    const sizeTextStyles = {
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

    // Color variants
    const variantTextStyles = {
      primary: {
        color: theme.colors.text.inverse,
      },
      secondary: {
        color: theme.colors.text.inverse,
      },
      outline: {
        color: theme.colors.primary[500],
      },
      ghost: {
        color: theme.colors.primary[500],
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
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
    const iconColors = {
      primary: theme.colors.text.inverse,
      secondary: theme.colors.text.inverse,
      outline: theme.colors.primary[500],
      ghost: theme.colors.primary[500],
    };
    return iconColors[variant];
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={
              variant === "primary" || variant === "secondary"
                ? "white"
                : theme.colors.primary[500]
            }
          />
          <Text
            style={[
              getTextStyle(),
              textStyle,
              { marginLeft: theme.spacing[2] },
            ]}
          >
            {title}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === "left" && (
          <Ionicons
            name={icon}
            size={getIconSize()}
            color={getIconColor()}
            style={{ marginRight: theme.spacing[2] }}
          />
        )}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        {icon && iconPosition === "right" && (
          <Ionicons
            name={icon}
            size={getIconSize()}
            color={getIconColor()}
            style={{ marginLeft: theme.spacing[2] }}
          />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Button;
