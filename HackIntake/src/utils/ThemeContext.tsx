import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ColorPalette;
}

interface ColorPalette {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

const lightColors: ColorPalette = {
  background: '#E0F2FE', // Sky blue background
  card: '#FFFFFF',
  text: '#0C4A6E', // Deep blue text
  textSecondary: '#0369A1', // Sky blue text
  border: '#BAE6FD', // Light sky blue border
  primary: '#0EA5E9', // Sky blue primary
  secondary: '#38BDF8', // Bright sky blue
  accent: '#22D3EE', // Cyan accent
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  shadow: 'rgba(14, 165, 233, 0.15)', // Sky blue shadow
};

const darkColors: ColorPalette = {
  background: '#0A0E27', // Deep navy background
  card: '#1E293B',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  border: '#334155',
  primary: '#2563EB', // Professional blue
  secondary: '#60A5FA',
  accent: '#8B5CF6', // Purple accent
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  shadow: 'rgba(37, 99, 235, 0.2)', // Blue shadow
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme || 'light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
