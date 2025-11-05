import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { ProblemCard } from '../components/ProblemCard';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { ProblemStatus } from '../types';

export const MentorPanelScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { filteredProblems, updateProblem, user } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState<ProblemStatus | 'all'>('pending');

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

  const renderProblemItem = ({ item }: any) => (
    <View style={styles.problemContainer}>
      <ProblemCard
        problem={item}
        onPress={() => navigation.navigate('ProblemDetail', { problemId: item.id })}
      />
      
      <View style={[styles.actionsContainer, { backgroundColor: colors.card }]}>
        {item.status === 'pending' && (
          <>
            <Button
              title="Approve"
              variant="primary"
              size="sm"
              onPress={() => handleApprove(item.id)}
              style={styles.actionButton}
            />
            <Button
              title="Reject"
              variant="outline"
              size="sm"
              onPress={() => handleReject(item.id)}
              style={styles.actionButton}
            />
          </>
        )}
        
        {item.status === 'approved' && (
          <Button
            title="⭐ Highlight"
            variant="secondary"
            size="sm"
            onPress={() => handleHighlight(item.id)}
            style={styles.actionButton}
          />
        )}
        
        {!item.assignedMentor && (
          <Button
            title="Assign to Me"
            variant="ghost"
            size="sm"
            onPress={() => handleAssignMentor(item.id)}
            style={styles.actionButton}
          />
        )}
        
        {item.assignedMentor && (
          <View style={[styles.assignedBadge, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.assignedText, { color: colors.success }]}>
              Mentor Assigned
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mentor Panel</Text>
      </View>

      <View style={[styles.statsBar, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {getStatusCount('pending')}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Pending
          </Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {getStatusCount('approved')}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Approved
          </Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.accent }]}>
            {getStatusCount('highlighted')}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Highlighted
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            {
              backgroundColor: selectedStatus === 'all' ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSelectedStatus('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: selectedStatus === 'all' ? '#FFF' : colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            {
              backgroundColor: selectedStatus === 'pending' ? colors.warning : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSelectedStatus('pending')}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: selectedStatus === 'pending' ? '#FFF' : colors.text },
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            {
              backgroundColor: selectedStatus === 'approved' ? colors.success : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSelectedStatus('approved')}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: selectedStatus === 'approved' ? '#FFF' : colors.text },
            ]}
          >
            Approved
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            {
              backgroundColor: selectedStatus === 'highlighted' ? colors.accent : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSelectedStatus('highlighted')}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: selectedStatus === 'highlighted' ? '#FFF' : colors.text },
            ]}
          >
            ⭐ Top
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={problemsByStatus}
        renderItem={renderProblemItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No problems in this category
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  problemContainer: {
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  assignedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
