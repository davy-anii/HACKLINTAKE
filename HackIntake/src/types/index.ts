export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type ProblemStatus = 'pending' | 'approved' | 'rejected' | 'highlighted';
export type UserRole = 'mentor' | 'organizer' | 'participant';
export type SubmissionStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
export type ParticipantStatus = 'registered' | 'verified' | 'selected' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  // Additional fields for roles
  organization?: string; // For organizers
  expertise?: string[]; // For mentors
  skills?: string[]; // For participants
  bio?: string;
  registeredAt?: Date;
  qrCode?: string; // QR code data for participants
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

// Submission represents a participant's project submission for a problem
export interface Submission {
  id: string;
  problemId: string;
  participantId: string;
  participantName: string;
  title: string;
  description: string;
  repositoryUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  fileUrls?: string[];
  status: SubmissionStatus;
  assignedMentorId?: string;
  assignedMentorName?: string;
  mentorFeedback?: string;
  mentorApprovedAt?: Date;
  organizerFeedback?: string;
  organizerApprovedAt?: Date;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Approval tracks the approval workflow from mentor to organizer
export interface Approval {
  id: string;
  submissionId: string;
  problemId: string;
  participantId: string;
  participantName: string;
  mentorId: string;
  mentorName: string;
  mentorFeedback: string;
  mentorApprovedAt: Date;
  organizerStatus: 'pending' | 'approved' | 'rejected';
  organizerFeedback?: string;
  organizerApprovedAt?: Date;
  organizerId?: string;
  finalScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ParticipantRegistration tracks participant registration for hackathon
export interface ParticipantRegistration {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  teamName?: string;
  teamMembers?: string[];
  skills: string[];
  experience?: string;
  status: ParticipantStatus;
  qrCode: string; // Unique QR code for verification
  verifiedBy?: string; // Organizer who verified
  verifiedAt?: Date;
  selectedProblems?: string[]; // Problem IDs participant is interested in
  registeredAt: Date;
  updatedAt: Date;
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
