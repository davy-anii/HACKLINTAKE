import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useLanguage } from '../utils/LanguageContext';
import { useAppStore } from '../store/appStore';
import { ProblemCard } from '../components/ProblemCard';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { ProblemStatus } from '../types';
import { PageAnimation } from '../components/PageAnimation';

export const MentorPanelScreen = ({ navigation }: any) => {
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const { filteredProblems, updateProblem, user } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState<ProblemStatus | 'all'>('pending');

  // Dynamic colors based on theme
  const mentorColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    accent: theme === 'dark' ? '#60A5FA' : '#38BDF8',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    purple: theme === 'dark' ? '#8B5CF6' : '#22D3EE',
    textPrimary: theme === 'dark' ? '#000000' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
  };

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  // Entrance animations
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

    // Pulse animation for stats
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const problemsByStatus = selectedStatus === 'all'
    ? filteredProblems
    : filteredProblems.filter((p) => p.status === selectedStatus);

  const handleApprove = (problemId: string) => {
    Alert.alert(
      'Approve Problem',
      'Are you sure you want to approve this problem statement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => updateProblem(problemId, { status: 'approved' }),
        },
      ]
    );
  };

  const handleReject = (problemId: string) => {
    Alert.alert(
      'Reject Problem',
      'Are you sure you want to reject this problem statement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => updateProblem(problemId, { status: 'rejected' }),
        },
      ]
    );
  };

  const handleHighlight = (problemId: string) => {
    updateProblem(problemId, { status: 'highlighted' });
    Alert.alert('Success', 'Problem has been highlighted!');
  };

  const handleAssignMentor = (problemId: string) => {
    if (user) {
      updateProblem(problemId, { assignedMentor: user.id });
      Alert.alert('Success', 'You have been assigned to this problem!');
    }
  };

  const getStatusCount = (status: ProblemStatus) => {
    return filteredProblems.filter((p) => p.status === status).length;
  };

  const renderProblemItem = ({ item, index }: any) => {
    const itemFadeAnim = new Animated.Value(0);
    const itemSlideAnim = new Animated.Value(30);

    Animated.parallel([
      Animated.timing(itemFadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(itemSlideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    return (
      <Animated.View
        style={[
          styles.problemContainer,
          {
            opacity: itemFadeAnim,
            transform: [{ translateY: itemSlideAnim }],
          },
        ]}
      >
        <ProblemCard
          problem={item}
          onPress={() => navigation.navigate('ProblemDetail', { problemId: item.id })}
        />
        
        <View style={[styles.actionsContainer, { backgroundColor: mentorColors.cardBg }]}>
          {item.status === 'pending' && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: mentorColors.success }]}
                onPress={() => handleApprove(item.id)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>{t('approve')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: mentorColors.error }]}
                onPress={() => handleReject(item.id)}
              >
                <Ionicons name="close-circle" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>{t('reject')}</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {item.status === 'approved' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: mentorColors.purple }]}
              onPress={() => handleHighlight(item.id)}
            >
              <Ionicons name="star" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>{t('highlight')}</Text>
            </TouchableOpacity>
          )}
          
          {!item.assignedMentor && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: mentorColors.accent, marginTop: 8 }]}
              onPress={() => handleAssignMentor(item.id)}
            >
              <Ionicons name="person-add" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>{t('assignToMe')}</Text>
            </TouchableOpacity>
          )}
          
          {item.assignedMentor && (
            <View style={[styles.assignedBadge, { backgroundColor: mentorColors.success + '20' }]}>
              <Ionicons name="checkmark-circle" size={18} color={mentorColors.success} />
              <Text style={[styles.assignedText, { color: mentorColors.success }]}>
                ✓ {t('mentorAssigned')}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <PageAnimation variant="mentor">
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: theme === 'dark' ? '#000000' : mentorColors.textPrimary }]}>
              🛡️ {t('mentorPanel')}
            </Text>
            <Text style={[styles.subtitle, { color: mentorColors.textSecondary }]}>
              {t('reviewAndManage')}
            </Text>
          </View>
          <View style={[styles.mentorBadge, { backgroundColor: mentorColors.purple + '20' }]}>
            <Ionicons name="shield-checkmark" size={24} color={mentorColors.purple} />
          </View>
        </View>
      </Animated.View>

      {/* Animated Stats Cards */}
      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.statCard,
            { backgroundColor: mentorColors.cardBg, transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={[styles.statIconContainer, { backgroundColor: mentorColors.warning + '20' }]}>
            <Ionicons name="time" size={28} color={mentorColors.warning} />
          </View>
          <Text style={[styles.statNumber, { color: mentorColors.textPrimary }]}>
            {getStatusCount('pending')}
          </Text>
          <Text style={[styles.statLabel, { color: mentorColors.textSecondary }]}>
            {t('pendingReview')}
          </Text>
        </Animated.View>

        <View style={[styles.statCard, { backgroundColor: mentorColors.cardBg }]}>
          <View style={[styles.statIconContainer, { backgroundColor: mentorColors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={28} color={mentorColors.success} />
          </View>
          <Text style={[styles.statNumber, { color: mentorColors.textPrimary }]}>
            {getStatusCount('approved')}
          </Text>
          <Text style={[styles.statLabel, { color: mentorColors.textSecondary }]}>
            {t('approved')}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: mentorColors.cardBg }]}>
          <View style={[styles.statIconContainer, { backgroundColor: mentorColors.purple + '20' }]}>
            <Ionicons name="star" size={28} color={mentorColors.purple} />
          </View>
          <Text style={[styles.statNumber, { color: mentorColors.textPrimary }]}>
            {getStatusCount('highlighted')}
          </Text>
          <Text style={[styles.statLabel, { color: mentorColors.textSecondary }]}>
            {t('highlighted')}
          </Text>
        </View>
      </Animated.View>

      {/* Animated Filter Tabs */}
      <Animated.View
        style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              {
                backgroundColor: selectedStatus === 'all' ? mentorColors.primary : mentorColors.cardBg,
                borderColor: selectedStatus === 'all' ? mentorColors.primary : mentorColors.border,
              },
            ]}
            onPress={() => setSelectedStatus('all')}
          >
            <Ionicons
              name="apps"
              size={18}
              color={selectedStatus === 'all' ? '#FFF' : mentorColors.textSecondary}
            />
            <Text
              style={[
                styles.filterTabText,
                { color: '#FFFFFF' },
              ]}
            >
              {t('all')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              {
                backgroundColor: selectedStatus === 'pending' ? mentorColors.warning : mentorColors.cardBg,
                borderColor: selectedStatus === 'pending' ? mentorColors.warning : mentorColors.border,
              },
            ]}
            onPress={() => setSelectedStatus('pending')}
          >
            <Ionicons
              name="time"
              size={18}
              color={selectedStatus === 'pending' ? '#FFF' : mentorColors.textSecondary}
            />
            <Text
              style={[
                styles.filterTabText,
                { color: '#FFFFFF' },
              ]}
            >
              {t('pending')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              {
                backgroundColor: selectedStatus === 'approved' ? mentorColors.success : mentorColors.cardBg,
                borderColor: selectedStatus === 'approved' ? mentorColors.success : mentorColors.border,
              },
            ]}
            onPress={() => setSelectedStatus('approved')}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={selectedStatus === 'approved' ? '#FFF' : mentorColors.textSecondary}
            />
            <Text
              style={[
                styles.filterTabText,
                { color: '#FFFFFF' },
              ]}
            >
              {t('approved')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              {
                backgroundColor: selectedStatus === 'highlighted' ? mentorColors.purple : mentorColors.cardBg,
                borderColor: selectedStatus === 'highlighted' ? mentorColors.purple : mentorColors.border,
              },
            ]}
            onPress={() => setSelectedStatus('highlighted')}
          >
            <Ionicons
              name="star"
              size={18}
              color={selectedStatus === 'highlighted' ? '#FFF' : mentorColors.textSecondary}
            />
            <Text
              style={[
                styles.filterTabText,
                { color: '#FFFFFF' },
              ]}
            >
              {t('topPicks')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Problems List */}
      <FlatList
        data={problemsByStatus}
        renderItem={renderProblemItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color={mentorColors.textSecondary} />
            <Text style={[styles.emptyText, { color: mentorColors.textPrimary }]}>
              No problems in this category
            </Text>
            <Text style={[styles.emptySubtext, { color: mentorColors.textSecondary }]}>
              Check back later for new submissions
            </Text>
          </View>
        }
      />
    </View>
    </PageAnimation>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  mentorBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  problemContainer: {
    marginBottom: 16,
  },
  actionsContainer: {
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  assignedText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
