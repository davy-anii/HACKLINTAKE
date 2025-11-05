import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useLanguage } from '../utils/LanguageContext';
import { useAppStore } from '../store/appStore';

import { DashboardScreen } from '../screens/DashboardScreen';
import { SubmitProblemScreen } from '../screens/SubmitProblemScreen';
import { MentorPanelScreen } from '../screens/MentorPanelScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProblemDetailScreen } from '../screens/ProblemDetailScreen';
import { ProblemsStatementScreen } from '../screens/ProblemsStatementScreen';
import { AIGeneratorScreen } from '../screens/AIGeneratorScreen';
import { AISupportScreen } from '../screens/AISupportScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { RoleSelectionScreen } from '../screens/RoleSelectionScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="SubmitProblem" component={SubmitProblemScreen} />
      <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
      <Stack.Screen name="AISupport" component={AISupportScreen} />
    </Stack.Navigator>
  );
};

const MentorStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="MentorPanel" component={MentorPanelScreen} />
      <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
    </Stack.Navigator>
  );
};

const ProblemsStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="ProblemsStatement" component={ProblemsStatementScreen} />
      <Stack.Screen name="SubmitProblem" component={SubmitProblemScreen} />
      <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="AISupport" component={AISupportScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAppStore();

  const isMentorOrOrganizer = user?.role === 'mentor' || user?.role === 'organizer';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'shift',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
          borderTopColor: theme === 'dark' ? '#334155' : '#BAE6FD',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: theme === 'dark' ? '#8B5CF6' : '#0EA5E9',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme === 'dark' ? '#8B5CF6' : '#0EA5E9',
        tabBarInactiveTintColor: theme === 'dark' ? '#94A3B8' : '#0369A1',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarHideOnKeyboard: Platform.OS === 'android',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Problems') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Mentor') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'AI') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: t('home') }}
      />
      
      <Tab.Screen
        name="Problems"
        component={ProblemsStack}
        options={{ tabBarLabel: t('problems') }}
      />
      
      {isMentorOrOrganizer && (
        <Tab.Screen
          name="Mentor"
          component={MentorStack}
          options={{ tabBarLabel: t('mentor') }}
        />
      )}
      
      <Tab.Screen
        name="AI"
        component={AIGeneratorScreen}
        options={{ tabBarLabel: t('aiGenerator') }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: t('profile') }}
      />
    </Tab.Navigator>
  );
};

export type RootStackParamList = {
  Welcome: undefined;
  Auth: { initialMode?: 'signin' | 'signup' };
  RoleSelection: { userData: { id: string; name: string; email: string; photoURL?: string } };
  Main: undefined;
};

export const AppNavigator = () => {
  const { user } = useAppStore();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <RootStack.Screen name="Welcome" component={WelcomeScreen} />
          <RootStack.Screen name="Auth" component={AuthScreen} />
          <RootStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        </>
      ) : (
        <RootStack.Screen name="Main" component={MainTabs} />
      )}
    </RootStack.Navigator>
  );
};
