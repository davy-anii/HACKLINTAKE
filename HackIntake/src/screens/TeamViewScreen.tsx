import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { ProblemCard } from '../components/ProblemCard';
import { Ionicons } from '@expo/vector-icons';

export const TeamViewScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { filteredProblems, user, toggleBookmark } = useAppStore();

  const approvedProblems = filteredProblems.filter(
    (p) => p.status === 'approved' || p.status === 'highlighted'
  );

  const bookmarkedProblems = approvedProblems.filter((p) =>
    p.bookmarkedBy?.includes(user?.id || '')
  );

  const [showBookmarked, setShowBookmarked] = React.useState(false);

  const displayProblems = showBookmarked ? bookmarkedProblems : approvedProblems;

  const handleBookmark = (problemId: string) => {
    if (user) {
      toggleBookmark(problemId, user.id);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Browse Problems</Text>
        <TouchableOpacity
          style={[
            styles.bookmarkButton,
            { backgroundColor: showBookmarked ? colors.primary : colors.card },
          ]}
          onPress={() => setShowBookmarked(!showBookmarked)}
        >
          <Ionicons
            name={showBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={showBookmarked ? '#FFF' : colors.primary}
          />
          <Text
            style={[
              styles.bookmarkButtonText,
              { color: showBookmarked ? '#FFF' : colors.primary },
            ]}
          >
            {showBookmarked ? 'Show All' : 'Bookmarked'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Ionicons name="information-circle" size={24} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Browse approved problems and bookmark the ones your team wants to work on!
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {approvedProblems.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Available
          </Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.accent }]}>
            {bookmarkedProblems.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Bookmarked
          </Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.secondary }]}>
            {approvedProblems.filter((p) => p.status === 'highlighted').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Top Rated
          </Text>
        </View>
      </View>

      <FlatList
        data={displayProblems}
        renderItem={({ item }) => (
          <ProblemCard
            problem={item}
            onPress={() => navigation.navigate('ProblemDetail', { problemId: item.id })}
            showActions
            onBookmark={() => handleBookmark(item.id)}
            isBookmarked={item.bookmarkedBy?.includes(user?.id || '')}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={showBookmarked ? 'bookmark-outline' : 'folder-open-outline'}
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {showBookmarked
                ? 'No bookmarked problems yet'
                : 'No approved problems available'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              {showBookmarked
                ? 'Bookmark problems you want to work on'
                : 'Check back later for new problems'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  bookmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  bookmarkButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
