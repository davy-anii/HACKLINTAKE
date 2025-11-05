import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../utils/ThemeContext';

const { width, height } = Dimensions.get('window');

interface PageAnimationProps {
  children: React.ReactNode;
  variant?: 'home' | 'problems' | 'mentor' | 'ai' | 'profile';
}

interface FloatingShape {
  translateY: Animated.Value;
  translateX: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  rotate: Animated.Value;
}

export const PageAnimation: React.FC<PageAnimationProps> = ({
  children,
  variant = 'home',
}) => {
  const { theme } = useTheme();

  // Main content animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Floating shapes (5 shapes for subtle effect)
  const shapes = useRef<FloatingShape[]>(
    Array.from({ length: 5 }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0.15),
      scale: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;

  // Background glow
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Shimmer effect for extra visibility
  const shimmer1 = useRef(new Animated.Value(0)).current;
  const shimmer2 = useRef(new Animated.Value(0)).current;

  // Variant-specific colors with higher visibility in dark mode
  const getColors = () => {
    const isDark = theme === 'dark';
    
    switch (variant) {
      case 'home':
        return {
          primary: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(14, 165, 233, 0.12)',
          secondary: isDark ? 'rgba(96, 165, 250, 0.18)' : 'rgba(56, 189, 248, 0.08)',
          accent: isDark ? 'rgba(37, 99, 235, 0.15)' : 'rgba(125, 211, 252, 0.06)',
        };
      case 'problems':
        return {
          primary: isDark ? 'rgba(167, 139, 250, 0.25)' : 'rgba(124, 58, 237, 0.12)',
          secondary: isDark ? 'rgba(139, 92, 246, 0.18)' : 'rgba(196, 181, 253, 0.08)',
          accent: isDark ? 'rgba(196, 181, 253, 0.15)' : 'rgba(233, 213, 255, 0.06)',
        };
      case 'mentor':
        return {
          primary: isDark ? 'rgba(52, 211, 153, 0.25)' : 'rgba(5, 150, 105, 0.12)',
          secondary: isDark ? 'rgba(16, 185, 129, 0.18)' : 'rgba(110, 231, 183, 0.08)',
          accent: isDark ? 'rgba(110, 231, 183, 0.15)' : 'rgba(167, 243, 208, 0.06)',
        };
      case 'ai':
        return {
          primary: isDark ? 'rgba(192, 132, 252, 0.28)' : 'rgba(147, 51, 234, 0.12)',
          secondary: isDark ? 'rgba(236, 72, 153, 0.22)' : 'rgba(216, 180, 254, 0.08)',
          accent: isDark ? 'rgba(168, 85, 247, 0.18)' : 'rgba(249, 168, 212, 0.06)',
        };
      case 'profile':
        return {
          primary: isDark ? 'rgba(96, 165, 250, 0.25)' : 'rgba(37, 99, 235, 0.12)',
          secondary: isDark ? 'rgba(147, 197, 253, 0.18)' : 'rgba(191, 219, 254, 0.08)',
          accent: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(219, 234, 254, 0.06)',
        };
      default:
        return {
          primary: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(14, 165, 233, 0.12)',
          secondary: isDark ? 'rgba(96, 165, 250, 0.18)' : 'rgba(56, 189, 248, 0.08)',
          accent: isDark ? 'rgba(37, 99, 235, 0.15)' : 'rgba(125, 211, 252, 0.06)',
        };
    }
  };

  const colors = getColors();

  useEffect(() => {
    // Content entrance - smooth and quick
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating shapes - subtle movement
    shapes.forEach((shape, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shape.translateY, {
            toValue: -30 - (index * 10),
            duration: 3000 + (index * 500),
            useNativeDriver: true,
          }),
          Animated.timing(shape.translateY, {
            toValue: 0,
            duration: 3000 + (index * 500),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(shape.translateX, {
            toValue: 20 - (index * 5),
            duration: 4000 + (index * 300),
            useNativeDriver: true,
          }),
          Animated.timing(shape.translateX, {
            toValue: 0,
            duration: 4000 + (index * 300),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(shape.rotate, {
            toValue: 1,
            duration: 8000 + (index * 1000),
            useNativeDriver: true,
          }),
          Animated.timing(shape.rotate, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Background glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer effects
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer1, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer1, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer2, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer2, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [variant, theme]);

  const rotateInterpolate = (index: number) => {
    return shapes[index].rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: theme === 'dark' ? [0.4, 0.7] : [0.2, 0.5],
  });

  const shimmer1Opacity = shimmer1.interpolate({
    inputRange: [0, 1],
    outputRange: theme === 'dark' ? [0.1, 0.4] : [0.05, 0.2],
  });

  const shimmer2Opacity = shimmer2.interpolate({
    inputRange: [0, 1],
    outputRange: theme === 'dark' ? [0.15, 0.5] : [0.08, 0.25],
  });

  const shimmer1Translate = shimmer1.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const shimmer2Translate = shimmer2.interpolate({
    inputRange: [0, 1],
    outputRange: [width, -width],
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Glow */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: glowOpacity },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            'transparent',
            colors.primary,
            colors.secondary,
            'transparent',
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Shimmer Effect 1 - Diagonal sweep */}
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmer1Opacity,
            transform: [
              { translateX: shimmer1Translate },
              { rotate: '45deg' },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            'transparent',
            colors.primary,
            colors.secondary,
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Shimmer Effect 2 - Reverse diagonal */}
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmer2Opacity,
            transform: [
              { translateX: shimmer2Translate },
              { rotate: '-45deg' },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            'transparent',
            colors.accent,
            colors.secondary,
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Floating Shapes Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Large Circle - Top Right */}
        <Animated.View
          style={[
            styles.floatingShape,
            {
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: 150,
              backgroundColor: colors.primary,
              transform: [
                { translateX: shapes[0].translateX },
                { translateY: shapes[0].translateY },
                { rotate: rotateInterpolate(0) },
              ],
            },
          ]}
        />

        {/* Medium Circle - Left */}
        <Animated.View
          style={[
            styles.floatingShape,
            {
              position: 'absolute',
              top: height * 0.3,
              left: -80,
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: colors.secondary,
              transform: [
                { translateX: shapes[1].translateX },
                { translateY: shapes[1].translateY },
                { rotate: rotateInterpolate(1) },
              ],
            },
          ]}
        />

        {/* Small Circle - Center Right */}
        <Animated.View
          style={[
            styles.floatingShape,
            {
              position: 'absolute',
              top: height * 0.5,
              right: -60,
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: colors.accent,
              transform: [
                { translateX: shapes[2].translateX },
                { translateY: shapes[2].translateY },
                { rotate: rotateInterpolate(2) },
              ],
            },
          ]}
        />

        {/* Medium Circle - Bottom Left */}
        <Animated.View
          style={[
            styles.floatingShape,
            {
              position: 'absolute',
              bottom: -120,
              left: -90,
              width: 250,
              height: 250,
              borderRadius: 125,
              backgroundColor: colors.secondary,
              transform: [
                { translateX: shapes[3].translateX },
                { translateY: shapes[3].translateY },
                { rotate: rotateInterpolate(3) },
              ],
            },
          ]}
        />

        {/* Small Circle - Bottom Right */}
        <Animated.View
          style={[
            styles.floatingShape,
            {
              position: 'absolute',
              bottom: height * 0.2,
              right: 30,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.primary,
              transform: [
                { translateX: shapes[4].translateX },
                { translateY: shapes[4].translateY },
                { rotate: rotateInterpolate(4) },
              ],
            },
          ]}
        />
      </View>

      {/* Main Content with Smooth Entrance */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  floatingShape: {
    opacity: 1,
  },
  shimmer: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    top: -height / 2,
    left: -width / 2,
  },
});
