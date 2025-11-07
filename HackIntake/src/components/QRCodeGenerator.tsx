import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../utils/ThemeContext';

interface QRCodeGeneratorProps {
  data: string;
  size?: number;
  title?: string;
  description?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  data,
  size = 250,
  title,
  description,
}) => {
  const { theme } = useTheme();
  
  const colors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      {title && (
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      )}
      
      {description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      )}
      
      <View style={styles.qrContainer}>
        <QRCode
          value={data}
          size={size}
          color={theme === 'dark' ? '#FFFFFF' : '#000000'}
          backgroundColor={theme === 'dark' ? '#1E293B' : '#FFFFFF'}
        />
      </View>
      
      <Text style={[styles.codeText, { color: colors.textSecondary }]}>
        Code: {data.substring(0, 20)}...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
