import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

export const ProblemDetailScreen = ({ route, navigation }: any) => {
  const { problemId } = route.params;
  const { colors } = useTheme();
  const { problems, user, addComment, toggleBookmark } = useAppStore();
  
  const problem = problems.find((p) => p.id === problemId);
  const [commentText, setCommentText] = useState('');

  if (!problem) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Problem not found
        </Text>
      </View>
    );
  }

  const isBookmarked = problem.bookmarkedBy?.includes(user?.id || '');

  const handleAddComment = () => {
    if (!user) {
      Alert.alert('Error', 'Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      text: commentText,
      createdAt: new Date(),
    };

    addComment(problemId, newComment);
    setCommentText('');
    Alert.alert('Success', 'Comment added successfully!');
  };

  const handleBookmark = () => {
    if (user) {
      toggleBookmark(problemId, user.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return colors.success;
      case 'Medium':
        return colors.warning;
      case 'Hard':
        return colors.error;
      case 'Expert':
        return '#9333EA';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Problem Details
        </Text>
        <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {problem.urgent && (
            <View style={[styles.urgentBadge, { backgroundColor: colors.error }]}>
              <Ionicons name="warning" size={16} color="#FFF" />
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}

          <Text style={[styles.title, { color: colors.text }]}>{problem.title}</Text>

          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {problem.category}
              </Text>
            </View>
            
            <View
              style={[
                styles.badge,
                { backgroundColor: getDifficultyColor(problem.difficulty) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: getDifficultyColor(problem.difficulty) },
                ]}
              >
                {problem.difficulty}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {problem.description}
            </Text>
          </View>

          {problem.constraints.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Constraints
              </Text>
              {problem.constraints.map((constraint, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  <Text style={[styles.listText, { color: colors.textSecondary }]}>
                    {constraint}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {problem.requirements.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Requirements
              </Text>
              {problem.requirements.map((requirement, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="alert-circle" size={20} color={colors.warning} />
                  <Text style={[styles.listText, { color: colors.textSecondary }]}>
                    {requirement}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {problem.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
              <View style={styles.tagsContainer}>
                {problem.tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[styles.tag, { backgroundColor: colors.primary + '20' }]}
                  >
                    <Text style={[styles.tagText, { color: colors.primary }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {problem.aiScore && (
            <View style={[styles.aiCard, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="sparkles" size={20} color={colors.accent} />
              <View style={styles.aiContent}>
                <Text style={[styles.aiTitle, { color: colors.text }]}>
                  AI Quality Score
                </Text>
                <Text style={[styles.aiScore, { color: colors.accent }]}>
                  {problem.aiScore}/100
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Comments & Feedback
          </Text>

          {problem.comments && problem.comments.length > 0 ? (
            problem.comments.map((comment) => (
              <View
                key={comment.id}
                style={[styles.comment, { backgroundColor: colors.background }]}
              >
                <View style={styles.commentHeader}>
                  <Text style={[styles.commentAuthor, { color: colors.text }]}>
                    {comment.userName}
                  </Text>
                  <Text style={[styles.commentDate, { color: colors.textSecondary }]}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.commentText, { color: colors.textSecondary }]}>
                  {comment.text}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noComments, { color: colors.textSecondary }]}>
              No comments yet. Be the first to comment!
            </Text>
          )}

          <View style={styles.commentInputContainer}>
            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Add your feedback..."
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <Button
              title="Post"
              size="sm"
              onPress={handleAddComment}
              disabled={!commentText.trim()}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  bookmarkButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  urgentText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  aiScore: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  comment: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noComments: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  commentInputContainer: {
    marginTop: 16,
    gap: 12,
  },
  commentInput: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});
