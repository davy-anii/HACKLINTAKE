import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
  Modal,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const ProfileScreen = ({ navigation }: any) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, setUser, problems, logoutUser } = useAppStore();
  const [profileImage, setProfileImage] = useState<string | null>(user?.photoURL || null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [problemUpdates, setProblemUpdates] = useState(true);
  const [mentorFeedback, setMentorFeedback] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  // Professional colors - Now dynamic based on theme!
  const profileColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    accent: theme === 'dark' ? '#60A5FA' : '#38BDF8',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    purple: theme === 'dark' ? '#8B5CF6' : '#22D3EE',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
    gradientStart: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    gradientMid: theme === 'dark' ? '#8B5CF6' : '#38BDF8',
    gradientEnd: theme === 'dark' ? '#60A5FA' : '#22D3EE',
    shadow: theme === 'dark' ? 'rgba(37, 99, 235, 0.3)' : 'rgba(14, 165, 233, 0.2)',
  };

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulsing ring animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotating glow animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Glowing pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const userProblems = problems.filter((p) => p.createdBy === user?.id);
  const bookmarkedProblems = problems.filter((p) =>
    p.bookmarkedBy?.includes(user?.id || '')
  );

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logoutUser(); // This will clear all stored data
          // Navigation will automatically go to Auth screen
        },
      },
    ]);
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos to change your profile picture.');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      // Update user profile with new image
      if (user) {
        setUser({ ...user, photoURL: result.assets[0].uri });
      }
      Alert.alert('Success', 'Profile picture updated!');
    }
  };

  const takePhoto = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera to take a photo.');
      return;
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      // Update user profile with new image
      if (user) {
        setUser({ ...user, photoURL: result.assets[0].uri });
      }
      Alert.alert('Success', 'Profile picture updated!');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return colors.error;
      case 'mentor':
        return colors.secondary;
      case 'organizer':
        return colors.primary;
      case 'team':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: profileColors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: profileColors.textPrimary }]}>Profile</Text>
      </View>

      <Animated.View 
        style={[
          styles.profileCard, 
          { backgroundColor: profileColors.cardBg },
          { opacity: fadeAnim }
        ]}
      >
        {/* Animated glow rings */}
        <View style={styles.avatarWrapper}>
          {/* Outer rotating gradient ring */}
          <Animated.View
            style={[
              styles.gradientRing,
              {
                transform: [{ rotate: spin }, { scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.gradientRingInner} />
          </Animated.View>

          {/* Glowing pulse ring */}
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: glowOpacity,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />

          {/* Avatar Container */}
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={showImageOptions}
            activeOpacity={0.8}
          >
            <View style={styles.avatarBorder}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <LinearGradient
                  colors={[profileColors.gradientStart, profileColors.gradientMid, profileColors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>
                    {user?.name.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </LinearGradient>
              )}
            </View>

            {/* Enhanced camera button with gradient */}
            <Animated.View
              style={[
                styles.cameraButtonContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={theme === 'dark' ? ['#8B5CF6', '#6366F1', '#3B82F6'] : ['#0EA5E9', '#38BDF8', '#22D3EE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cameraButton}
              >
                <Ionicons name="camera" size={20} color="#FFF" />
              </LinearGradient>
              <View style={styles.cameraButtonGlow} />
            </Animated.View>
          </TouchableOpacity>
        </View>

        
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={[styles.name, { color: profileColors.textPrimary }]}>
            {user?.name || 'Guest User'}
          </Text>
          
          <Text style={[styles.email, { color: profileColors.textSecondary }]}>
            {user?.email || 'guest@hackintake.com'}
          </Text>
          
          <LinearGradient
            colors={[
              getRoleColor(user?.role || 'team') + '40',
              getRoleColor(user?.role || 'team') + '20',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.roleBadge}
          >
            <View style={styles.roleBadgeInner}>
              <View style={[styles.roleDot, { backgroundColor: getRoleColor(user?.role || 'team') }]} />
              <Text
                style={[styles.roleText, { color: getRoleColor(user?.role || 'team') }]}
              >
                {user?.role?.toUpperCase() || 'TEAM MEMBER'}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>

      <View style={[styles.statsCard, { backgroundColor: profileColors.cardBg }]}>
        <View style={styles.statItem}>
          <Ionicons name="document-text" size={28} color={profileColors.primary} />
          <Text style={[styles.statNumber, { color: profileColors.textPrimary }]}>
            {userProblems.length}
          </Text>
          <Text style={[styles.statLabel, { color: profileColors.textSecondary }]}>
            Submitted
          </Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: profileColors.border }]} />
        
        <View style={styles.statItem}>
          <Ionicons name="bookmark" size={28} color={profileColors.accent} />
          <Text style={[styles.statNumber, { color: profileColors.textPrimary }]}>
            {bookmarkedProblems.length}
          </Text>
          <Text style={[styles.statLabel, { color: profileColors.textSecondary }]}>
            Bookmarked
          </Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: profileColors.border }]} />
        
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={28} color={profileColors.warning} />
          <Text style={[styles.statNumber, { color: profileColors.textPrimary }]}>
            {userProblems.filter((p) => p.status === 'highlighted').length}
          </Text>
          <Text style={[styles.statLabel, { color: profileColors.textSecondary }]}>
            Highlighted
          </Text>
        </View>
      </View>

      <View style={[styles.menuCard, { backgroundColor: profileColors.cardBg }]}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setShowSettingsModal(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: profileColors.primary + '20' }]}>
            <Ionicons name="settings-outline" size={22} color={profileColors.primary} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuText, { color: profileColors.textPrimary }]}>
              Settings
            </Text>
            <Text style={[styles.menuSubtext, { color: profileColors.textSecondary }]}>
              App preferences
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
        </TouchableOpacity>
        
        <View style={[styles.menuDivider, { backgroundColor: profileColors.border }]} />
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setShowNotificationsModal(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: profileColors.warning + '20' }]}>
            <Ionicons name="notifications-outline" size={22} color={profileColors.warning} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuText, { color: profileColors.textPrimary }]}>
              Notifications
            </Text>
            <Text style={[styles.menuSubtext, { color: profileColors.textSecondary }]}>
              Alerts and updates
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
        </TouchableOpacity>
        
        <View style={[styles.menuDivider, { backgroundColor: profileColors.border }]} />
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setShowHelpModal(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: profileColors.success + '20' }]}>
            <Ionicons name="help-circle-outline" size={22} color={profileColors.success} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuText, { color: profileColors.textPrimary }]}>
              Help & Support
            </Text>
            <Text style={[styles.menuSubtext, { color: profileColors.textSecondary }]}>
              Get assistance
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
        </TouchableOpacity>
        
        <View style={[styles.menuDivider, { backgroundColor: profileColors.border }]} />
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setShowAboutModal(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: profileColors.purple + '20' }]}>
            <Ionicons name="information-circle-outline" size={22} color={profileColors.purple} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuText, { color: profileColors.textPrimary }]}>
              About
            </Text>
            <Text style={[styles.menuSubtext, { color: profileColors.textSecondary }]}>
              App information
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButtonWrapper}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme === 'dark' ? ['#EF4444', '#DC2626', '#B91C1C'] : ['#F87171', '#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoutButton}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={[styles.version, { color: profileColors.textSecondary }]}>
        Version 1.0.0
      </Text>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: profileColors.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: profileColors.textPrimary }]}>
                ⚙️ Settings
              </Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={28} color={profileColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Appearance Section */}
              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: profileColors.accent }]}>
                  🎨 APPEARANCE
                </Text>
                
                <View style={[styles.settingRow, { backgroundColor: profileColors.background }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={22} color={profileColors.primary} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Dark Mode
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Switch between light and dark theme
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: profileColors.border, true: profileColors.primary }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* Notifications Section */}
              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: profileColors.accent }]}>
                  🔔 NOTIFICATIONS
                </Text>
                
                <View style={[styles.settingRow, { backgroundColor: profileColors.background }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="notifications" size={22} color={profileColors.success} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Enable Notifications
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Receive all app notifications
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: profileColors.border, true: profileColors.success }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={[styles.settingRow, { backgroundColor: profileColors.background }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="mail" size={22} color={profileColors.primary} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Email Notifications
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Get updates via email
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={emailNotifications}
                    onValueChange={setEmailNotifications}
                    trackColor={{ false: profileColors.border, true: profileColors.primary }}
                    thumbColor="#FFFFFF"
                    disabled={!notificationsEnabled}
                  />
                </View>

                <View style={[styles.settingRow, { backgroundColor: profileColors.background }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="phone-portrait" size={22} color={profileColors.purple} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Push Notifications
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Instant mobile alerts
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={pushNotifications}
                    onValueChange={setPushNotifications}
                    trackColor={{ false: profileColors.border, true: profileColors.purple }}
                    thumbColor="#FFFFFF"
                    disabled={!notificationsEnabled}
                  />
                </View>

                <View style={[styles.settingRow, { backgroundColor: profileColors.background }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="document-text" size={22} color={profileColors.warning} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Problem Updates
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Status changes on your problems
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={problemUpdates}
                    onValueChange={setProblemUpdates}
                    trackColor={{ false: profileColors.border, true: profileColors.warning }}
                    thumbColor="#FFFFFF"
                    disabled={!notificationsEnabled}
                  />
                </View>

                <View style={[styles.settingRow, { backgroundColor: profileColors.background }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="chatbubble" size={22} color={profileColors.accent} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Mentor Feedback
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Comments and suggestions
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={mentorFeedback}
                    onValueChange={setMentorFeedback}
                    trackColor={{ false: profileColors.border, true: profileColors.accent }}
                    thumbColor="#FFFFFF"
                    disabled={!notificationsEnabled}
                  />
                </View>
              </View>

              {/* General Section */}
              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: profileColors.accent }]}>
                  🛠️ GENERAL
                </Text>
                
                <View style={[styles.settingRow, { backgroundColor: profileColors.background }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="save" size={22} color={profileColors.success} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Auto-Save Drafts
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Automatically save problem drafts
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={autoSave}
                    onValueChange={setAutoSave}
                    trackColor={{ false: profileColors.border, true: profileColors.success }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={[styles.settingRow, { backgroundColor: profileColors.background }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="volume-medium" size={22} color={profileColors.purple} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Sound Effects
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Play sounds for actions
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={soundEffects}
                    onValueChange={setSoundEffects}
                    trackColor={{ false: profileColors.border, true: profileColors.purple }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.settingRow, { backgroundColor: profileColors.background }]}
                  onPress={() => Alert.alert('Language', 'Language selection coming soon!')}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name="language" size={22} color={profileColors.primary} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Language
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        English (US)
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Privacy & Security Section */}
              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: profileColors.accent }]}>
                  🔒 PRIVACY & SECURITY
                </Text>
                
                <TouchableOpacity 
                  style={[styles.settingRow, { backgroundColor: profileColors.background }]}
                  onPress={() => Alert.alert('Privacy', 'View your privacy settings and data usage policies.')}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name="shield-checkmark" size={22} color={profileColors.success} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Privacy Policy
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        How we handle your data
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.settingRow, { backgroundColor: profileColors.background }]}
                  onPress={() => Alert.alert('Terms', 'View the Terms of Service for using HackIntake.')}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name="document-lock" size={22} color={profileColors.warning} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Terms of Service
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Usage terms and conditions
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.settingRow, { backgroundColor: profileColors.background }]}
                  onPress={() => Alert.alert('Account', 'Change password feature coming soon!')}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name="key" size={22} color={profileColors.error} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Change Password
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Update your account password
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Data Management Section */}
              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: profileColors.accent }]}>
                  💾 DATA MANAGEMENT
                </Text>
                
                <TouchableOpacity 
                  style={[styles.settingRow, { backgroundColor: profileColors.background }]}
                  onPress={() => Alert.alert('Cache Cleared', 'App cache has been cleared successfully!')}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name="trash" size={22} color={profileColors.warning} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Clear Cache
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Free up storage space
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.settingRow, { backgroundColor: profileColors.background }]}
                  onPress={() => Alert.alert('Export Data', 'Export your data in JSON format. Coming soon!')}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name="download" size={22} color={profileColors.primary} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.textPrimary }]}>
                        Export Data
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Download your information
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.settingRow, { backgroundColor: profileColors.background }]}
                  onPress={() => {
                    Alert.alert(
                      'Delete Account',
                      'Are you sure you want to delete your account? This action cannot be undone.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: () => Alert.alert('Account Deleted', 'Your account has been permanently deleted.')
                        }
                      ]
                    );
                  }}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name="warning" size={22} color={profileColors.error} />
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: profileColors.error }]}>
                        Delete Account
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: profileColors.textSecondary }]}>
                        Permanently remove account
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={profileColors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingsFooter}>
                <Text style={[styles.settingsFooterText, { color: profileColors.textSecondary }]}>
                  HackIntake v1.0.0
                </Text>
                <Text style={[styles.settingsFooterText, { color: profileColors.textSecondary }]}>
                  © 2025 All rights reserved
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: profileColors.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: profileColors.textPrimary }]}>
                🔔 Notifications
              </Text>
              <TouchableOpacity onPress={() => setShowNotificationsModal(false)}>
                <Ionicons name="close" size={28} color={profileColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={[styles.notificationItem, { backgroundColor: profileColors.background }]}>
                <Ionicons name="checkmark-circle" size={24} color={profileColors.success} />
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationTitle, { color: profileColors.textPrimary }]}>
                    Problem Approved
                  </Text>
                  <Text style={[styles.notificationText, { color: profileColors.textSecondary }]}>
                    Your problem statement "Smart Healthcare" has been approved by mentor.
                  </Text>
                  <Text style={[styles.notificationTime, { color: profileColors.textSecondary }]}>
                    2 hours ago
                  </Text>
                </View>
              </View>

              <View style={[styles.notificationItem, { backgroundColor: profileColors.background }]}>
                <Ionicons name="star" size={24} color={profileColors.warning} />
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationTitle, { color: profileColors.textPrimary }]}>
                    Problem Highlighted
                  </Text>
                  <Text style={[styles.notificationText, { color: profileColors.textSecondary }]}>
                    Your submission has been highlighted as a top problem!
                  </Text>
                  <Text style={[styles.notificationTime, { color: profileColors.textSecondary }]}>
                    5 hours ago
                  </Text>
                </View>
              </View>

              <View style={[styles.notificationItem, { backgroundColor: profileColors.background }]}>
                <Ionicons name="chatbubbles" size={24} color={profileColors.primary} />
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationTitle, { color: profileColors.textPrimary }]}>
                    New Comment
                  </Text>
                  <Text style={[styles.notificationText, { color: profileColors.textSecondary }]}>
                    A mentor commented on your problem statement.
                  </Text>
                  <Text style={[styles.notificationTime, { color: profileColors.textSecondary }]}>
                    1 day ago
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        visible={showHelpModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: profileColors.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: profileColors.textPrimary }]}>
                ❓ Help & Support
              </Text>
              <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                <Ionicons name="close" size={28} color={profileColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.helpSection}>
                <Text style={[styles.helpTitle, { color: profileColors.textPrimary }]}>
                  📧 Contact Us
                </Text>
                <Text style={[styles.helpText, { color: profileColors.textSecondary }]}>
                  Email: support@hackintake.com{'\n'}
                  Phone: +1 (555) 123-4567
                </Text>
              </View>

              <View style={styles.helpSection}>
                <Text style={[styles.helpTitle, { color: profileColors.textPrimary }]}>
                  💬 FAQ
                </Text>
                <Text style={[styles.helpQuestion, { color: profileColors.textPrimary }]}>
                  How do I submit a problem?
                </Text>
                <Text style={[styles.helpText, { color: profileColors.textSecondary }]}>
                  Go to the Dashboard and click the "+" button to submit a new problem statement.
                </Text>

                <Text style={[styles.helpQuestion, { color: profileColors.textPrimary }]}>
                  How do mentors review problems?
                </Text>
                <Text style={[styles.helpText, { color: profileColors.textSecondary }]}>
                  Mentors can access the Mentor Panel to approve, reject, or highlight problem statements.
                </Text>

                <Text style={[styles.helpQuestion, { color: profileColors.textPrimary }]}>
                  What is AI Generator?
                </Text>
                <Text style={[styles.helpText, { color: profileColors.textSecondary }]}>
                  AI Generator creates problem statements based on your topic input using artificial intelligence.
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.helpButton, { backgroundColor: profileColors.primary }]}
                onPress={() => Alert.alert('Coming Soon', 'Live chat support will be available soon!')}
              >
                <Ionicons name="chatbubbles" size={20} color="#FFF" />
                <Text style={styles.helpButtonText}>Start Live Chat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: profileColors.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: profileColors.textPrimary }]}>
                ℹ️ About HackIntake
              </Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Ionicons name="close" size={28} color={profileColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={[styles.aboutLogo, { backgroundColor: profileColors.primary }]}>
                <Ionicons name="rocket" size={48} color="#FFF" />
              </View>

              <Text style={[styles.aboutAppName, { color: profileColors.textPrimary }]}>
                HackIntake
              </Text>
              <Text style={[styles.aboutVersion, { color: profileColors.textSecondary }]}>
                Version 1.0.0
              </Text>

              <View style={styles.aboutSection}>
                <Text style={[styles.aboutTitle, { color: profileColors.textPrimary }]}>
                  🎯 Mission
                </Text>
                <Text style={[styles.aboutText, { color: profileColors.textSecondary }]}>
                  HackIntake is a comprehensive platform for managing hackathon problem statements. We empower organizers, mentors, and teams to collaborate effectively.
                </Text>
              </View>

              <View style={styles.aboutSection}>
                <Text style={[styles.aboutTitle, { color: profileColors.textPrimary }]}>
                  ✨ Features
                </Text>
                <Text style={[styles.aboutText, { color: profileColors.textSecondary }]}>
                  • Submit and browse problem statements{'\n'}
                  • AI-powered problem generation{'\n'}
                  • Mentor review and approval system{'\n'}
                  • Real-time dashboard updates{'\n'}
                  • Dark mode support{'\n'}
                  • Bookmark and track problems
                </Text>
              </View>

              <View style={styles.aboutSection}>
                <Text style={[styles.aboutTitle, { color: profileColors.textPrimary }]}>
                  👥 Team
                </Text>
                <Text style={[styles.aboutText, { color: profileColors.textSecondary }]}>
                  Built with ❤️ by the HackIntake team
                </Text>
              </View>

              <View style={styles.aboutLinks}>
                <TouchableOpacity style={styles.aboutLink}>
                  <Ionicons name="globe" size={20} color={profileColors.primary} />
                  <Text style={[styles.aboutLinkText, { color: profileColors.primary }]}>
                    Website
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.aboutLink}>
                  <Ionicons name="logo-github" size={20} color={profileColors.primary} />
                  <Text style={[styles.aboutLinkText, { color: profileColors.primary }]}>
                    GitHub
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.aboutLink}>
                  <Ionicons name="logo-twitter" size={20} color={profileColors.primary} />
                  <Text style={[styles.aboutLinkText, { color: profileColors.primary }]}>
                    Twitter
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.aboutCopyright, { color: profileColors.textSecondary }]}>
                © 2025 HackIntake. All rights reserved.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  profileCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gradientRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 3,
    backgroundColor: 'transparent',
  },
  gradientRingInner: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: '#2563EB',
    borderRightColor: '#8B5CF6',
    borderBottomColor: '#60A5FA',
    borderLeftColor: '#3B82F6',
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    backgroundColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#0A0E27',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraButtonGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  roleBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
  },
  menuCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 12,
  },
  menuDivider: {
    height: 1,
    marginLeft: 76,
  },
  logoutButtonWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  modalBody: {
    padding: 20,
  },
  // Notification styles
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  // Help styles
  helpSection: {
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  helpQuestion: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 22,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  helpButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // About styles
  aboutLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  aboutAppName: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
  },
  aboutLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 20,
  },
  aboutLink: {
    alignItems: 'center',
    gap: 6,
  },
  aboutLinkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  aboutCopyright: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
  // Settings modal styles
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  settingsFooter: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    gap: 4,
  },
  settingsFooterText: {
    fontSize: 11,
  },
});
