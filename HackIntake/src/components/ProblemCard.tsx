import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { ProblemStatement } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface ProblemCardProps {
  problem: ProblemStatement;
  onPress: () => void;
  showActions?: boolean;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onPress,
  showActions = false,
  onBookmark,
  isBookmarked = false,
}) => {
  const { colors } = useTheme();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.error;
      case 'highlighted':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {problem.title}
          </Text>
          {showActions && onBookmark && (
            <TouchableOpacity onPress={onBookmark} style={styles.bookmarkButton}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
        
        {problem.urgent && (
          <View style={[styles.urgentBadge, { backgroundColor: colors.error }]}>
            <Ionicons name="warning" size={14} color="#FFF" />
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        )}
      </View>

      <Text
        style={[styles.description, { color: colors.textSecondary }]}
        numberOfLines={3}
      >
        {problem.description}
      </Text>

      <View style={styles.metaContainer}>
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

          <View
            style={[
              styles.badge,
              { backgroundColor: getStatusColor(problem.status) + '20' },
            ]}
          >
            <Text
              style={[styles.badgeText, { color: getStatusColor(problem.status) }]}
            >
              {problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {problem.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {problem.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: colors.background }]}
            >
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                #{tag}
              </Text>
            </View>
          ))}
          {problem.tags.length > 3 && (
            <Text style={[styles.moreText, { color: colors.textSecondary }]}>
              +{problem.tags.length - 3} more
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  urgentText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
  },
  moreText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});
