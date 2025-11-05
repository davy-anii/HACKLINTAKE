import { create } from 'zustand';
import { ProblemStatement, User, FilterOptions } from '../types';
import { UserStorage, SecureStorage, AutoLogin } from '../utils/secureStorage';

interface AppState {
  user: User | null;
  problems: ProblemStatement[];
  filteredProblems: ProblemStatement[];
  filters: FilterOptions;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  loginUser: (user: User, email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loadUserFromStorage: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
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
  isLoading: false,

  setUser: (user) => set({ user }),

  // Login user and save to secure storage
  loginUser: async (user, email, password) => {
    try {
      set({ isLoading: true });
      await AutoLogin.saveSession(user, email, password);
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Error logging in user:', error);
      set({ isLoading: false });
    }
  },

  // Logout user and clear all data
  logoutUser: async () => {
    try {
      set({ isLoading: true });
      await AutoLogin.clearSession();
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Error logging out user:', error);
      set({ isLoading: false });
    }
  },

  // Load user from storage on app start
  loadUserFromStorage: async () => {
    try {
      set({ isLoading: true });
      const user = await AutoLogin.attemptAutoLogin();
      if (user) {
        const profileImage = await UserStorage.getProfileImage();
        if (profileImage) {
          user.photoURL = profileImage;
        }
        set({ user });
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Error loading user from storage:', error);
      set({ isLoading: false });
    }
  },

  // Update user profile and save to storage
  updateUserProfile: async (updates) => {
    try {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        await UserStorage.updateUser(updates);
        
        // Save profile image separately if updated
        if (updates.photoURL) {
          await UserStorage.saveProfileImage(updates.photoURL);
        }
        
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  },

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
