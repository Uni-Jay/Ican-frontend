import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
  style?: ViewStyle;
}

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  center = true,
  style,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: '100%',
    };

    // Max width styles
    const maxWidthStyles = {
      sm: { maxWidth: theme.layout.container.sm },
      md: { maxWidth: theme.layout.container.md },
      lg: { maxWidth: theme.layout.container.lg },
      xl: { maxWidth: theme.layout.container.xl },
      full: { maxWidth: '100%' },
    };

    // Padding styles
    const paddingStyles = {
      none: {},
      sm: { paddingHorizontal: theme.spacing[4] },
      md: { paddingHorizontal: theme.spacing[6] },
      lg: { paddingHorizontal: theme.spacing[8] },
    };

    // Center styles
    const centerStyle: ViewStyle = center ? {
      marginHorizontal: 'auto',
      alignSelf: 'center',
    } : {};

    // Web-specific responsive styles
    const webStyles: ViewStyle = theme.layout.isWeb ? {
      minHeight: '100vh',
      ...centerStyle,
    } : {};

    return {
      ...baseStyle,
      ...maxWidthStyles[maxWidth],
      ...paddingStyles[padding],
      ...webStyles,
    };
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {children}
    </View>
  );
};

export default Container;
