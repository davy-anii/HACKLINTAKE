import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './init';
import {
  User,
  Submission,
  Approval,
  ParticipantRegistration,
  ProblemStatement,
  ParticipantStatus,
} from '../types';

// Collections
const USERS_COLLECTION = 'users';
const PROBLEMS_COLLECTION = 'problems';
const SUBMISSIONS_COLLECTION = 'submissions';
const APPROVALS_COLLECTION = 'approvals';
const REGISTRATIONS_COLLECTION = 'registrations';

// ==================== USER MANAGEMENT ====================

export const saveUser = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, {
      ...userData,
      registeredAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving user:', error);
    return { success: false, error };
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error };
  }
};

// ==================== PROBLEM MANAGEMENT ====================

export const saveProblem = async (problem: ProblemStatement) => {
  try {
    const problemRef = doc(db, PROBLEMS_COLLECTION, problem.id);
    await setDoc(problemRef, {
      ...problem,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving problem:', error);
    return { success: false, error };
  }
};

export const getProblems = async (): Promise<ProblemStatement[]> => {
  try {
    const problemsRef = collection(db, PROBLEMS_COLLECTION);
    const querySnapshot = await getDocs(problemsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProblemStatement));
  } catch (error) {
    console.error('Error getting problems:', error);
    return [];
  }
};

export const updateProblem = async (problemId: string, updates: Partial<ProblemStatement>) => {
  try {
    const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
    await updateDoc(problemRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating problem:', error);
    return { success: false, error };
  }
};

// ==================== SUBMISSION MANAGEMENT ====================

export const createSubmission = async (submission: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
    const docRef = await addDoc(submissionsRef, {
      ...submission,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating submission:', error);
    return { success: false, error };
  }
};

export const updateSubmission = async (submissionId: string, updates: Partial<Submission>) => {
  try {
    const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
    await updateDoc(submissionRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating submission:', error);
    return { success: false, error };
  }
};

export const getSubmissionsByParticipant = async (participantId: string): Promise<Submission[]> => {
  try {
    const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
    const q = query(submissionsRef, where('participantId', '==', participantId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
  } catch (error) {
    console.error('Error getting submissions by participant:', error);
    return [];
  }
};

export const getSubmissionsByMentor = async (mentorId: string): Promise<Submission[]> => {
  try {
    const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
    const q = query(
      submissionsRef,
      where('assignedMentorId', '==', mentorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
  } catch (error) {
    console.error('Error getting submissions by mentor:', error);
    return [];
  }
};

export const getSubmissionsByProblem = async (problemId: string): Promise<Submission[]> => {
  try {
    const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
    const q = query(submissionsRef, where('problemId', '==', problemId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
  } catch (error) {
    console.error('Error getting submissions by problem:', error);
    return [];
  }
};

// ==================== APPROVAL WORKFLOW ====================

export const createApproval = async (approval: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const approvalsRef = collection(db, APPROVALS_COLLECTION);
    const docRef = await addDoc(approvalsRef, {
      ...approval,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Update submission status
    await updateSubmission(approval.submissionId, {
      status: 'under-review',
      assignedMentorId: approval.mentorId,
      assignedMentorName: approval.mentorName,
      mentorFeedback: approval.mentorFeedback,
      mentorApprovedAt: approval.mentorApprovedAt,
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating approval:', error);
    return { success: false, error };
  }
};

export const updateApprovalByOrganizer = async (
  approvalId: string,
  organizerStatus: 'approved' | 'rejected',
  organizerFeedback: string,
  organizerId: string,
  finalScore?: number
) => {
  try {
    const approvalRef = doc(db, APPROVALS_COLLECTION, approvalId);
    await updateDoc(approvalRef, {
      organizerStatus,
      organizerFeedback,
      organizerId,
      finalScore,
      organizerApprovedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Get the approval to update the submission
    const approvalSnap = await getDoc(approvalRef);
    if (approvalSnap.exists()) {
      const approvalData = approvalSnap.data() as Approval;
      await updateSubmission(approvalData.submissionId, {
        status: organizerStatus === 'approved' ? 'approved' : 'rejected',
        organizerFeedback,
        score: finalScore,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating approval by organizer:', error);
    return { success: false, error };
  }
};

export const getApprovalsByOrganizer = async (): Promise<Approval[]> => {
  try {
    const approvalsRef = collection(db, APPROVALS_COLLECTION);
    const q = query(approvalsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Approval));
  } catch (error) {
    console.error('Error getting approvals for organizer:', error);
    return [];
  }
};

export const getPendingApprovals = async (): Promise<Approval[]> => {
  try {
    const approvalsRef = collection(db, APPROVALS_COLLECTION);
    const q = query(
      approvalsRef,
      where('organizerStatus', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Approval));
  } catch (error) {
    console.error('Error getting pending approvals:', error);
    return [];
  }
};

// ==================== PARTICIPANT REGISTRATION ====================

export const registerParticipant = async (
  registration: Omit<ParticipantRegistration, 'id' | 'qrCode' | 'registeredAt' | 'updatedAt'>
) => {
  try {
    // Generate unique QR code data
    const qrCode = `HACKINTAKE-${registration.userId}-${Date.now()}`;
    
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const docRef = await addDoc(registrationsRef, {
      ...registration,
      qrCode,
      status: 'registered',
      registeredAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Update user with QR code
    await updateUser(registration.userId, { qrCode });
    
    return { success: true, id: docRef.id, qrCode };
  } catch (error) {
    console.error('Error registering participant:', error);
    return { success: false, error };
  }
};

export const verifyParticipant = async (qrCode: string, verifiedBy: string) => {
  try {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, where('qrCode', '==', qrCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Participant not found' };
    }
    
    const registrationDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, REGISTRATIONS_COLLECTION, registrationDoc.id), {
      status: 'verified',
      verifiedBy,
      verifiedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { success: true, registration: { id: registrationDoc.id, ...registrationDoc.data() } };
  } catch (error) {
    console.error('Error verifying participant:', error);
    return { success: false, error };
  }
};

export const updateParticipantStatus = async (
  registrationId: string,
  status: ParticipantStatus,
  verifiedBy?: string
) => {
  try {
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    await updateDoc(registrationRef, {
      status,
      ...(verifiedBy && { verifiedBy, verifiedAt: serverTimestamp() }),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating participant status:', error);
    return { success: false, error };
  }
};

export const getParticipantRegistration = async (userId: string): Promise<ParticipantRegistration | null> => {
  try {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as ParticipantRegistration;
  } catch (error) {
    console.error('Error getting participant registration:', error);
    return null;
  }
};

export const getAllParticipants = async (): Promise<ParticipantRegistration[]> => {
  try {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, orderBy('registeredAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParticipantRegistration));
  } catch (error) {
    console.error('Error getting all participants:', error);
    return [];
  }
};

// ==================== REAL-TIME LISTENERS ====================

export const subscribeToSubmissions = (
  participantId: string,
  callback: (submissions: Submission[]) => void
) => {
  const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
  const q = query(submissionsRef, where('participantId', '==', participantId), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
    callback(submissions);
  });
};

export const subscribeToMentorSubmissions = (
  mentorId: string,
  callback: (submissions: Submission[]) => void
) => {
  const submissionsRef = collection(db, SUBMISSIONS_COLLECTION);
  const q = query(submissionsRef, where('assignedMentorId', '==', mentorId), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
    callback(submissions);
  });
};

export const subscribeToApprovals = (callback: (approvals: Approval[]) => void) => {
  const approvalsRef = collection(db, APPROVALS_COLLECTION);
  const q = query(approvalsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const approvals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Approval));
    callback(approvals);
  });
};

export const subscribeToParticipants = (callback: (participants: ParticipantRegistration[]) => void) => {
  const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
  const q = query(registrationsRef, orderBy('registeredAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const participants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParticipantRegistration));
    callback(participants);
  });
};
