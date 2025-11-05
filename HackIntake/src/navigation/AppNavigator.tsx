import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';

import { DashboardScreen } from '../screens/DashboardScreen';
import { SubmitProblemScreen } from '../screens/SubmitProblemScreen';
import { MentorPanelScreen } from '../screens/MentorPanelScreen';
import { TeamViewScreen } from '../screens/TeamViewScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProblemDetailScreen } from '../screens/ProblemDetailScreen';
import { AuthScreen } from '../screens/AuthScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="SubmitProblem" component={SubmitProblemScreen} />
      <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
    </Stack.Navigator>
  );
};

const MentorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MentorPanel" component={MentorPanelScreen} />
      <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
    </Stack.Navigator>
  );
};

const TeamStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeamView" component={TeamViewScreen} />
      <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const { colors } = useTheme();
  const { user } = useAppStore();

  const isMentorOrAdmin = user?.role === 'mentor' || user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Mentor') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Team') {
            iconName = focused ? 'people' : 'people-outline';
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
        options={{ tabBarLabel: 'Home' }}
      />
      
      {isMentorOrAdmin && (
        <Tab.Screen
          name="Mentor"
          component={MentorStack}
          options={{ tabBarLabel: 'Mentor' }}
        />
      )}
      
      <Tab.Screen
        name="Team"
        component={TeamStack}
        options={{ tabBarLabel: 'Browse' }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export type RootStackParamList = {
  Welcome: undefined;
  Auth: { initialMode?: 'signin' | 'signup' };
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
        </>
      ) : (
        <RootStack.Screen name="Main" component={MainTabs} />
      )}
    </RootStack.Navigator>
  );
};
