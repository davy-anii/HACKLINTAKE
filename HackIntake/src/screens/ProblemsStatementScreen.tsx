import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { ProblemCard } from '../components/ProblemCard';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../types';

export const ProblemsStatementScreen = ({ navigation }: any) => {
  const { colors, theme } = useTheme();
  const { filteredProblems, filters, setFilters } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  // Theme-aware colors
  const professionalColors = {
    background: theme === 'dark' ? '#0A0E27' : '#E0F2FE',
    cardBg: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    primary: theme === 'dark' ? '#2563EB' : '#0EA5E9',
    accent: theme === 'dark' ? '#60A5FA' : '#38BDF8',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#0C4A6E',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#0369A1',
    border: theme === 'dark' ? '#334155' : '#BAE6FD',
  };

  const handleSearch = (text: string) => {
    setFilters({ searchQuery: text });
  };

  const toggleUrgentFilter = () => {
    setFilters({ urgent: !filters.urgent });
  };

  const setCategory = (category: string) => {
    setFilters({ category: filters.category === category ? undefined : category });
  };

  const setDifficulty = (difficulty: any) => {
    setFilters({ difficulty: filters.difficulty === difficulty ? undefined : difficulty });
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      category: undefined,
      difficulty: undefined,
      urgent: false,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: professionalColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: professionalColors.textPrimary }]}>
            Problem Statements
          </Text>
          <Text style={[styles.subtitle, { color: professionalColors.textSecondary }]}>
            Browse all hackathon problems
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: professionalColors.primary }]}
          onPress={() => navigation.navigate('SubmitProblem')}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: professionalColors.cardBg, borderColor: professionalColors.border }]}>
          <Ionicons name="search" size={20} color={professionalColors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: professionalColors.textPrimary }]}
            placeholder="Search problems..."
            placeholderTextColor={professionalColors.textSecondary}
            value={filters.searchQuery || ''}
            onChangeText={handleSearch}
          />
        </View>

        {/* Filter Toggle */}
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: professionalColors.cardBg }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options" size={20} color={professionalColors.accent} />
          <Text style={[styles.filterButtonText, { color: professionalColors.textPrimary }]}>
            Filters
          </Text>
          <Ionicons
            name={showFilters ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={professionalColors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {showFilters && (
        <View style={[styles.filterPanel, { backgroundColor: professionalColors.cardBg }]}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                {
                  backgroundColor: filters.urgent ? '#EF4444' : 'transparent',
                  borderColor: professionalColors.border,
                },
              ]}
              onPress={toggleUrgentFilter}
            >
              <Ionicons
                name="warning"
                size={16}
                color={filters.urgent ? '#FFF' : professionalColors.textSecondary}
              />
              <Text
                style={[
                  styles.filterChipText,
                  { color: filters.urgent ? '#FFF' : professionalColors.textPrimary },
                ]}
              >
                Urgent Only
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.clearButton,
                { backgroundColor: 'transparent', borderColor: professionalColors.border },
              ]}
              onPress={clearFilters}
            >
              <Text style={[styles.clearButtonText, { color: professionalColors.accent }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: professionalColors.textPrimary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: filters.category === cat ? professionalColors.primary : 'transparent',
                        borderColor: professionalColors.border,
                      },
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: filters.category === cat ? '#FFF' : professionalColors.textPrimary },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: professionalColors.textPrimary }]}>Difficulty</Text>
            <View style={styles.filterChips}>
              {DIFFICULTY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filters.difficulty === level ? professionalColors.accent : 'transparent',
                      borderColor: professionalColors.border,
                    },
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: filters.difficulty === level ? '#FFF' : professionalColors.textPrimary },
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

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={[styles.resultsText, { color: professionalColors.textSecondary }]}>
          {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Problems List */}
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
            <Ionicons name="folder-open-outline" size={64} color={professionalColors.textSecondary} />
            <Text style={[styles.emptyText, { color: professionalColors.textPrimary }]}>
              No problems found
            </Text>
            <Text style={[styles.emptySubtext, { color: professionalColors.textSecondary }]}>
              Try adjusting your filters or submit a new problem!
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
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
    gap: 12,
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  resultsCount: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
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
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
