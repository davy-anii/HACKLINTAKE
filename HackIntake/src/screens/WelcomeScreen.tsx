import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { colors, theme } = useTheme();
  
  // Theme-aware color scheme
  const professionalColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    primaryLight: theme === 'dark' ? '#3B82F6' : '#38BDF8',
    accent: theme === 'dark' ? '#60A5FA' : '#22D3EE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
  };
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Floating icons animations
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for logo
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animations for background icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, {
          toValue: -15,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(float2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float3, {
          toValue: -25,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(float3, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: professionalColors.background }]}>
      {/* Floating Background Icons */}
      <Animated.View
        style={[
          styles.floatingIcon,
          { top: '15%', left: '10%', transform: [{ translateY: float1 }] },
        ]}
      >
        <Ionicons name="bulb-outline" size={60} color={professionalColors.accent} opacity={0.15} />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.floatingIcon,
          { top: '25%', right: '15%', transform: [{ translateY: float2 }] },
        ]}
      >
        <Ionicons name="rocket-outline" size={80} color={professionalColors.primary} opacity={0.15} />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.floatingIcon,
          { bottom: '20%', left: '20%', transform: [{ translateY: float3 }] },
        ]}
      >
        <Ionicons name="code-slash-outline" size={70} color={professionalColors.primaryLight} opacity={0.15} />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIcon,
          { bottom: '30%', right: '10%', transform: [{ translateY: float1 }] },
        ]}
      >
        <Ionicons name="people-outline" size={65} color={professionalColors.accent} opacity={0.15} />
      </Animated.View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ rotate: rotation }] },
          ]}
        >
          <View style={[styles.logoCircle, { 
            backgroundColor: professionalColors.primary + '30',
            borderWidth: 3,
            borderColor: professionalColors.primary + '50',
          }]}>
            <Ionicons name="rocket" size={80} color={professionalColors.primaryLight} />
          </View>
        </Animated.View>

        {/* App Name with Gradient Effect */}
        <Animated.View style={styles.titleContainer}>
          <Text style={[styles.title, { color: professionalColors.textPrimary }]}>
            Hack<Text style={{ color: professionalColors.accent }}>Intake</Text>
          </Text>
          <View style={[styles.titleUnderline, { backgroundColor: professionalColors.primary }]} />
        </Animated.View>

        {/* Tagline */}
        <Text style={[styles.tagline, { color: professionalColors.textSecondary }]}>
          Where Innovation Meets Collaboration
        </Text>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <View style={[styles.featureCard, { 
            backgroundColor: professionalColors.cardBg,
            borderWidth: 1,
            borderColor: professionalColors.primary + '30',
          }]}>
            <Ionicons name="flash" size={24} color={professionalColors.accent} />
            <Text style={[styles.featureText, { color: professionalColors.textPrimary }]}>
              Submit Problems
            </Text>
          </View>
          
          <View style={[styles.featureCard, { 
            backgroundColor: professionalColors.cardBg,
            borderWidth: 1,
            borderColor: professionalColors.primary + '30',
          }]}>
            <Ionicons name="people" size={24} color={professionalColors.accent} />
            <Text style={[styles.featureText, { color: professionalColors.textPrimary }]}>
              Team Collaboration
            </Text>
          </View>
          
          <View style={[styles.featureCard, { 
            backgroundColor: professionalColors.cardBg,
            borderWidth: 1,
            borderColor: professionalColors.primary + '30',
          }]}>
            <Ionicons name="trophy" size={24} color={professionalColors.accent} />
            <Text style={[styles.featureText, { color: professionalColors.textPrimary }]}>
              Win Hackathons
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.primaryButton, { 
                backgroundColor: professionalColors.primary,
                shadowColor: professionalColors.primaryLight,
              }]}
              onPress={() => navigation.navigate('Auth', { initialMode: 'signup' })}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[styles.secondaryButton, { 
              borderColor: professionalColors.primary,
              backgroundColor: professionalColors.cardBg,
            }]}
            onPress={() => navigation.navigate('Auth', { initialMode: 'signin' })}
            activeOpacity={0.7}
          >
            <Text style={[styles.secondaryButtonText, { color: professionalColors.textPrimary }]}>
              I Already Have an Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <Ionicons name="shield-checkmark" size={16} color={professionalColors.accent} />
          <Text style={[styles.bottomText, { color: professionalColors.textSecondary }]}>
            Secure & Free Forever
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingIcon: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  tagline: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 48,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  bottomText: {
    fontSize: 14,
  },
});

export default WelcomeScreen;
