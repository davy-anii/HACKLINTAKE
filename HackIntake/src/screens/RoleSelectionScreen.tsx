import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { UserRole } from '../types';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  features: string[];
}

export const RoleSelectionScreen = ({ route }: any) => {
  const { theme } = useTheme();
  const { loginUser } = useAppStore();
  const { userData } = route.params; // { id, name, email, photoURL, password }
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const roleColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    accent: theme === 'dark' ? '#60A5FA' : '#38BDF8',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
    success: theme === 'dark' ? '#10B981' : '#10B981',
  };

  const roles: RoleOption[] = [
    {
      id: 'mentor',
      title: '👨‍🏫 Mentor',
      description: 'Review and guide hackathon teams',
      icon: 'shield-checkmark',
      color: '#8B5CF6',
      features: [
        'Review problem statements',
        'Approve or reject submissions',
        'Assign problems to teams',
        'Provide feedback and guidance',
        'Access mentor dashboard',
      ],
    },
    {
      id: 'organizer',
      title: '🎯 Organizer',
      description: 'Manage the entire hackathon',
      icon: 'star',
      color: '#F59E0B',
      features: [
        'Full admin access',
        'Manage all submissions',
        'Assign mentors and teams',
        'View analytics and reports',
        'Configure hackathon settings',
      ],
    },
    {
      id: 'participant',
      title: '💻 Participant',
      description: 'Submit and work on problems',
      icon: 'people',
      color: '#06B6D4',
      features: [
        'Submit problem statements',
        'Track submission status',
        'Receive mentor feedback',
        'Collaborate with team',
        'Browse approved problems',
      ],
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    
    // Create user with selected role and save to secure storage
    try {
      const user = {
        ...userData,
        role: selectedRole,
      };
      
      // Save user data with credentials securely
      await loginUser(user, userData.email, userData.password || '');
      setIsLoading(false);
      // Navigation will be handled automatically by AppNavigator
    } catch (error) {
      console.error('Error saving user:', error);
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: roleColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: roleColors.primary }]}>
            <Ionicons name="person-circle" size={48} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: roleColors.textPrimary }]}>
            Choose Your Role
          </Text>
          <Text style={[styles.subtitle, { color: roleColors.textSecondary }]}>
            Select how you'll participate in HackIntake
          </Text>
        </Animated.View>

        {/* Role Cards */}
        <Animated.View
          style={[
            styles.rolesContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {roles.map((role, index) => {
            const isSelected = selectedRole === role.id;
            
            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: roleColors.cardBg,
                    borderColor: isSelected ? role.color : roleColors.border,
                    borderWidth: isSelected ? 3 : 1,
                    transform: [{ scale: isSelected ? 1.02 : 1 }],
                  },
                ]}
                onPress={() => handleRoleSelect(role.id)}
                activeOpacity={0.7}
              >
                {/* Icon Header */}
                <View style={styles.roleHeader}>
                  <View
                    style={[
                      styles.roleIconContainer,
                      { backgroundColor: role.color + '20' },
                    ]}
                  >
                    <Ionicons name={role.icon} size={32} color={role.color} />
                  </View>
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: role.color }]}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                {/* Role Info */}
                <Text style={[styles.roleTitle, { color: roleColors.textPrimary }]}>
                  {role.title}
                </Text>
                <Text style={[styles.roleDescription, { color: roleColors.textSecondary }]}>
                  {role.description}
                </Text>

                {/* Features List */}
                <View style={styles.featuresList}>
                  {role.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={role.color}
                      />
                      <Text style={[styles.featureText, { color: roleColors.textSecondary }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Continue Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              {
                backgroundColor: selectedRole
                  ? roleColors.primary
                  : roleColors.border,
              },
            ]}
            onPress={handleContinue}
            disabled={!selectedRole || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>Loading...</Text>
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {selectedRole ? 'Continue' : 'Select a role to continue'}
                </Text>
                {selectedRole && (
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                )}
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  rolesContainer: {
    gap: 20,
    marginBottom: 32,
  },
  roleCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
