import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { QRScanner } from '../components/QRScanner';
import {
  getApprovalsByOrganizer,
  getAllParticipants,
  updateApprovalByOrganizer,
  verifyParticipant,
  updateParticipantStatus,
  subscribeToApprovals,
  subscribeToParticipants,
} from '../firebase/firebaseService';
import { Approval, ParticipantRegistration } from '../types';

export const OrganizerDashboardScreen = () => {
  const { theme } = useTheme();
  const user = useAppStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'approvals' | 'participants'>('approvals');
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [participants, setParticipants] = useState<ParticipantRegistration[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const organizerColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    primary: theme === 'dark' ? '#8B5CF6' : '#A78BFA',
    accent: theme === 'dark' ? '#C084FC' : '#DDD6FE',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
    success: theme === 'dark' ? '#10B981' : '#059669',
    danger: theme === 'dark' ? '#EF4444' : '#DC2626',
    warning: theme === 'dark' ? '#F59E0B' : '#D97706',
  };

  useEffect(() => {
    loadData();
    
    // Setup real-time listeners
    const unsubscribeApprovals = subscribeToApprovals(setApprovals);
    const unsubscribeParticipants = subscribeToParticipants(setParticipants);
    
    return () => {
      unsubscribeApprovals();
      unsubscribeParticipants();
    };
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    const [approvalsData, participantsData] = await Promise.all([
      getApprovalsByOrganizer(),
      getAllParticipants(),
    ]);
    setApprovals(approvalsData);
    setParticipants(participantsData);
    setRefreshing(false);
  };

  const handleApproval = async (approvalId: string, status: 'approved' | 'rejected', feedback: string, score?: number) => {
    if (!user) return;
    
    Alert.alert(
      `${status === 'approved' ? 'Approve' : 'Reject'} Submission`,
      `Are you sure you want to ${status} this submission?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const result = await updateApprovalByOrganizer(
              approvalId,
              status,
              feedback,
              user.id,
              score
            );
            
            if (result.success) {
              Alert.alert('Success', `Submission ${status} successfully`);
              loadData();
            } else {
              Alert.alert('Error', 'Failed to update approval');
            }
          },
        },
      ]
    );
  };

  const handleQRScan = async (qrData: string) => {
    setShowScanner(false);
    
    if (!user) return;
    
    const result = await verifyParticipant(qrData, user.id);
    
    if (result.success) {
      Alert.alert('Success', 'Participant verified successfully!');
      loadData();
    } else {
      const errorMessage = typeof result.error === 'string' ? result.error : 'Failed to verify participant';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleParticipantStatus = async (registrationId: string, status: 'selected' | 'rejected') => {
    if (!user) return;
    
    Alert.alert(
      `${status === 'selected' ? 'Select' : 'Reject'} Participant`,
      `Are you sure you want to ${status} this participant?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const result = await updateParticipantStatus(registrationId, status, user.id);
            
            if (result.success) {
              Alert.alert('Success', `Participant ${status} successfully`);
              loadData();
            } else {
              Alert.alert('Error', 'Failed to update participant status');
            }
          },
        },
      ]
    );
  };

  const renderStats = () => {
    const pendingApprovals = approvals.filter((a) => a.organizerStatus === 'pending').length;
    const verifiedParticipants = participants.filter((p) => p.status === 'verified').length;
    const selectedParticipants = participants.filter((p) => p.status === 'selected').length;

    return (
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: organizerColors.cardBg, borderColor: organizerColors.border }]}>
          <Text style={[styles.statValue, { color: organizerColors.warning }]}>{pendingApprovals}</Text>
          <Text style={[styles.statLabel, { color: organizerColors.textSecondary }]}>Pending Approvals</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: organizerColors.cardBg, borderColor: organizerColors.border }]}>
          <Text style={[styles.statValue, { color: organizerColors.success }]}>{verifiedParticipants}</Text>
          <Text style={[styles.statLabel, { color: organizerColors.textSecondary }]}>Verified</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: organizerColors.cardBg, borderColor: organizerColors.border }]}>
          <Text style={[styles.statValue, { color: organizerColors.primary }]}>{selectedParticipants}</Text>
          <Text style={[styles.statLabel, { color: organizerColors.textSecondary }]}>Selected</Text>
        </View>
      </View>
    );
  };

  const renderApprovalCard = (approval: Approval) => (
    <View
      key={approval.id}
      style={[styles.card, { backgroundColor: organizerColors.cardBg, borderColor: organizerColors.border }]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: organizerColors.textPrimary }]}>
          {approval.participantName}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                approval.organizerStatus === 'approved'
                  ? organizerColors.success
                  : approval.organizerStatus === 'rejected'
                  ? organizerColors.danger
                  : organizerColors.warning,
            },
          ]}
        >
          <Text style={styles.statusText}>{approval.organizerStatus}</Text>
        </View>
      </View>

      <Text style={[styles.cardSubtitle, { color: organizerColors.textSecondary }]}>
        Mentor: {approval.mentorName}
      </Text>

      <Text style={[styles.label, { color: organizerColors.textSecondary }]}>Mentor Feedback:</Text>
      <Text style={[styles.feedback, { color: organizerColors.textPrimary }]}>
        {approval.mentorFeedback}
      </Text>

      {approval.organizerStatus === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: organizerColors.success }]}
            onPress={() => handleApproval(approval.id, 'approved', 'Approved by organizer', 100)}
          >
            <Text style={styles.actionButtonText}>✓ Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: organizerColors.danger }]}
            onPress={() => handleApproval(approval.id, 'rejected', 'Rejected by organizer')}
          >
            <Text style={styles.actionButtonText}>✕ Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {approval.organizerFeedback && (
        <>
          <Text style={[styles.label, { color: organizerColors.textSecondary }]}>Your Feedback:</Text>
          <Text style={[styles.feedback, { color: organizerColors.textPrimary }]}>
            {approval.organizerFeedback}
          </Text>
        </>
      )}
    </View>
  );

  const renderParticipantCard = (participant: ParticipantRegistration) => (
    <View
      key={participant.id}
      style={[styles.card, { backgroundColor: organizerColors.cardBg, borderColor: organizerColors.border }]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: organizerColors.textPrimary }]}>
          {participant.userName}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                participant.status === 'selected'
                  ? organizerColors.success
                  : participant.status === 'verified'
                  ? organizerColors.primary
                  : participant.status === 'rejected'
                  ? organizerColors.danger
                  : organizerColors.warning,
            },
          ]}
        >
          <Text style={styles.statusText}>{participant.status}</Text>
        </View>
      </View>

      <Text style={[styles.cardSubtitle, { color: organizerColors.textSecondary }]}>
        {participant.email}
      </Text>

      {participant.teamName && (
        <Text style={[styles.info, { color: organizerColors.textPrimary }]}>
          Team: {participant.teamName}
        </Text>
      )}

      <Text style={[styles.info, { color: organizerColors.textPrimary }]}>
        Skills: {participant.skills.join(', ')}
      </Text>

      {participant.status === 'verified' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: organizerColors.success }]}
            onPress={() => handleParticipantStatus(participant.id, 'selected')}
          >
            <Text style={styles.actionButtonText}>✓ Select</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: organizerColors.danger }]}
            onPress={() => handleParticipantStatus(participant.id, 'rejected')}
          >
            <Text style={styles.actionButtonText}>✕ Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: organizerColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: organizerColors.textPrimary }]}>
          Organizer Dashboard
        </Text>
        <Text style={[styles.subtitle, { color: organizerColors.textSecondary }]}>
          Manage approvals and participants
        </Text>
      </View>

      {renderStats()}

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'approvals' && [styles.activeTab, { borderBottomColor: organizerColors.primary }],
          ]}
          onPress={() => setActiveTab('approvals')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'approvals' ? organizerColors.primary : organizerColors.textSecondary },
            ]}
          >
            Approvals ({approvals.filter((a) => a.organizerStatus === 'pending').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'participants' && [styles.activeTab, { borderBottomColor: organizerColors.primary }],
          ]}
          onPress={() => setActiveTab('participants')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'participants' ? organizerColors.primary : organizerColors.textSecondary },
            ]}
          >
            Participants ({participants.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'participants' && (
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: organizerColors.primary }]}
          onPress={() => setShowScanner(true)}
        >
          <Text style={styles.scanButtonText}>📷 Scan QR Code</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
      >
        {activeTab === 'approvals' ? (
          approvals.length > 0 ? (
            approvals.map(renderApprovalCard)
          ) : (
            <Text style={[styles.emptyText, { color: organizerColors.textSecondary }]}>
              No approvals yet
            </Text>
          )
        ) : participants.length > 0 ? (
          participants.map(renderParticipantCard)
        ) : (
          <Text style={[styles.emptyText, { color: organizerColors.textSecondary }]}>
            No participants registered yet
          </Text>
        )}
      </ScrollView>

      <Modal visible={showScanner} animationType="slide" onRequestClose={() => setShowScanner(false)}>
        <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  feedback: {
    fontSize: 14,
    lineHeight: 20,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
