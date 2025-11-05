import React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  multiline = false,
  rows = 1,
  style,
  ...props
}) => {
  const { colors, theme } = useTheme();

  // Theme-aware colors
  const inputBg = theme === 'dark' ? '#0F172A' : '#F0F9FF';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0C4A6E';
  const labelColor = theme === 'dark' ? '#E2E8F0' : '#0C4A6E';
  const borderColor = error ? '#EF4444' : (theme === 'dark' ? '#334155' : '#BAE6FD');
  const placeholderColor = theme === 'dark' ? '#64748B' : '#0369A1';

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: inputBg,
            color: textColor,
            borderColor: borderColor,
          },
          multiline && { height: rows * 40, textAlignVertical: 'top' },
          style,
        ]}
        placeholderTextColor={placeholderColor}
        multiline={multiline}
        numberOfLines={multiline ? rows : 1}
        {...props}
      />
      {error && <Text style={[styles.error, { color: '#EF4444' }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
});
