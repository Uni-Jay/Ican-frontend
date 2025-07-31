import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'warm' | 'cool';
  style?: ViewStyle;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'primary',
  style,
}) => {
  const getGradientStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      position: 'relative',
    };

    // For web, we can use CSS gradients via backgroundColor
    // For native, we'll use solid colors with opacity layers
    const gradientStyles = {
      primary: {
        backgroundColor: theme.colors.primary[500],
      },
      secondary: {
        backgroundColor: theme.colors.secondary[500],
      },
      warm: {
        backgroundColor: theme.colors.background.secondary,
      },
      cool: {
        backgroundColor: theme.colors.primary[50],
      },
    };

    return {
      ...baseStyle,
      ...gradientStyles[variant],
    };
  };

  const getOverlayStyle = (): ViewStyle => {
    const overlayStyles = {
      primary: {
        backgroundColor: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[400]} 100%)`,
      },
      secondary: {
        backgroundColor: `linear-gradient(135deg, ${theme.colors.secondary[600]} 0%, ${theme.colors.secondary[400]} 100%)`,
      },
      warm: {
        backgroundColor: `linear-gradient(135deg, ${theme.colors.background.secondary} 0%, ${theme.colors.primary[50]} 100%)`,
      },
      cool: {
        backgroundColor: `linear-gradient(135deg, ${theme.colors.primary[100]} 0%, ${theme.colors.background.primary} 100%)`,
      },
    };

    return theme.layout.isWeb ? {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      ...overlayStyles[variant],
    } : {};
  };

  return (
    <View style={[getGradientStyle(), style]}>
      {theme.layout.isWeb && <View style={getOverlayStyle()} />}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});

export default GradientBackground;
