import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/utils/ThemeContext';
import { LanguageProvider } from './src/utils/LanguageContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/appStore';
import { sampleProblems } from './src/utils/sampleData';

function AppContent() {
  const { colors, theme } = useTheme();
  const { setProblems, problems, loadUserFromStorage } = useAppStore();

  useEffect(() => {
    // Load user from storage on app start
    loadUserFromStorage();
    
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
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}
