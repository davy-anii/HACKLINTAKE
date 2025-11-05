import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  secureTextEntry,
  ...props
}) => {
  const { colors, theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

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
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: inputBg,
              color: textColor,
              borderColor: borderColor,
            },
            multiline && { height: rows * 40, textAlignVertical: 'top' },
            secureTextEntry && styles.inputWithIcon,
            style,
          ]}
          placeholderTextColor={placeholderColor}
          multiline={multiline}
          numberOfLines={multiline ? rows : 1}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={theme === 'dark' ? '#94A3B8' : '#0369A1'}
            />
          </TouchableOpacity>
        )}
      </View>
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
  inputWrapper: {
    position: 'relative',
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: 16,
    fontWeight: '500',
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -11 }],
    padding: 4,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
});
