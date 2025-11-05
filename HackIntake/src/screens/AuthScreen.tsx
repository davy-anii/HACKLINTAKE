import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { GoogleAccountPicker } from '../components/GoogleAccountPicker';
import { Ionicons } from '@expo/vector-icons';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
}

export const AuthScreen = ({ navigation, route }: any) => {
  const { colors, theme } = useTheme();
  const { setUser } = useAppStore();
  const initialMode = route?.params?.initialMode || 'signin';
  const [isLogin, setIsLogin] = useState(initialMode === 'signin');
  const [loading, setLoading] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  // Theme-aware colors
  const professionalColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    primaryLight: theme === 'dark' ? '#3B82F6' : '#38BDF8',
    accent: theme === 'dark' ? '#60A5FA' : '#22D3EE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    inputBg: theme === 'dark' ? '#0F172A' : '#F0F9FF',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    success: theme === 'dark' ? '#10B981' : '#10B981',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

    // Logo rotation
    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();

    // Glow pulse effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: yupResolver(isLogin ? loginSchema : signupSchema),
  });

  const handleGoogleSignIn = async () => {
    // Show the account picker modal
    setShowAccountPicker(true);
  };

  const handleAccountSelect = (account: any) => {
    setShowAccountPicker(false);
    setLoading(true);
    
    // Navigate to role selection with user data including password
    setTimeout(() => {
      const userData = {
        id: account.id,
        name: account.name,
        email: account.email,
        photoURL: account.picture,
        password: '', // Google login - no password needed
      };
      setLoading(false);
      navigation.navigate('RoleSelection', { userData });
    }, 500);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      const userData = {
        id: Date.now().toString(),
        name: isLogin ? 'User' : data.name,
        email: data.email,
        password: data.password, // Save password for secure storage
      };
      
      setLoading(false);
      reset();
      // Navigate to role selection
      navigation.navigate('RoleSelection', { userData });
    }, 1000);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: professionalColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Animated Background Circles */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle1,
          {
            opacity: glowOpacity,
            backgroundColor: professionalColors.primary,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle2,
          {
            opacity: glowOpacity,
            backgroundColor: professionalColors.accent,
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button with Animation */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: professionalColors.cardBg }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={professionalColors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Animated Logo/Header Section */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.logoContainer,
              {
                backgroundColor: professionalColors.primary,
                borderWidth: 3,
                borderColor: professionalColors.accent,
                transform: [{ rotate: logoRotation }],
              },
            ]}
          >
            <Ionicons name="rocket" size={48} color="#FFFFFF" />
          </Animated.View>
          <Text style={[styles.title, { color: professionalColors.textPrimary }]}>
            Hack<Text style={{ color: professionalColors.accent }}>Intake</Text>
          </Text>
          <Text style={[styles.subtitle, { color: professionalColors.textSecondary }]}>
            {isLogin 
              ? '👋 Welcome back! Sign in to continue' 
              : '🚀 Create your account to get started'}
          </Text>
        </Animated.View>

        {/* Animated Form Section */}
        <Animated.View
          style={[
            styles.formCard,
            {
              backgroundColor: professionalColors.cardBg,
              borderWidth: 1,
              borderColor: professionalColors.border,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {!isLogin && (
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message as string}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="your@email.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message as string}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message as string}
                secureTextEntry
              />
            )}
          />

          {!isLogin && (
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.confirmPassword?.message as string}
                  secureTextEntry
                />
              )}
            />
          )}

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: professionalColors.accent }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          <Button
            title={isLogin ? '🔐 Sign In' : '✨ Create Account'}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="lg"
            loading={loading}
            style={[styles.submitButton, { backgroundColor: professionalColors.primary }]}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: professionalColors.border }]} />
            <Text style={[styles.dividerText, { color: professionalColors.textSecondary }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: professionalColors.border }]} />
          </View>

          {/* Google Sign In */}
          <TouchableOpacity
            style={[styles.googleButton, { 
              borderColor: professionalColors.border,
              backgroundColor: professionalColors.inputBg,
            }]}
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-google" size={20} color={professionalColors.accent} />
            <Text style={[styles.googleButtonText, { color: professionalColors.textPrimary }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Toggle Sign In/Sign Up */}
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleText, { color: professionalColors.textSecondary }]}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={[styles.toggleLink, { color: professionalColors.accent }]}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Google Account Picker Modal */}
      <GoogleAccountPicker
        visible={showAccountPicker}
        onClose={() => setShowAccountPicker(false)}
        onSelectAccount={handleAccountSelect}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.1,
  },
  circle1: {
    width: 400,
    height: 400,
    top: -200,
    left: -100,
  },
  circle2: {
    width: 350,
    height: 350,
    bottom: -150,
    right: -80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  formCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    gap: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  toggleText: {
    fontSize: 14,
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
  },
});
