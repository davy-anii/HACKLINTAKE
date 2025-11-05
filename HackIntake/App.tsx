import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/utils/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/appStore';
import { sampleProblems } from './src/utils/sampleData';

function AppContent() {
  const { colors, theme } = useTheme();
  const { setProblems, problems } = useAppStore();

  useEffect(() => {
    // Only set sample problems if store is empty
    if (problems.length === 0) {
      setProblems(sampleProblems);
    }
  }, []);

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
