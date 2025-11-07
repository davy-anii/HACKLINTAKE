import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useLanguage } from '../utils/LanguageContext';
import { useAppStore } from '../store/appStore';
import { Ionicons } from '@expo/vector-icons';
import { PageAnimation } from '../components/PageAnimation';

export const DashboardScreen = ({ navigation }: any) => {
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const { problems, user } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const fadeAnim = useState(new Animated.Value(1))[0];

  // Dynamic colors based on theme
  const dashboardColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    accent: theme === 'dark' ? '#60A5FA' : '#38BDF8',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
    shadow: theme === 'dark' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(14, 165, 233, 0.15)',
  };

  // Real-time updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pulse animation for live indicator
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Calculate dashboard stats
  const stats = {
    total: problems.length,
    pending: problems.filter(p => p.status === 'pending').length,
    approved: problems.filter(p => p.status === 'approved').length,
    rejected: problems.filter(p => p.status === 'rejected').length,
    urgent: problems.filter(p => p.urgent).length,
    mySubmissions: problems.filter(p => p.createdBy === user?.id).length,
  };

  // Get recent activity
  const recentProblems = [...problems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh with actual data reload
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <PageAnimation variant="home">
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={dashboardColors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
        {/* Header with Live Status */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: dashboardColors.textPrimary }]}>
              {t('dashboard')}
            </Text>
            <View style={styles.liveStatus}>
              <Animated.View
                style={[
                  styles.liveDot,
                  { backgroundColor: dashboardColors.success, opacity: fadeAnim },
                ]}
              />
              <Text style={[styles.liveText, { color: dashboardColors.textSecondary }]}>
                Live • {currentTime.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics Cards Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: dashboardColors.textPrimary }]}>
            {t('overview')}
          </Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: dashboardColors.cardBg }]}
              onPress={() => navigation.navigate('Problems')}
              activeOpacity={0.7}
            >
              <View style={[styles.statIconContainer, { backgroundColor: dashboardColors.primary + '20' }]}>
                <Ionicons name="document-text" size={24} color={dashboardColors.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {stats.total}
              </Text>
              <Text style={[styles.statLabel, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {t('totalProblems')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: dashboardColors.cardBg }]}
              onPress={() => navigation.navigate('Problems', { filter: 'pending' })}
              activeOpacity={0.7}
            >
              <View style={[styles.statIconContainer, { backgroundColor: dashboardColors.warning + '20' }]}>
                <Ionicons name="time" size={24} color={dashboardColors.warning} />
              </View>
              <Text style={[styles.statValue, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {stats.pending}
              </Text>
              <Text style={[styles.statLabel, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {t('pendingReview')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: dashboardColors.cardBg }]}
              onPress={() => navigation.navigate('Problems', { filter: 'approved' })}
              activeOpacity={0.7}
            >
              <View style={[styles.statIconContainer, { backgroundColor: dashboardColors.success + '20' }]}>
                <Ionicons name="checkmark-circle" size={24} color={dashboardColors.success} />
              </View>
              <Text style={[styles.statValue, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {stats.approved}
              </Text>
              <Text style={[styles.statLabel, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {t('approved')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: dashboardColors.cardBg }]}
              onPress={() => navigation.navigate('Problems', { filter: 'urgent' })}
              activeOpacity={0.7}
            >
              <View style={[styles.statIconContainer, { backgroundColor: dashboardColors.error + '20' }]}>
                <Ionicons name="alert-circle" size={24} color={dashboardColors.error} />
              </View>
              <Text style={[styles.statValue, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {stats.urgent}
              </Text>
              <Text style={[styles.statLabel, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {t('urgent')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: dashboardColors.textPrimary }]}>
            ⚡ {t('quickActions')}
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: dashboardColors.cardBg }]}
              onPress={() => navigation.navigate('SubmitProblem')}
            >
              <Ionicons name="document" size={28} color={dashboardColors.primary} />
              <Text style={[styles.actionText, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {t('submitProblem')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: dashboardColors.cardBg }]}
              onPress={() => navigation.navigate('Problems')}
            >
              <Ionicons name="document-text" size={28} color={dashboardColors.accent} />
              <Text style={[styles.actionText, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {t('viewAllProblems')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: dashboardColors.cardBg }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person" size={28} color={dashboardColors.success} />
              <Text style={[styles.actionText, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                {t('myProfile')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: dashboardColors.textPrimary }]}>
              🕒 {t('recentActivity')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Problems')}>
              <Text style={[styles.seeAll, { color: dashboardColors.accent }]}>
                {t('seeAll')} →
              </Text>
            </TouchableOpacity>
          </View>
          {recentProblems.map((problem) => (
            <TouchableOpacity
              key={problem.id}
              style={[styles.activityCard, { backgroundColor: dashboardColors.cardBg }]}
              onPress={() => navigation.navigate('ProblemDetail', { problemId: problem.id })}
            >
              <View style={styles.activityLeft}>
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: 
                    problem.status === 'approved' ? dashboardColors.success + '20' :
                    problem.status === 'rejected' ? dashboardColors.error + '20' :
                    dashboardColors.warning + '20'
                  }
                ]}>
                  <Ionicons
                    name={
                      problem.status === 'approved' ? 'checkmark' :
                      problem.status === 'rejected' ? 'close' :
                      'time'
                    }
                    size={20}
                    color={
                      problem.status === 'approved' ? dashboardColors.success :
                      problem.status === 'rejected' ? dashboardColors.error :
                      dashboardColors.warning
                    }
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: theme === 'dark' ? '#FFFFFF' : '#0C4A6E' }]}>
                    {problem.title}
                  </Text>
                  <Text style={[styles.activitySubtitle, { color: theme === 'dark' ? '#E2E8F0' : '#64748B' }]}>
                    {problem.category} • {problem.createdBy}
                  </Text>
                </View>
              </View>
              {problem.urgent && (
                <Ionicons name="warning" size={20} color={dashboardColors.error} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      </View>
    </PageAnimation>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 13,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  filterToggleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 12,
  },
  filterPanel: {
    padding: 16,
    borderRadius: 12,
    gap: 16,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
