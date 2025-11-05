import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { ProblemCard } from '../components/ProblemCard';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../types';

export const DashboardScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { filteredProblems, filters, setFilters } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (text: string) => {
    setFilters({ ...filters, searchQuery: text });
  };

  const toggleUrgentFilter = () => {
    setFilters({
      ...filters,
      urgent: filters.urgent === true ? undefined : true,
    });
  };

  const setCategory = (category: string) => {
    setFilters({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const setDifficulty = (difficulty: string) => {
    setFilters({
      ...filters,
      difficulty: filters.difficulty === difficulty ? undefined : (difficulty as any),
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Problem Statements</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('SubmitProblem')}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search problems..."
            placeholderTextColor={colors.textSecondary}
            value={filters.searchQuery || ''}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {showFilters && (
        <View style={[styles.filterPanel, { backgroundColor: colors.card }]}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                {
                  backgroundColor: filters.urgent ? colors.error : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={toggleUrgentFilter}
            >
              <Ionicons
                name="warning"
                size={16}
                color={filters.urgent ? '#FFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterChipText,
                  { color: filters.urgent ? '#FFF' : colors.text },
                ]}
              >
                Urgent Only
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.clearButton,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              onPress={clearFilters}
            >
              <Text style={[styles.clearButtonText, { color: colors.text }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Category</Text>
            <View style={styles.filterChips}>
              {CATEGORIES.slice(0, 5).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filters.category === cat ? colors.primary : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: filters.category === cat ? '#FFF' : colors.text },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Difficulty</Text>
            <View style={styles.filterChips}>
              {DIFFICULTY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filters.difficulty === level ? colors.secondary : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: filters.difficulty === level ? '#FFF' : colors.text },
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>
          Showing {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredProblems}
        renderItem={({ item }) => (
          <ProblemCard
            problem={item}
            onPress={() => navigation.navigate('ProblemDetail', { problemId: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No problems found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Be the first to submit a problem statement!
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterPanel: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
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
