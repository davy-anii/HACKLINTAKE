import { create } from 'zustand';
import { ProblemStatement, User, FilterOptions } from '../types';

interface AppState {
  user: User | null;
  problems: ProblemStatement[];
  filteredProblems: ProblemStatement[];
  filters: FilterOptions;
  
  setUser: (user: User | null) => void;
  setProblems: (problems: ProblemStatement[]) => void;
  addProblem: (problem: ProblemStatement) => void;
  updateProblem: (id: string, updates: Partial<ProblemStatement>) => void;
  deleteProblem: (id: string) => void;
  setFilters: (filters: FilterOptions) => void;
  applyFilters: () => void;
  toggleBookmark: (problemId: string, userId: string) => void;
  addComment: (problemId: string, comment: any) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  problems: [],
  filteredProblems: [],
  filters: {},

  setUser: (user) => set({ user }),

  setProblems: (problems) => {
    set({ problems, filteredProblems: problems });
  },

  addProblem: (problem) => {
    const newProblems = [...get().problems, problem];
    set({ problems: newProblems });
    get().applyFilters();
  },

  updateProblem: (id, updates) => {
    const updatedProblems = get().problems.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    );
    set({ problems: updatedProblems });
    get().applyFilters();
  },

  deleteProblem: (id) => {
    const updatedProblems = get().problems.filter((p) => p.id !== id);
    set({ problems: updatedProblems });
    get().applyFilters();
  },

  setFilters: (filters) => {
    set({ filters });
    get().applyFilters();
  },

  applyFilters: () => {
    const { problems, filters } = get();
    let filtered = [...problems];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.difficulty) {
      filtered = filtered.filter((p) => p.difficulty === filters.difficulty);
    }

    if (filters.urgent !== undefined) {
      filtered = filtered.filter((p) => p.urgent === filters.urgent);
    }

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    set({ filteredProblems: filtered });
  },

  toggleBookmark: (problemId, userId) => {
    const updatedProblems = get().problems.map((p) => {
      if (p.id === problemId) {
        const bookmarked = p.bookmarkedBy || [];
        const isBookmarked = bookmarked.includes(userId);
        
        return {
          ...p,
          bookmarkedBy: isBookmarked
            ? bookmarked.filter((id) => id !== userId)
            : [...bookmarked, userId],
        };
      }
      return p;
    });
    
    set({ problems: updatedProblems });
    get().applyFilters();
  },

  addComment: (problemId, comment) => {
    const updatedProblems = get().problems.map((p) => {
      if (p.id === problemId) {
        return {
          ...p,
          comments: [...(p.comments || []), comment],
        };
      }
      return p;
    });
    
    set({ problems: updatedProblems });
    get().applyFilters();
  },
}));
