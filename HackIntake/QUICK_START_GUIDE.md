# 🚀 Quick Start Guide - Role-Based Hackathon System

## 📱 How to Use the New Features

### **For Participants:**

1. **Sign Up & Get Your QR Code**
   - Sign up → Select "💻 Participant" role
   - Navigate to "My QR" tab (bottom navigation)
   - Your unique QR code will be displayed
   - Share it with organizers for verification

2. **Check Your Status**
   - Status badge shows: Registered → Verified → Selected
   - Green (Selected) = You're in! 🎉
   - Blue (Verified) = Organizer verified you ✅
   - Orange (Registered) = Waiting for verification ⏳

3. **Browse & Submit Problems**
   - Go to "Problems" tab
   - Browse available problem statements
   - (Coming soon) Submit your solutions

---

### **For Mentors:**

1. **Sign Up as Mentor**
   - Sign up → Select "👨‍🏫 Mentor" role
   - Access "Mentor" tab in navigation

2. **Review Submissions** (Coming Soon)
   - View participant submissions assigned to you
   - Read problem solutions
   - Approve or reject with feedback
   - Approved submissions go to organizer

3. **Provide Guidance**
   - Add constructive feedback
   - Help participants improve
   - Track submission progress

---

### **For Organizers:**

1. **Sign Up as Organizer**
   - Sign up → Select "🎯 Organizer" role
   - Access "Organizer" tab (replaces Mentor tab)

2. **Manage Participants**
   - **Participants Tab**:
     - View all registered participants
     - See team info, skills, contact details
     - Tap "📷 Scan QR Code" to verify on-site
     - Select or reject participants

3. **Review Approvals**
   - **Approvals Tab**:
     - See all mentor-approved submissions
     - Final approve/reject decision
     - Add feedback and scores
     - Track approval status

4. **Monitor Statistics**
   - View pending approvals count
   - Track verified participants
   - See selected participants
   - Real-time dashboard updates

---

## 🎯 Complete Workflow Example

### Scenario: Participant "John" submits a project

1. **John (Participant)**
   ```
   1. Registers → Gets QR code
   2. Shows QR to organizer at venue
   3. Gets verified
   4. Submits solution for "AI Chatbot" problem
   5. Waits for mentor review
   ```

2. **Sarah (Mentor)**
   ```
   1. Sees John's submission in Mentor panel
   2. Reviews code repository and demo
   3. Adds feedback: "Great implementation!"
   4. Approves submission
   5. Submission forwarded to organizer
   ```

3. **Mike (Organizer)**
   ```
   1. Sees Sarah's approval in Approvals tab
   2. Reviews submission and mentor feedback
   3. Adds final score: 95/100
   4. Approves for final presentation
   5. John gets notification
   ```

4. **John sees update**
   ```
   Status: Under Review → Approved ✅
   Score: 95/100
   Feedback from Mentor & Organizer visible
   ```

---

## 📊 Database Collections

### Firebase Firestore Structure:
```
hackintake-6c89f/
├── users/
│   └── {userId}/
│       ├── id, name, email, role
│       ├── photoURL, qrCode
│       └── registeredAt
│
├── problems/
│   └── {problemId}/
│       ├── title, description, difficulty
│       ├── category, tags, status
│       └── createdBy, createdAt
│
├── submissions/
│   └── {submissionId}/
│       ├── problemId, participantId
│       ├── title, description, repositoryUrl
│       ├── status, assignedMentorId
│       ├── mentorFeedback, score
│       └── createdAt, updatedAt
│
├── approvals/
│   └── {approvalId}/
│       ├── submissionId, mentorId
│       ├── mentorFeedback, mentorApprovedAt
│       ├── organizerStatus, organizerFeedback
│       └── finalScore, organizerApprovedAt
│
└── registrations/
    └── {registrationId}/
        ├── userId, userName, email
        ├── teamName, skills, qrCode
        ├── status, verifiedBy
        └── registeredAt, verifiedAt
```

---

## 🛠️ Key Files Created/Modified

### New Files:
1. `src/firebase/firebaseService.ts` - All Firebase operations
2. `src/components/QRCodeGenerator.tsx` - QR code display
3. `src/components/QRScanner.tsx` - Camera QR scanner
4. `src/screens/OrganizerDashboardScreen.tsx` - Organizer panel
5. `src/screens/ParticipantQRScreen.tsx` - Participant QR view

### Modified Files:
1. `src/types/index.ts` - Added Submission, Approval, ParticipantRegistration types
2. `src/navigation/AppNavigator.tsx` - Role-based navigation
3. `src/screens/RoleSelectionScreen.tsx` - Firebase role saving
4. `app.json` - Camera permissions

---

## 🔐 Required Setup

### 1. Firebase Console:
- Enable Firestore Database
- Set up security rules (see ROLE_WORKFLOW_IMPLEMENTATION.md)
- Enable Authentication (Email/Password, Google)

### 2. Permissions:
- Camera permission for QR scanning ✅ (Already configured)
- Internet permission ✅ (Already configured)

### 3. Dependencies:
```bash
npm install
```
All dependencies already installed:
- react-native-qrcode-svg
- expo-camera
- expo-barcode-scanner
- react-native-svg

---

## 🎨 UI Features

### Theme Support:
- ✅ Full dark/light mode
- ✅ Adaptive colors per role
- ✅ Consistent design language

### Real-time Updates:
- ✅ Firebase listeners
- ✅ Auto-refresh on data changes
- ✅ Pull-to-refresh support

### Responsive Design:
- ✅ ScrollViews for all content
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling

---

## 📱 Testing Checklist

### Participant Testing:
- [ ] Sign up as participant
- [ ] View QR code in "My QR" tab
- [ ] Check status display
- [ ] Share QR code functionality
- [ ] View registration details

### Organizer Testing:
- [ ] Sign up as organizer
- [ ] View participants list
- [ ] Scan QR code (camera access)
- [ ] Verify participant
- [ ] Check status changes
- [ ] View statistics dashboard

### Mentor Testing:
- [ ] Sign up as mentor
- [ ] Access mentor panel
- [ ] (Next phase) Review submissions

### Multi-User Testing:
- [ ] Open app on 2+ devices
- [ ] Test real-time sync
- [ ] Organizer verifies participant
- [ ] Participant sees status change immediately

---

## 🐛 Known Issues & Solutions

### Issue: Camera Permission Denied
**Solution**: 
- Go to phone Settings → Apps → HackIntake → Permissions
- Enable Camera permission

### Issue: QR Code Not Scanning
**Solution**:
- Ensure good lighting
- Hold phone steady
- Center QR code in frame
- Try "Scan Again" button

### Issue: Status Not Updating
**Solution**:
- Pull down to refresh
- Check internet connection
- Firebase listeners should auto-update

---

## 📞 Support

### Documentation:
- Full implementation details: `ROLE_WORKFLOW_IMPLEMENTATION.md`
- User guide: This file
- Code comments: Check inline comments in files

### Firebase Functions:
```typescript
// Import anywhere:
import {
  saveUser,
  createSubmission,
  createApproval,
  registerParticipant,
  verifyParticipant,
} from '../firebase/firebaseService';
```

---

## 🎉 You're All Set!

The role-based workflow system is ready to use. All three user types (Participants, Mentors, Organizers) can now interact seamlessly with:

✅ QR code generation for participants
✅ QR scanning for organizers  
✅ Real-time data synchronization
✅ Role-based navigation
✅ Status tracking and updates
✅ Firebase database integration

**Next Steps:**
1. Test the QR workflow with multiple devices
2. Add submission features to existing screens
3. Enhance mentor approval UI
4. Add notifications for status changes

Happy hacking! 🚀
