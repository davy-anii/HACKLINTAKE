# 📚 HackIntake - User Guide

## 🚀 Getting Started

### First Launch

When you first open HackIntake, you'll be automatically logged in as a **Mentor** user (for demo purposes). In production, you would authenticate using Google OAuth.

---

## 📱 Main Features

### 1. 🏠 Home Screen (Dashboard)

The dashboard is your central hub for managing problem statements.

#### Features:
- **Search Bar**: Quickly find problems by title, description, or tags
- **Filter Button**: Access advanced filtering options
- **Add Button (+)**: Submit a new problem statement
- **Problem Cards**: View all submitted problems with quick info

#### Filtering Options:
- **Urgent Only**: Show only urgent problems
- **Category**: Filter by domain (Web Dev, AI/ML, Blockchain, etc.)
- **Difficulty**: Filter by Easy, Medium, Hard, or Expert
- **Clear All**: Reset all filters

#### Problem Card Information:
- Title and description preview
- Category badge
- Difficulty level (color-coded)
- Status indicator (Pending, Approved, Rejected, Highlighted)
- Urgent badge (if applicable)
- Tags (hashtags)

#### Actions:
- Tap any card to view full details
- Use the search bar for quick filtering
- Toggle filters to narrow down results

---

### 2. ✍️ Submit Problem

Click the **+** button on the dashboard to submit a new problem statement.

#### Form Fields:

**Required Fields:**
- **Title** (min 5 characters)
- **Category** (select from chips)
- **Difficulty Level** (Easy/Medium/Hard/Expert)
- **Description** (min 20 characters)

**Optional Fields:**
- **Constraints**: Add technical or project constraints
  - Type constraint and press + button
  - Remove by clicking the X icon
  
- **Requirements**: Specify solution requirements
  - Add multiple requirements
  - Remove individually if needed
  
- **Tags**: Add hashtags for better discovery
  - Type tag and press + button
  - Prevents duplicate tags
  
- **Urgent Toggle**: Mark critical problems
  - Toggle the urgent switch
  - Adds prominent badge to problem
  
- **Attachments**: Upload files or images
  - Tap upload button to select files
  - Preview file names
  - Remove files before submission

#### Form Validation:
- Real-time validation with error messages
- Required fields are marked with *
- Descriptive error messages guide you

#### After Submission:
- Success confirmation alert
- Form automatically resets
- Returns to dashboard
- Problem appears in "Pending" status

---

### 3. 👨‍🏫 Mentor Panel

**Available to: Mentors and Admins only**

The Mentor Panel allows you to review and manage problem submissions.

#### Statistics Bar:
- **Pending**: Problems awaiting review
- **Approved**: Accepted problems
- **Highlighted**: Top-rated problems

#### Filter Tabs:
- **All**: View all problems
- **Pending**: Review queue
- **Approved**: Accepted submissions
- **⭐ Top**: Highlighted problems

#### Actions on Each Problem:

**For Pending Problems:**
- **Approve**: Accept the problem statement
- **Reject**: Decline the submission

**For Approved Problems:**
- **⭐ Highlight**: Mark as top-rated
- **Assign to Me**: Take ownership

**Status Indicators:**
- Green: Approved
- Yellow: Pending
- Red: Rejected
- Purple: Highlighted
- Badge: Shows if mentor is assigned

#### Workflow:
1. Review problem details
2. Approve or reject
3. Optionally highlight top problems
4. Assign yourself to problems you'll mentor
5. Add comments for feedback

---

### 4. 👥 Browse (Team View)

This screen lets teams explore approved problems and bookmark favorites.

#### View Modes:
- **Show All**: Display all approved problems
- **Bookmarked**: Show only your bookmarked problems

#### Information Cards:
- **Info Banner**: Instructions for teams
- **Statistics**: 
  - Available problems
  - Your bookmarks
  - Top-rated problems

#### Actions:
- **Bookmark**: Tap bookmark icon on any card
  - Filled bookmark = already bookmarked
  - Outline bookmark = not bookmarked
- **View Details**: Tap card for full information
- **Filter**: Toggle between all and bookmarked

#### Use Cases:
- Browse problems for your hackathon project
- Bookmark interesting problems for later review
- Focus on highlighted/top-rated problems
- Share problem details with your team

---

### 5. 📄 Problem Details

Tap any problem card to view comprehensive details.

#### Sections:

**Header:**
- Back button
- Problem title
- Bookmark toggle

**Problem Information:**
- Urgent badge (if applicable)
- Full title
- Category and difficulty badges
- Complete description

**Constraints:**
- Bulleted list with checkmarks
- Technical and project limitations

**Requirements:**
- Detailed solution requirements
- Feature specifications

**Tags:**
- All associated hashtags
- Helps with categorization

**AI Quality Score** (if available):
- Automated quality assessment
- Score out of 100
- Based on completeness

**Comments & Feedback:**
- View all comments
- Author and timestamp
- Add your own feedback
- Post button to submit

#### Actions:
- Bookmark/unbookmark
- Add comments
- Share (coming soon)
- Report (coming soon)

---

### 6. 👤 Profile Screen

Manage your account and app settings.

#### Profile Card:
- Avatar with initial
- Your name
- Email address
- Role badge (color-coded by role)

#### Statistics:
- **Submitted**: Problems you've created
- **Bookmarked**: Problems you saved
- **Highlighted**: Your problems that got highlighted

#### Settings:

**Dark Mode Toggle:**
- Switch between light and dark themes
- Smooth transitions
- System-based default
- Persists across sessions

#### Menu Options:
- **Notifications**: Manage alerts (coming soon)
- **Help & Support**: Get assistance
- **About**: App information

#### Actions:
- **Logout**: Sign out of your account
  - Confirmation dialog
  - Clears user session

---

## 🎨 Design Features

### Theme System

**Light Mode:**
- Clean white backgrounds
- High contrast text
- Subtle shadows
- Professional appearance

**Dark Mode:**
- Easy on the eyes
- OLED-friendly blacks
- Reduced eye strain
- Modern aesthetic

### Color Coding

**Difficulty Levels:**
- 🟢 Easy: Green
- 🟡 Medium: Yellow
- 🔴 Hard: Red
- 🟣 Expert: Purple

**Status:**
- 🟢 Approved: Green
- 🟡 Pending: Yellow
- 🔴 Rejected: Red
- 💜 Highlighted: Purple

**Roles:**
- 🔵 Organizer: Blue
- 🟣 Mentor: Purple
- 🔴 Admin: Red
- 🟢 Team: Green

---

## 💡 Tips & Best Practices

### For Organizers:

1. **Writing Problem Statements:**
   - Be clear and concise
   - Include specific requirements
   - Add realistic constraints
   - Use relevant tags
   - Mark truly urgent problems only

2. **Quality Submissions:**
   - Aim for 30-50 word descriptions
   - Add 3-5 constraints
   - List 3-5 requirements
   - Include 3-5 relevant tags
   - Attach diagrams if helpful

### For Mentors:

1. **Reviewing Submissions:**
   - Read thoroughly before deciding
   - Leave constructive feedback
   - Highlight exceptional problems
   - Assign yourself to problems in your expertise

2. **Feedback Comments:**
   - Be specific and actionable
   - Suggest improvements
   - Ask clarifying questions
   - Encourage quality submissions

### For Teams:

1. **Finding Problems:**
   - Use search and filters
   - Focus on highlighted problems first
   - Bookmark multiple options
   - Read full details before committing

2. **Selecting Projects:**
   - Match difficulty to team skill level
   - Consider available time
   - Look for clear requirements
   - Check for mentor assignment

---

## 🤖 AI Features

### Quality Score

The AI automatically assesses problem quality based on:
- Title clarity (20 points)
- Description completeness (30 points)
- Number of constraints (20 points)
- Number of requirements (20 points)
- Tag relevance (10 points)

**Score Ranges:**
- 90-100: Excellent
- 70-89: Good
- 50-69: Fair
- Below 50: Needs improvement

### Auto Suggestions

The AI can suggest:
- Missing constraints based on category
- Description improvements
- Urgency scoring
- Quality improvements

---

## 🔧 Troubleshooting

### Common Issues:

**Problem: Can't submit a problem**
- Solution: Check all required fields are filled
- Ensure title is at least 5 characters
- Description must be at least 20 characters

**Problem: Can't see Mentor tab**
- Solution: Only mentors and admins can access this
- Check your user role in Profile

**Problem: Bookmarks not saving**
- Solution: Ensure you're logged in
- Try refreshing the app

**Problem: Theme not changing**
- Solution: Toggle the switch in Profile > Settings
- Restart app if needed

---

## 📞 Support

Need help? Here's how to get support:

1. **In-App**: Profile > Help & Support
2. **Email**: support@hackintake.com
3. **GitHub**: Open an issue
4. **Documentation**: Check README.md

---

## 🎯 Keyboard Shortcuts (Web Only)

- `Ctrl/Cmd + F`: Focus search
- `Esc`: Close modals
- `Tab`: Navigate form fields
- `Enter`: Submit forms

---

## 📱 Mobile-Specific Tips

### Gestures:
- **Pull down**: Refresh lists
- **Swipe left**: Quick actions (coming soon)
- **Long press**: Context menu (coming soon)

### Performance:
- Close unused tabs
- Clear old problems periodically
- Update app regularly
- Report bugs promptly

---

## 🔐 Privacy & Security

- All data is stored locally (demo mode)
- Firebase integration for production
- Secure authentication via Google OAuth
- GDPR compliant
- No data selling or sharing

---

## 🆕 What's Coming Next

- [ ] Real-time collaboration
- [ ] Push notifications
- [ ] Team management
- [ ] Advanced analytics
- [ ] Export to PDF
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Voice input

---

## 📄 Version History

### Version 1.0.0 (Current)
- Initial release
- Core problem management
- Mentor panel
- Team view
- Dark/Light theme
- AI quality scoring

---

<div align="center">

**Happy Hacking! 🚀**

Made with ❤️ for the hackathon community

</div>
