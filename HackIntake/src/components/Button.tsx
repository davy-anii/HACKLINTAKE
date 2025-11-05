import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  size = 'md',
  style,
  disabled,
  ...props
}) => {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button];

    if (size === 'sm') baseStyle.push(styles.buttonSm);
    if (size === 'lg') baseStyle.push(styles.buttonLg);

    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          { backgroundColor: colors.primary },
          disabled && { opacity: 0.5 },
        ];
      case 'secondary':
        return [
          ...baseStyle,
          { backgroundColor: colors.secondary },
          disabled && { opacity: 0.5 },
        ];
      case 'outline':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
          },
          disabled && { opacity: 0.5 },
        ];
      case 'ghost':
        return [
          ...baseStyle,
          { backgroundColor: 'transparent' },
          disabled && { opacity: 0.5 },
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.text];

    if (size === 'sm') baseStyle.push(styles.textSm);
    if (size === 'lg') baseStyle.push(styles.textLg);

    if (variant === 'outline' || variant === 'ghost') {
      return [...baseStyle, { color: colors.primary }];
    }

    return [...baseStyle, { color: '#FFFFFF' }];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonLg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 18,
  },
});
