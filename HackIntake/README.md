# 🚀 HackIntake - Modern Hackathon Problem Management

**HackIntake** is a beautiful, modern mobile application designed to streamline problem statement submissions and management during hackathons. Built with React Native and Expo, it provides a seamless experience for mentors, organizers, and teams.

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-v0.74-blue)
![Expo](https://img.shields.io/badge/Expo-SDK%2051-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ Features

### 🎯 Core Functionality

- **📝 Problem Submission Form**
  - Intuitive multi-step form with validation
  - Category selection with visual chips
  - Difficulty level indicators
  - Rich text description
  - Bullet-point constraints and requirements
  - Tag management with chips
  - Urgency toggle for critical problems
  - File and image upload support

- **📊 Smart Dashboard**
  - Beautiful card-based problem display
  - Real-time search functionality
  - Advanced filtering (category, difficulty, urgency, status)
  - Quick stats and problem counts
  - Pull-to-refresh support

- **👨‍🏫 Mentor/Admin Panel**
  - Review pending submissions
  - Approve or reject problems
  - Highlight top-rated problems
  - Assign mentors to problems
  - Status-based filtering
  - Quick action buttons

- **👥 Team View**
  - Browse approved problems
  - Bookmark problems for your team
  - View highlighted/top-rated problems
  - Filter by bookmarked status
  - Statistics overview

- **👤 User Profile**
  - Personal statistics dashboard
  - Dark/Light theme toggle
  - Role-based access control
  - Activity tracking

### 🎨 Design & UX

- **Modern UI Components**
  - Notion × Devpost inspired design
  - Smooth animations and transitions
  - Rounded cards with subtle shadows
  - Gradient accent colors (Indigo → Purple)
  - Vector icons from Ionicons

- **Theme System**
  - 🌙 Dark Mode
  - ☀️ Light Mode
  - System-based default
  - Smooth theme transitions

- **Typography**
  - Clean, readable fonts
  - Proper hierarchy
  - Optimized for mobile reading

### 🤖 AI-Powered Features

- **Quality Scoring**
  - Automatic problem quality assessment
  - Score based on completeness
  - Real-time feedback

- **Smart Suggestions**
  - Description improvement tips
  - Missing constraint detection
  - Category-specific recommendations
  - Urgency scoring based on keywords

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile development |
| **Expo** | Build and deployment tooling |
| **TypeScript** | Type-safe development |
| **Zustand** | Lightweight state management |
| **React Hook Form** | Form handling and validation |
| **Yup** | Schema validation |
| **NativeWind** | Tailwind CSS for React Native |
| **React Navigation** | Navigation and routing |
| **Ionicons** | Beautiful vector icons |

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd HackIntake

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

---

## 📱 App Structure

```
HackIntake/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ProblemCard.tsx
│   ├── screens/            # App screens
│   │   ├── DashboardScreen.tsx
│   │   ├── SubmitProblemScreen.tsx
│   │   ├── MentorPanelScreen.tsx
│   │   ├── TeamViewScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ProblemDetailScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── store/              # State management
│   │   └── appStore.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── utils/              # Helper functions
│   │   ├── ThemeContext.tsx
│   │   ├── aiHelper.ts
│   │   └── sampleData.ts
│   └── config/             # App configuration
├── App.tsx                 # Root component
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

---

## 🎯 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Organizer** | Submit problems, view dashboard, browse problems |
| **Mentor** | Review submissions, approve/reject, highlight, assign |
| **Team** | Browse approved problems, bookmark, comment |
| **Admin** | Full access to all features |

---

## 🎨 Color Palette

```javascript
Primary: #6366F1 → #A855F7 (Indigo to Purple gradient)
Accent: #84CC16 (Lime) / #06B6D4 (Cyan)
Success: #10B981
Warning: #F59E0B
Error: #EF4444

Light Theme:
- Background: #F9FAFB
- Card: #FFFFFF
- Text: #111827

Dark Theme:
- Background: #0F172A
- Card: #1E293B
- Text: #F1F5F9
```

---

## 🔄 App Flow

1. **User Login** → Lands on Dashboard
2. **Submit Problem** → Guided form with validation
3. **Submission** → Appears under "Review Pending"
4. **Mentor Review** → Approve/Reject/Highlight
5. **Teams Browse** → Select problems for their project
6. **Collaboration** → Comment and discuss

---

## 📸 Screenshots

> *Add screenshots of your app here*

---

## 🚀 Features Roadmap

- [ ] Firebase/Supabase integration
- [ ] Google OAuth authentication
- [ ] Real-time notifications
- [ ] Advanced AI suggestions
- [ ] Team collaboration features
- [ ] Export to PDF/CSV
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

Built with ❤️ for hackathons worldwide

---

## 📧 Support

For support, email support@hackintake.com or open an issue in the repository.

---

## 🙏 Acknowledgments

- Design inspired by Notion and Devpost
- Icons from Ionicons
- Community feedback and contributions

---

<div align="center">

**Made with ❤️ for the hackathon community**

⭐ Star this repo if you find it helpful!

</div>
