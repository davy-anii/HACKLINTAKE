import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../utils/ThemeContext';

const { width, height } = Dimensions.get('window');

interface WelcomeModalProps {
  visible: boolean;
  userName: string;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  visible,
  userName,
  onClose,
}) => {
  const { theme } = useTheme();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkle1 = useRef(new Animated.Value(0)).current;
  const sparkle2 = useRef(new Animated.Value(0)).current;
  const sparkle3 = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const welcomeColors = {
    background: theme === 'dark' ? 'rgba(10, 14, 39, 0.98)' : 'rgba(224, 242, 254, 0.98)',
    gradientStart: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    gradientMid: theme === 'dark' ? '#8B5CF6' : '#38BDF8',
    gradientEnd: theme === 'dark' ? '#EC4899' : '#22D3EE',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#E2E8F0' : '#0369A1',
    accent: theme === 'dark' ? '#60A5FA' : '#0EA5E9',
  };

  useEffect(() => {
    if (visible) {
      // Main entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
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

      // Sparkle animations with delays
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkle1, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle1, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(sparkle2, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle2, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 300);

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(sparkle3, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle3, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 600);

      // Confetti fall animation
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();

      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const confettiTranslateY = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, height],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: welcomeColors.background,
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Confetti Elements */}
        {[...Array(15)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                left: `${(index * 7) % 100}%`,
                backgroundColor: [
                  '#FF6B6B',
                  '#4ECDC4',
                  '#45B7D1',
                  '#FFA07A',
                  '#98D8C8',
                  '#F7DC6F',
                  '#BB8FCE',
                ][index % 7],
                transform: [
                  { translateY: confettiTranslateY },
                  { rotate: `${index * 30}deg` },
                ],
                opacity: confettiAnim,
              },
            ]}
          />
        ))}

        {/* Main Content */}
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          {/* Background Glow Circles */}
          <Animated.View
            style={[
              styles.glowCircle,
              styles.glow1,
              {
                transform: [{ scale: pulseAnim }],
                opacity: 0.3,
              },
            ]}
          >
            <LinearGradient
              colors={[welcomeColors.gradientStart, welcomeColors.gradientMid]}
              style={styles.glowGradient}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.glowCircle,
              styles.glow2,
              {
                transform: [{ scale: pulseAnim }],
                opacity: 0.2,
              },
            ]}
          >
            <LinearGradient
              colors={[welcomeColors.gradientMid, welcomeColors.gradientEnd]}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* Main Card */}
          <View style={styles.card}>
            {/* Animated Rocket Icon */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ rotate }, { scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={[
                  welcomeColors.gradientStart,
                  welcomeColors.gradientMid,
                  welcomeColors.gradientEnd,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name="rocket" size={64} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>

            {/* Sparkles */}
            <Animated.View style={[styles.sparkle, styles.sparkle1, { opacity: sparkle1 }]}>
              <Ionicons name="sparkles" size={24} color={welcomeColors.accent} />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle2, { opacity: sparkle2 }]}>
              <Ionicons name="star" size={20} color="#F59E0B" />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle3, { opacity: sparkle3 }]}>
              <Ionicons name="sparkles" size={20} color="#EC4899" />
            </Animated.View>

            {/* Welcome Text */}
            <Text style={[styles.welcomeText, { color: welcomeColors.textPrimary }]}>
              Welcome Back! 👋
            </Text>

            <Text style={[styles.userName, { color: welcomeColors.accent }]}>
              {userName}
            </Text>

            <Text style={[styles.message, { color: welcomeColors.textSecondary }]}>
              We're excited to have you here!{'\n'}
              Let's make amazing things happen ✨
            </Text>

            {/* Success Badge */}
            <View style={styles.badgeContainer}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.successBadge}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.badgeText}>Successfully Logged In</Text>
              </LinearGradient>
            </View>

            {/* Quick Tip */}
            <View style={[styles.tipContainer, { backgroundColor: welcomeColors.gradientStart + '10' }]}>
              <Ionicons name="bulb" size={20} color={welcomeColors.accent} />
              <Text style={[styles.tipText, { color: welcomeColors.textSecondary }]}>
                Tap anywhere to start your journey
              </Text>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[welcomeColors.gradientStart, welcomeColors.gradientMid]}
              style={styles.closeButtonGradient}
            >
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Tap to close */}
        <TouchableOpacity
          style={styles.tapArea}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tapArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  content: {
    zIndex: 2,
    alignItems: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  glow1: {
    top: -100,
    left: -50,
  },
  glow2: {
    bottom: -100,
    right: -50,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
  },
  card: {
    width: width - 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: 40,
    right: 40,
  },
  sparkle2: {
    top: 60,
    left: 30,
  },
  sparkle3: {
    bottom: 100,
    right: 50,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  badgeContainer: {
    marginBottom: 20,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 24,
  },
  closeButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
