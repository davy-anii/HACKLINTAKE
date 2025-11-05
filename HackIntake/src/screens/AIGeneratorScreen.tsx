import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { Ionicons } from '@expo/vector-icons';
import { PageAnimation } from '../components/PageAnimation';

interface GeneratedProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  tags: string[];
}

export const AIGeneratorScreen = ({ navigation }: any) => {
  const { colors, theme } = useTheme();
  const { addProblem, user } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProblems, setGeneratedProblems] = useState<GeneratedProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  // Theme-aware colors
  const aiColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    accent: theme === 'dark' ? '#60A5FA' : '#38BDF8',
    success: theme === 'dark' ? '#10B981' : '#10B981',
    purple: theme === 'dark' ? '#8B5CF6' : '#7C3AED',
    pink: theme === 'dark' ? '#EC4899' : '#EC4899',
    textPrimary: theme === 'dark' ? '#000000' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
  };

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const glowAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const generateProblems = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedProblems([]);

    // Simulate AI generation (replace with actual API call)
    setTimeout(() => {
      const mockProblems: GeneratedProblem[] = [
        {
          id: '1',
          title: `${prompt} - Smart Solution`,
          description: `Create an innovative solution for ${prompt}. This problem focuses on developing a comprehensive system that addresses the core challenges in this domain. Consider scalability, user experience, and real-world implementation.`,
          difficulty: 'Medium',
          category: 'AI/ML',
          tags: ['AI', 'Innovation', 'Problem Solving'],
        },
        {
          id: '2',
          title: `${prompt} - Mobile App`,
          description: `Develop a mobile application for ${prompt}. The app should provide an intuitive interface and seamless user experience. Focus on cross-platform compatibility and efficient data management.`,
          difficulty: 'Hard',
          category: 'Mobile Development',
          tags: ['Mobile', 'UX/UI', 'Cross-platform'],
        },
        {
          id: '3',
          title: `${prompt} - Web Platform`,
          description: `Build a web-based platform to solve challenges related to ${prompt}. Implement modern web technologies, responsive design, and ensure accessibility for all users.`,
          difficulty: 'Medium',
          category: 'Web Development',
          tags: ['Web', 'Full-stack', 'Responsive'],
        },
        {
          id: '4',
          title: `${prompt} - Data Analytics`,
          description: `Create a data-driven solution for ${prompt}. Utilize machine learning algorithms, data visualization, and predictive analytics to provide actionable insights.`,
          difficulty: 'Expert',
          category: 'Data Science',
          tags: ['Data', 'Analytics', 'ML'],
        },
      ];

      setGeneratedProblems(mockProblems);
      setIsGenerating(false);
    }, 2000);
  };

  const handleAcceptProblem = (problem: GeneratedProblem) => {
    if (!user) return;

    const newProblem = {
      id: `problem_${Date.now()}`,
      title: problem.title,
      category: problem.category,
      difficulty: problem.difficulty as any,
      description: problem.description,
      constraints: ['Time limit: 48 hours', 'Team size: 2-4 members'],
      requirements: ['Working prototype', 'Presentation', 'Documentation'],
      tags: problem.tags,
      urgent: false,
      status: 'pending' as const,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedMentor: undefined,
      assignedTeam: undefined,
      fileUrls: [],
      imageUrls: [],
    };

    addProblem(newProblem);
    setSelectedProblem(problem.id);

    // Show success animation
    setTimeout(() => {
      navigation.navigate('Problems');
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return aiColors.success;
      case 'Medium':
        return '#F59E0B';
      case 'Hard':
        return '#EF4444';
      case 'Expert':
        return aiColors.purple;
      default:
        return aiColors.accent;
    }
  };

  return (
    <PageAnimation variant="ai">
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: 'transparent' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.title, { color: theme === 'dark' ? '#000000' : aiColors.textPrimary }]}>
                🤖 AI Generator
              </Text>
              <Text style={[styles.subtitle, { color: aiColors.textSecondary }]}>
                Generate problem statements with AI
              </Text>
            </View>
            <Animated.View
              style={[
                styles.aiIcon,
                {
                  backgroundColor: aiColors.purple + '20',
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ]}
            >
              <Ionicons name="sparkles" size={28} color={aiColors.purple} />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Input Section */}
        <Animated.View
          style={[
            styles.inputSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={[styles.label, { color: aiColors.textPrimary }]}>
            What problem do you want to solve?
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: aiColors.cardBg, borderColor: aiColors.border }]}>
            <Ionicons name="bulb" size={20} color={aiColors.accent} />
            <TextInput
              style={[styles.input, { color: aiColors.textPrimary }]}
              placeholder="e.g., Healthcare management, Smart agriculture, Education..."
              placeholderTextColor={aiColors.textSecondary}
              value={prompt}
              onChangeText={setPrompt}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[
              styles.generateButton,
              {
                backgroundColor: prompt.trim() ? aiColors.purple : aiColors.border,
                opacity: prompt.trim() ? 1 : 0.5,
              },
            ]}
            onPress={generateProblems}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#FFF" />
                <Text style={styles.generateButtonText}>Generate Problem Statements</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Loading State */}
        {isGenerating && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={aiColors.purple} />
            <Text style={[styles.loadingText, { color: aiColors.textSecondary }]}>
              AI is generating creative problems...
            </Text>
          </View>
        )}

        {/* Generated Problems */}
        {generatedProblems.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={[styles.resultsTitle, { color: aiColors.textPrimary }]}>
              ✨ Generated Problem Statements
            </Text>

            {generatedProblems.map((problem, index) => {
              const itemFadeAnim = new Animated.Value(0);
              const itemSlideAnim = new Animated.Value(30);

              Animated.parallel([
                Animated.timing(itemFadeAnim, {
                  toValue: 1,
                  duration: 400,
                  delay: index * 150,
                  useNativeDriver: true,
                }),
                Animated.timing(itemSlideAnim, {
                  toValue: 0,
                  duration: 400,
                  delay: index * 150,
                  useNativeDriver: true,
                }),
              ]).start();

              return (
                <Animated.View
                  key={problem.id}
                  style={[
                    styles.problemCard,
                    {
                      backgroundColor: aiColors.cardBg,
                      opacity: itemFadeAnim,
                      transform: [{ translateY: itemSlideAnim }],
                    },
                  ]}
                >
                  <View style={styles.problemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.problemTitle, { color: aiColors.textPrimary }]}>
                        {problem.title}
                      </Text>
                      <View style={styles.problemMeta}>
                        <View
                          style={[
                            styles.difficultyBadge,
                            { backgroundColor: getDifficultyColor(problem.difficulty) + '20' },
                          ]}
                        >
                          <Text style={[styles.difficultyText, { color: getDifficultyColor(problem.difficulty) }]}>
                            {problem.difficulty}
                          </Text>
                        </View>
                        <View style={[styles.categoryBadge, { backgroundColor: aiColors.accent + '20' }]}>
                          <Ionicons name="folder" size={12} color={aiColors.accent} />
                          <Text style={[styles.categoryText, { color: aiColors.accent }]}>
                            {problem.category}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.problemDescription, { color: aiColors.textSecondary }]}>
                    {problem.description}
                  </Text>

                  <View style={styles.tagsContainer}>
                    {problem.tags.map((tag, idx) => (
                      <View
                        key={idx}
                        style={[styles.tag, { backgroundColor: aiColors.primary + '20', borderColor: aiColors.primary }]}
                      >
                        <Text style={[styles.tagText, { color: aiColors.primary }]}>#{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      {
                        backgroundColor:
                          selectedProblem === problem.id ? aiColors.success : aiColors.purple,
                      },
                    ]}
                    onPress={() => handleAcceptProblem(problem)}
                    disabled={selectedProblem !== null}
                  >
                    <Ionicons
                      name={selectedProblem === problem.id ? 'checkmark-circle' : 'add-circle'}
                      size={20}
                      color="#FFF"
                    />
                    <Text style={styles.acceptButtonText}>
                      {selectedProblem === problem.id ? 'Added!' : 'Use This Problem'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* Empty State */}
        {!isGenerating && generatedProblems.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="bulb-outline" size={80} color={aiColors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: aiColors.textPrimary }]}>
              Start Generating Ideas
            </Text>
            <Text style={[styles.emptyText, { color: aiColors.textSecondary }]}>
              Enter a topic and let AI create innovative problem statements for your hackathon
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 24,
  },
  headerContent: {
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
  aiIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
  },
  resultsSection: {
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  problemCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  problemMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  problemDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
