import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import {
  getParticipantRegistration,
  registerParticipant,
} from '../firebase/firebaseService';
import { ParticipantRegistration } from '../types';

export const ParticipantQRScreen = () => {
  const { theme } = useTheme();
  const user = useAppStore((state) => state.user);
  const [registration, setRegistration] = useState<ParticipantRegistration | null>(null);
  const [loading, setLoading] = useState(true);

  const participantColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    accent: theme === 'dark' ? '#60A5FA' : '#38BDF8',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
    success: theme === 'dark' ? '#10B981' : '#059669',
    warning: theme === 'dark' ? '#F59E0B' : '#D97706',
  };

  useEffect(() => {
    loadRegistration();
  }, [user]);

  const loadRegistration = async () => {
    if (!user) return;
    
    setLoading(true);
    const reg = await getParticipantRegistration(user.id);
    
    if (!reg) {
      // Auto-register if not registered
      await handleRegister();
    } else {
      setRegistration(reg);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!user) return;
    
    const result = await registerParticipant({
      userId: user.id,
      userName: user.name,
      email: user.email,
      skills: user.skills || [],
      status: 'registered',
    });
    
    if (result.success && result.qrCode) {
      const reg = await getParticipantRegistration(user.id);
      setRegistration(reg);
      Alert.alert('Success', 'Registration completed! Show this QR code to organizers for verification.');
    } else {
      Alert.alert('Error', 'Failed to complete registration');
    }
  };

  const handleShare = async () => {
    if (!registration) return;
    
    try {
      await Share.share({
        message: `My HackIntake QR Code: ${registration.qrCode}`,
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected':
        return participantColors.success;
      case 'verified':
        return participantColors.primary;
      case 'rejected':
        return '#EF4444';
      default:
        return participantColors.warning;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'selected':
        return '🎉 Congratulations! You have been selected for the hackathon!';
      case 'verified':
        return '✅ Your registration has been verified by organizers';
      case 'rejected':
        return '❌ Unfortunately, your registration was not accepted';
      default:
        return '⏳ Waiting for verification from organizers';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: participantColors.background }]}>
        <Text style={[styles.loadingText, { color: participantColors.textPrimary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!registration) {
    return (
      <View style={[styles.container, { backgroundColor: participantColors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: participantColors.textPrimary }]}>
            Registration Required
          </Text>
          <Text style={[styles.emptyText, { color: participantColors.textSecondary }]}>
            You need to complete your registration to get your QR code
          </Text>
          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: participantColors.primary }]}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: participantColors.background }]}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: participantColors.textPrimary }]}>
            Your QR Code
          </Text>
          <Text style={[styles.subtitle, { color: participantColors.textSecondary }]}>
            Show this to organizers for verification
          </Text>
        </View>

        <View style={styles.qrSection}>
          <QRCodeGenerator
            data={registration.qrCode}
            size={280}
            title={registration.userName}
            description={registration.email}
          />
        </View>

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: participantColors.cardBg,
              borderColor: getStatusColor(registration.status),
            },
          ]}
        >
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(registration.status) },
            ]}
          >
            <Text style={styles.statusText}>{registration.status.toUpperCase()}</Text>
          </View>
          <Text style={[styles.statusMessage, { color: participantColors.textPrimary }]}>
            {getStatusMessage(registration.status)}
          </Text>
        </View>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: participantColors.cardBg, borderColor: participantColors.border },
          ]}
        >
          <Text style={[styles.infoTitle, { color: participantColors.textPrimary }]}>
            Registration Details
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: participantColors.textSecondary }]}>
              Name:
            </Text>
            <Text style={[styles.infoValue, { color: participantColors.textPrimary }]}>
              {registration.userName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: participantColors.textSecondary }]}>
              Email:
            </Text>
            <Text style={[styles.infoValue, { color: participantColors.textPrimary }]}>
              {registration.email}
            </Text>
          </View>

          {registration.teamName && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: participantColors.textSecondary }]}>
                Team:
              </Text>
              <Text style={[styles.infoValue, { color: participantColors.textPrimary }]}>
                {registration.teamName}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: participantColors.textSecondary }]}>
              Skills:
            </Text>
            <Text style={[styles.infoValue, { color: participantColors.textPrimary }]}>
              {registration.skills.join(', ')}
            </Text>
          </View>

          {registration.verifiedAt && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: participantColors.textSecondary }]}>
                Verified:
              </Text>
              <Text style={[styles.infoValue, { color: participantColors.success }]}>
                {new Date(registration.verifiedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: participantColors.primary }]}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>📤 Share QR Code</Text>
        </TouchableOpacity>

        <View style={styles.instructions}>
          <Text style={[styles.instructionsTitle, { color: participantColors.textPrimary }]}>
            Instructions:
          </Text>
          <Text style={[styles.instructionsText, { color: participantColors.textSecondary }]}>
            1. Show this QR code to event organizers
          </Text>
          <Text style={[styles.instructionsText, { color: participantColors.textSecondary }]}>
            2. Wait for verification and selection
          </Text>
          <Text style={[styles.instructionsText, { color: participantColors.textSecondary }]}>
            3. Check back for updates on your status
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
  qrSection: {
    padding: 20,
    alignItems: 'center',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statusMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  shareButton: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    padding: 20,
    paddingTop: 0,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  registerButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
