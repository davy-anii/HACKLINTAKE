import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = ({ navigation }: any) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, setUser, problems } = useAppStore();

  const userProblems = problems.filter((p) => p.createdBy === user?.id);
  const bookmarkedProblems = problems.filter((p) =>
    p.bookmarkedBy?.includes(user?.id || '')
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setUser(null);
          // Navigation will automatically go to Auth screen
        },
      },
    ]);
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
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.name || 'Guest User'}
        </Text>
        
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {user?.email || 'guest@hackintake.com'}
        </Text>
        
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(user?.role || 'team') + '20' },
          ]}
        >
          <Text
            style={[styles.roleText, { color: getRoleColor(user?.role || 'team') }]}
          >
            {user?.role?.toUpperCase() || 'TEAM MEMBER'}
          </Text>
        </View>
      </View>

      <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Ionicons name="document-text" size={28} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {userProblems.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Submitted
          </Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Ionicons name="bookmark" size={28} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {bookmarkedProblems.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Bookmarked
          </Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={28} color={colors.warning} />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {userProblems.filter((p) => p.status === 'highlighted').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Highlighted
          </Text>
        </View>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons
              name={theme === 'dark' ? 'moon' : 'sunny'}
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                Toggle between light and dark theme
              </Text>
            </View>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>
            Notifications
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>About</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.textSecondary }]}>
        Version 1.0.0
      </Text>
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
    borderRadius: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
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
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
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
    backgroundColor: '#E5E7EB',
  },
  settingsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    marginLeft: 52,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
  },
});
