import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from './src/utils/ThemeContext';
import { LanguageProvider } from './src/utils/LanguageContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/appStore';
import { sampleProblems } from './src/utils/sampleData';

// Initialize firebase (side-effect). Keeps firebase init central in src/firebase/init.ts
import './src/firebase/init';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NavigationContainer>
            <AppContent />
            <StatusBar style="auto" />
          </NavigationContainer>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Separate component to use hooks
function AppContent() {
  const setProblems = useAppStore((state) => state.setProblems);
  const problems = useAppStore((state) => state.problems);

  // Load sample problems on app start if no problems exist
  useEffect(() => {
    if (problems.length === 0) {
      console.log('📦 Loading sample problems:', sampleProblems.length);
      setProblems(sampleProblems);
    }
  }, []);

  return <AppNavigator />;
}
