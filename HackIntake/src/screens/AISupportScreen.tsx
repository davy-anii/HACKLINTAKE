import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../utils/ThemeContext';
import { useLanguage } from '../utils/LanguageContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

const QUICK_ACTIONS = [
  { id: 1, icon: 'bulb-outline', title: 'How to submit?', query: 'How do I submit a problem statement?' },
  { id: 2, icon: 'people-outline', title: 'Team help', query: 'How do I manage my team?' },
  { id: 3, icon: 'shield-checkmark-outline', title: 'Mentor review', query: 'How does mentor review work?' },
  { id: 4, icon: 'settings-outline', title: 'Account issue', query: 'I have an account problem' },
];

export const AISupportScreen = ({ navigation }: any) => {
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "👋 Hi! I'm your AI assistant for HackIntake. I'm here to help you with any questions or issues you have. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        'How do I submit a problem?',
        'What is the mentor review process?',
        'How to use AI Generator?',
        'Account settings help',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const supportColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    userBubble: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    aiBubble: theme === 'dark' ? '#334155' : '#F0F9FF',
    primary: theme === 'dark' ? '#3B82F6' : '#0EA5E9',
    accent: theme === 'dark' ? '#8B5CF6' : '#22D3EE',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const getAIResponse = async (query: string): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerQuery = query.toLowerCase();

    // Problem submission help
    if (lowerQuery.includes('submit') || lowerQuery.includes('problem')) {
      return "To submit a problem statement:\n\n1. Go to the Dashboard screen\n2. Tap the '+' button at the bottom\n3. Fill in:\n   • Title (required)\n   • Description (required)\n   • Category\n   • Tags (comma separated)\n4. Optionally add attachments\n5. Tap 'Submit Problem'\n\nYour problem will be sent to mentors for review. You'll get a notification when it's reviewed!";
    }

    // Mentor review help
    if (lowerQuery.includes('mentor') || lowerQuery.includes('review') || lowerQuery.includes('approve')) {
      return "📋 Mentor Review Process:\n\n• Mentors review all submitted problems\n• They can:\n  ✅ Approve - Problem is accepted\n  ❌ Reject - Needs improvements\n  ⭐ Highlight - Outstanding problem\n  💬 Comment - Provide feedback\n\n• You'll receive notifications for:\n  • Status changes\n  • Mentor comments\n  • Highlighted problems\n\nCheck the 'Problems' tab to see all submissions and their status!";
    }

    // AI Generator help
    if (lowerQuery.includes('ai') || lowerQuery.includes('generator') || lowerQuery.includes('generate')) {
      return "🤖 AI Generator Guide:\n\n1. Go to the 'AI' tab\n2. Enter a topic/theme (e.g., 'Healthcare', 'Education')\n3. Tap 'Generate Problem Statement'\n4. AI will create:\n   • A title\n   • Complete description\n   • Relevant category\n   • Suggested tags\n\n5. Review and edit the generated content\n6. Tap 'Submit' to send to mentors\n\nTip: Be specific with your topic for better results!";
    }

    // Account & settings
    if (lowerQuery.includes('account') || lowerQuery.includes('profile') || lowerQuery.includes('password') || lowerQuery.includes('settings')) {
      return "⚙️ Account Management:\n\n• Profile Settings:\n  - Update photo\n  - Change language\n  - Toggle dark mode\n\n• Notifications:\n  - Email notifications\n  - Push notifications\n  - Problem updates\n\n• Security:\n  - Change password (coming soon)\n  - Privacy settings\n  - Data export\n\nGo to Profile → Settings to access all options!";
    }

    // Team management
    if (lowerQuery.includes('team') || lowerQuery.includes('member')) {
      return "👥 Team Management:\n\n• Team members can:\n  - Submit problem statements\n  - View all problems\n  - Bookmark favorites\n  - Use AI Generator\n\n• Organizers can:\n  - Everything teams can do\n  - Manage events\n  - View analytics\n\n• Mentors can:\n  - Review submissions\n  - Approve/reject problems\n  - Highlight best problems\n  - Provide feedback\n\nYour role: " + (navigation.getState ? "Check Profile to see" : "Team Member");
    }

    // Bookmarks
    if (lowerQuery.includes('bookmark') || lowerQuery.includes('save') || lowerQuery.includes('favorite')) {
      return "🔖 Bookmarks:\n\n• Tap the bookmark icon on any problem to save it\n• Access bookmarked problems from:\n  - Problems tab → Filter\n  - Profile → Statistics\n\n• Use bookmarks to:\n  - Save interesting ideas\n  - Track reference problems\n  - Build inspiration collection\n\nBookmarks are synced across devices!";
    }

    // Categories & tags
    if (lowerQuery.includes('category') || lowerQuery.includes('tag') || lowerQuery.includes('filter')) {
      return "🏷️ Categories & Tags:\n\n• Available Categories:\n  - Healthcare\n  - Education\n  - Finance\n  - Environment\n  - Technology\n  - Social Impact\n  - And more...\n\n• Tags help with:\n  - Search & discovery\n  - Organization\n  - Trending topics\n\nUse filters in Problems tab to browse by category or tags!";
    }

    // Notifications
    if (lowerQuery.includes('notification') || lowerQuery.includes('alert')) {
      return "🔔 Notifications:\n\nYou'll be notified about:\n• Problem status changes\n• Mentor feedback\n• Highlighted problems\n• System updates\n\nManage in Profile → Settings:\n• Enable/disable notifications\n• Email notifications\n• Push notifications\n• Specific event types\n\nCheck notification center for all alerts!";
    }

    // Login/auth issues
    if (lowerQuery.includes('login') || lowerQuery.includes('sign in') || lowerQuery.includes('auth') || lowerQuery.includes('forgot')) {
      return "🔐 Login & Authentication:\n\n• Sign in with:\n  - Email & Password\n  - Google Account\n\n• Forgot password?\n  - Tap 'Forgot Password' on login\n  - Enter your email\n  - Check inbox for reset link\n\n• Can't sign in?\n  - Check email spelling\n  - Verify internet connection\n  - Try different login method\n  - Contact support if issue persists\n\nSupport: support@hackintake.com";
    }

    // Technical issues
    if (lowerQuery.includes('bug') || lowerQuery.includes('error') || lowerQuery.includes('crash') || lowerQuery.includes('not working')) {
      return "🔧 Technical Issues:\n\n1. Try these steps:\n   • Restart the app\n   • Check internet connection\n   • Update to latest version\n   • Clear app cache (Settings)\n\n2. Still having issues?\n   • Screenshot the error\n   • Note when it occurs\n   • Contact support:\n     📧 support@hackintake.com\n     📱 +1 (555) 123-4567\n\nInclude:\n• Device type\n• App version (1.0.0)\n• Description of issue\n\nWe typically respond within 24 hours!";
    }

    // Feature requests
    if (lowerQuery.includes('feature') || lowerQuery.includes('suggest') || lowerQuery.includes('add') || lowerQuery.includes('want')) {
      return "💡 Feature Suggestions:\n\nWe'd love to hear your ideas!\n\n• Submit feedback:\n  - In-app feedback form (coming soon)\n  - Email: feedback@hackintake.com\n  - GitHub issues\n\n• Popular requests:\n  - Live chat\n  - Video attachments\n  - Collaborative editing\n  - Advanced analytics\n\n• Roadmap:\n  Check our website for upcoming features!\n\nYour input helps shape HackIntake!";
    }

    // General help
    return "I'm here to help! 🤝\n\nI can assist with:\n\n• 📝 Submitting problems\n• 👥 Team management\n• 🤖 AI Generator usage\n• ⚙️ Account settings\n• 🔔 Notifications\n• 🏷️ Categories & tags\n• 🔖 Bookmarks\n• 🔐 Login issues\n• 🔧 Technical problems\n\nPlease ask a specific question or tap one of the suggestions below!";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Get AI response
    const response = await getAIResponse(text);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
      suggestions: getSuggestions(text),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);

    // Scroll to bottom after response
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getSuggestions = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('submit') || lowerQuery.includes('problem')) {
      return [
        'How to add attachments?',
        'What categories are available?',
        'Can I edit after submitting?',
      ];
    }

    if (lowerQuery.includes('mentor') || lowerQuery.includes('review')) {
      return [
        'How long does review take?',
        'Can I appeal a rejection?',
        'What makes a problem highlighted?',
      ];
    }

    if (lowerQuery.includes('ai') || lowerQuery.includes('generator')) {
      return [
        'Best topics for AI?',
        'Can I customize AI output?',
        'How accurate is AI?',
      ];
    }

    return [
      'How to use AI Generator?',
      'What is mentor review?',
      'How to manage notifications?',
    ];
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  const renderMessage = (message: Message, index: number) => {
    return (
      <Animated.View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
          { opacity: fadeAnim },
        ]}
      >
        {!message.isUser && (
          <View style={[styles.aiAvatar, { backgroundColor: supportColors.accent }]}>
            <Ionicons name="sparkles" size={18} color="#FFF" />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            message.isUser
              ? { backgroundColor: supportColors.userBubble }
              : { backgroundColor: supportColors.aiBubble },
            message.isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: message.isUser ? '#FFF' : supportColors.textPrimary },
            ]}
          >
            {message.text}
          </Text>

          {!message.isUser && message.suggestions && (
            <View style={styles.suggestionsContainer}>
              {message.suggestions.map((suggestion, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.suggestionButton, { borderColor: supportColors.border }]}
                  onPress={() => sendMessage(suggestion)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.suggestionText, { color: supportColors.primary }]}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {message.isUser && (
          <View style={[styles.userAvatar, { backgroundColor: supportColors.userBubble }]}>
            <Ionicons name="person" size={18} color="#FFF" />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: supportColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <LinearGradient
        colors={theme === 'dark' ? ['#1E293B', '#0F172A'] : ['#0EA5E9', '#0284C7']}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              style={styles.headerIcon}
            >
              <Ionicons name="sparkles" size={24} color="#FFF" />
            </LinearGradient>
            <View style={[styles.onlineIndicator, { backgroundColor: '#10B981' }]} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Support</Text>
            <Text style={styles.headerSubtitle}>Always here to help • Online</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.quickActionsTitle, { color: supportColors.textSecondary }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map(action => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: supportColors.cardBg }]}
                onPress={() => handleQuickAction(action.query)}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: supportColors.primary + '20' }]}>
                  <Ionicons name={action.icon as any} size={24} color={supportColors.primary} />
                </View>
                <Text style={[styles.quickActionTitle, { color: supportColors.textPrimary }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => renderMessage(message, index))}

        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessageContainer]}>
            <View style={[styles.aiAvatar, { backgroundColor: supportColors.accent }]}>
              <Ionicons name="sparkles" size={18} color="#FFF" />
            </View>
            <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: supportColors.aiBubble }]}>
              <View style={styles.typingIndicator}>
                <View style={[styles.typingDot, { backgroundColor: supportColors.textSecondary }]} />
                <View style={[styles.typingDot, { backgroundColor: supportColors.textSecondary }]} />
                <View style={[styles.typingDot, { backgroundColor: supportColors.textSecondary }]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: supportColors.cardBg, borderTopColor: supportColors.border }]}>
        <View style={[styles.inputWrapper, { backgroundColor: supportColors.background }]}>
          <Ionicons name="chatbubble-outline" size={20} color={supportColors.textSecondary} />
          <TextInput
            style={[styles.input, { color: supportColors.textPrimary }]}
            placeholder="Ask me anything..."
            placeholderTextColor={supportColors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            { opacity: inputText.trim() ? 1 : 0.5 },
          ]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isTyping}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme === 'dark' ? ['#3B82F6', '#2563EB'] : ['#0EA5E9', '#0284C7']}
            style={styles.sendButtonGradient}
          >
            {isTyping ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFF" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconContainer: {
    position: 'relative',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  quickActionsContainer: {
    padding: 20,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 20,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  aiBubble: {
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    marginTop: 12,
    gap: 8,
  },
  suggestionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
