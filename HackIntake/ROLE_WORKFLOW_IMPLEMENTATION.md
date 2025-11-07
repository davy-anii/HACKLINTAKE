# 🎯 HackIntake Role-Based Workflow Implementation

## ✅ What's Been Implemented

### 1. **Firebase Integration & Database Structure**

#### New Firestore Collections:
- **`users`** - Stores user profiles with role information
- **`problems`** - Problem statements
- **`submissions`** - Participant project submissions
- **`approvals`** - Mentor approval workflow
- **`registrations`** - Participant registrations with QR codes

#### Firebase Service (`src/firebase/firebaseService.ts`):
- **User Management**: `saveUser()`, `getUser()`, `updateUser()`
- **Submissions**: `createSubmission()`, `getSubmissionsByParticipant()`, `getSubmissionsByMentor()`
- **Approval Workflow**: `createApproval()`, `updateApprovalByOrganizer()`, `getApprovalsByOrganizer()`
- **Participant Registration**: `registerParticipant()`, `verifyParticipant()`, `getAllParticipants()`
- **Real-time Listeners**: `subscribeToSubmissions()`, `subscribeToApprovals()`, `subscribeToParticipants()`

### 2. **Extended TypeScript Types** (`src/types/index.ts`)

#### New Types:
```typescript
export type SubmissionStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
export type ParticipantStatus = 'registered' | 'verified' | 'selected' | 'rejected';

interface Submission {
  id, problemId, participantId, title, description
  repositoryUrl, demoUrl, videoUrl, fileUrls
  status, assignedMentorId, mentorFeedback, score
  mentorApprovedAt, organizerFeedback, organizerApprovedAt
}

interface Approval {
  id, submissionId, problemId, participantId
  mentorId, mentorName, mentorFeedback, mentorApprovedAt
  organizerStatus, organizerFeedback, organizerId, finalScore
}

interface ParticipantRegistration {
  id, userId, userName, email, phone
  teamName, teamMembers, skills, experience
  status, qrCode, verifiedBy, verifiedAt
  selectedProblems, registeredAt
}
```

#### Extended User Type:
```typescript
interface User {
  id, name, email, role, photoURL
  organization, expertise, skills, bio
  registeredAt, qrCode
}
```

### 3. **QR Code System**

#### QR Code Generator (`src/components/QRCodeGenerator.tsx`):
- Displays QR code with custom styling
- Supports both light and dark themes
- Shows participant info (name, email)
- Displays unique code identifier

#### QR Scanner (`src/components/QRScanner.tsx`):
- Camera-based QR code scanning
- Permission handling
- Scan area with corner guides
- Rescan functionality
- Theme-aware UI

### 4. **New Screens**

#### Organizer Dashboard (`src/screens/OrganizerDashboardScreen.tsx`):
**Features:**
- 📊 **Statistics Dashboard**: Pending approvals, verified participants, selected participants
- 📋 **Approvals Tab**: 
  - View mentor-approved submissions
  - Approve/reject with feedback
  - Final scoring system
  - Real-time updates
- 👥 **Participants Tab**:
  - List all registered participants
  - View registration details (team, skills)
  - Select/reject participants
  - Status tracking (registered → verified → selected)
- 📷 **QR Scanner**: Built-in scanner to verify participants on-site
- 🔄 **Real-time Sync**: Auto-updates when data changes

#### Participant QR Screen (`src/screens/ParticipantQRScreen.tsx`):
**Features:**
- 🎫 **Personal QR Code**: Unique identifier for verification
- 📱 **Share Functionality**: Share QR code via social media/messaging
- 📊 **Status Display**:
  - Registered (⏳ waiting for verification)
  - Verified (✅ approved by organizer)
  - Selected (🎉 chosen for hackathon)
  - Rejected (❌ not accepted)
- 📝 **Registration Details**: Name, email, team, skills, verification date
- 📖 **Instructions**: Step-by-step guide for participants

### 5. **Updated Navigation** (`src/navigation/AppNavigator.tsx`)

#### Role-Based Tab Bar:
- **All Users**: Home, Problems, AI Generator, Profile
- **Participants**: Additional "My QR" tab for QR code access
- **Mentors**: Additional "Mentor" tab for reviewing submissions
- **Organizers**: "Organizer" tab (replaces Mentor) with full dashboard

#### MentorStack Routing:
```typescript
- Organizers → OrganizerDashboardScreen
- Mentors → MentorPanelScreen
```

### 6. **Updated Role Selection** (`src/screens/RoleSelectionScreen.tsx`)
- Saves selected role to Firebase on registration
- Persists role in Firestore `users` collection
- Role determines app navigation and features

### 7. **App Configuration** (`app.json`)
- ✅ Added camera permissions for Android
- ✅ Added `expo-camera` plugin for QR scanning
- ✅ Camera permission message for users

---

## 🔄 The Complete Workflow

### **Participant Journey:**
1. **Register** → User selects "Participant" role during signup
2. **Auto-Registration** → Automatically registered with unique QR code
3. **Access QR** → View QR code in "My QR" tab
4. **Verification** → Show QR to organizer for scanning
5. **Status Updates** → Check status: registered → verified → selected
6. **Browse Problems** → View available problem statements
7. **Submit Projects** → (To be implemented) Submit solutions with code/demo links

### **Mentor Journey:**
1. **Register** → Select "Mentor" role
2. **Review Submissions** → View assigned participant submissions
3. **Approve/Reject** → Provide feedback and approve quality submissions
4. **Track Progress** → See approval history and participant progress
5. **Forward to Organizer** → Approved submissions go to organizer for final review

### **Organizer Journey:**
1. **Register** → Select "Organizer" role
2. **Manage Participants**:
   - View all registrations
   - Scan QR codes on-site
   - Verify attendance
   - Select/reject participants
3. **Review Approvals**:
   - See mentor-approved submissions
   - Final approve/reject with scoring
   - Add organizer feedback
4. **Analytics** → View statistics dashboard
5. **Full Control** → Manage entire hackathon

---

## 📊 Data Flow

```
PARTICIPANT                    MENTOR                     ORGANIZER
    │                            │                            │
    ├─► Register                 │                            │
    ├─► Get QR Code              │                            │
    │                            │                            │
    ├─► Submit Project ──────────┤                            │
    │                            │                            │
    │                            ├─► Review Submission        │
    │                            ├─► Approve/Reject           │
    │                            ├─► Add Feedback             │
    │                            │                            │
    │   (If Approved)            └────────► Creates Approval ─┤
    │                                                         │
    │                                                         ├─► Review
    │                                                         ├─► Final Approve
    │                                                         ├─► Score
    │                                                         │
    │                                                         ├─► Scan QR
    │                                                         ├─► Verify
    │   ◄─────────────────────── Status Updates ─────────────┤
    │                                                         │
    └─► Check Status             └─► Track Submissions       └─► Analytics
```

---

## 📦 Installed Dependencies

```bash
npm install react-native-qrcode-svg expo-camera expo-barcode-scanner react-native-svg
```

- **`react-native-qrcode-svg`** - QR code generation
- **`expo-camera`** - Camera access for scanning
- **`expo-barcode-scanner`** - QR/barcode scanning
- **`react-native-svg`** - SVG support for QR codes

---

## 🎨 UI/UX Features

### Theme Support:
- ✅ Full light/dark mode support across all new screens
- ✅ Role-specific color schemes:
  - Organizer: Purple gradient
  - Mentor: Blue gradient
  - Participant: Cyan gradient

### Responsive Design:
- ✅ ScrollViews for long content
- ✅ Pull-to-refresh on all list screens
- ✅ Loading states
- ✅ Empty states with helpful messages

### Real-time Updates:
- ✅ Firebase listeners for live data sync
- ✅ Auto-refresh when data changes
- ✅ No manual refresh needed

---

## 🚀 Next Steps (To Complete the System)

### Priority 1: Update Existing Screens
1. **DashboardScreen** (`src/screens/DashboardScreen.tsx`):
   - Add "Submit" button to problem cards
   - Show submission status badges
   - Display assigned mentor info

2. **MentorPanelScreen** (`src/screens/MentorPanelScreen.tsx`):
   - List assigned submissions
   - Add approve/reject buttons
   - Feedback form
   - Create approval records

### Priority 2: Create Submission Flow
3. **SubmitProblemScreen** enhancement:
   - Add repository URL field
   - Add demo URL field
   - Add video URL field
   - Save submission to Firebase
   - Assign to mentor automatically

### Priority 3: Real-time Features
4. **Add to appStore.ts**:
   - Subscribe to submissions on login
   - Subscribe to approvals
   - Auto-update UI when data changes

### Priority 4: Testing
5. **End-to-end Test**:
   - Register 3 users (participant, mentor, organizer)
   - Participant submits problem
   - Mentor approves
   - Organizer final approval
   - Scan QR code

---

## 🔧 How to Test

### 1. Start the App:
```bash
cd HackIntake
npx expo start --tunnel
```

### 2. Test Participant Flow:
1. Sign up with role "Participant"
2. Go to "My QR" tab
3. View your QR code
4. Check status (should be "registered")

### 3. Test Organizer Flow:
1. Sign up with role "Organizer"
2. Go to "Organizer" tab
3. View participants list
4. Tap "Scan QR Code" button
5. Test QR scanner (or manually verify)

### 4. Test Real-time Sync:
1. Open app on two devices
2. One as participant, one as organizer
3. Organizer verifies participant
4. Participant sees status change in real-time

---

## 📝 Firebase Rules (Important!)

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Problems collection
    match /problems/{problemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Submissions collection
    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Approvals collection
    match /approvals/{approvalId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'organizer' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'mentor');
    }
    
    // Registrations collection
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'organizer';
    }
  }
}
```

---

## 🎉 Summary

### What Works Now:
✅ User registration with roles saved to Firebase
✅ QR code generation for participants
✅ QR scanner for organizers
✅ Participant management dashboard
✅ Approval workflow structure
✅ Real-time Firebase listeners
✅ Role-based navigation
✅ Theme support across all screens
✅ Camera permissions configured

### What Needs Completion:
⏳ Submission creation from participant dashboard
⏳ Mentor approval UI in MentorPanelScreen
⏳ Submission list in participant dashboard
⏳ Store integration for real-time updates
⏳ End-to-end workflow testing

The foundation is complete! All the infrastructure for connecting participants, mentors, and organizers is in place. The remaining work is mainly updating existing screens to use the new Firebase services.
