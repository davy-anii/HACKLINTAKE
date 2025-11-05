import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { mockGoogleAccounts } from '../utils/googleAuth';

interface GoogleAccount {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleAccountPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccount) => void;
}

export const GoogleAccountPicker: React.FC<GoogleAccountPickerProps> = ({
  visible,
  onClose,
  onSelectAccount,
}) => {
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

  const pickerColors = {
    overlay: 'rgba(0, 0, 0, 0.7)',
    modalBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    headerBg: theme === 'dark' ? '#0F172A' : '#E0F2FE',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
    hoverBg: theme === 'dark' ? '#334155' : '#F0F9FF',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: pickerColors.overlay }]}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: pickerColors.modalBg,
              borderColor: pickerColors.border,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: pickerColors.headerBg }]}>
            <View style={styles.headerContent}>
              <Ionicons name="logo-google" size={28} color={pickerColors.primary} />
              <View style={styles.headerText}>
                <Text style={[styles.headerTitle, { color: pickerColors.textPrimary }]}>
                  Choose an account
                </Text>
                <Text style={[styles.headerSubtitle, { color: pickerColors.textSecondary }]}>
                  to continue to HackIntake
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={pickerColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Account List */}
          <ScrollView
            style={styles.accountList}
            showsVerticalScrollIndicator={false}
          >
            {mockGoogleAccounts.map((account, index) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountItem,
                  {
                    backgroundColor: pickerColors.modalBg,
                    borderBottomColor: pickerColors.border,
                  },
                ]}
                onPress={() => onSelectAccount(account)}
                activeOpacity={0.7}
              >
                <View style={styles.accountContent}>
                  <View style={[styles.avatarContainer, { borderColor: pickerColors.primary }]}>
                    <Image
                      source={{ uri: account.picture }}
                      style={styles.avatar}
                    />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={[styles.accountName, { color: pickerColors.textPrimary }]}>
                      {account.name}
                    </Text>
                    <Text style={[styles.accountEmail, { color: pickerColors.textSecondary }]}>
                      {account.email}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={pickerColors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}

            {/* Use Another Account */}
            <TouchableOpacity
              style={[
                styles.anotherAccountButton,
                {
                  borderTopColor: pickerColors.border,
                  backgroundColor: pickerColors.modalBg,
                },
              ]}
              onPress={() => {
                // In production, this would trigger real Google OAuth
                onSelectAccount({
                  id: 'new',
                  email: 'newuser@gmail.com',
                  name: 'New User',
                  picture: 'https://i.pravatar.cc/150?img=68',
                });
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.addAccountIcon, { backgroundColor: pickerColors.primary }]}>
                <Ionicons name="person-add" size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.anotherAccountText, { color: pickerColors.textPrimary }]}>
                Use another account
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: pickerColors.border }]}>
            <Text style={[styles.footerText, { color: pickerColors.textSecondary }]}>
              To continue, Google will share your name, email address, and profile picture with HackIntake.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  accountList: {
    maxHeight: 400,
  },
  accountItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  accountContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  accountInfo: {
    flex: 1,
    marginLeft: 14,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  accountEmail: {
    fontSize: 13,
    fontWeight: '500',
  },
  anotherAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderTopWidth: 1,
    marginTop: 8,
  },
  addAccountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anotherAccountText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
