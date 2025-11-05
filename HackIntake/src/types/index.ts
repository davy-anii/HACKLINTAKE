export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type ProblemStatus = 'pending' | 'approved' | 'rejected' | 'highlighted';
export type UserRole = 'organizer' | 'mentor' | 'team' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
}

export interface ProblemStatement {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  description: string;
  constraints: string[];
  requirements: string[];
  tags: string[];
  urgent: boolean;
  status: ProblemStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  fileUrls?: string[];
  imageUrls?: string[];
  assignedMentor?: string;
  assignedTeam?: string;
  comments?: Comment[];
  aiScore?: number;
  bookmarkedBy?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface FilterOptions {
  category?: string;
  difficulty?: DifficultyLevel;
  urgent?: boolean;
  status?: ProblemStatus;
  searchQuery?: string;
}

export const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'AI/ML',
  'Blockchain',
  'IoT',
  'Cybersecurity',
  'Data Science',
  'Cloud Computing',
  'AR/VR',
  'DevOps',
  'Other',
];

export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['Easy', 'Medium', 'Hard', 'Expert'];
