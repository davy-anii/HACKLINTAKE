# 🚀 HackIntake

<div align="center">




![HACKLINTAKE](https://github.com/user-attachments/assets/77069fb4-86e0-4f2b-8f06-625955a0ded5)






**Modern Mobile App for Hackathon Problem Statement Management**

[![Expo](https://img.shields.io/badge/Expo-~54.0.22-000020?style=for-the-badge&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-12.5.0-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📖 About

HackIntake is a comprehensive mobile application designed to streamline the hackathon problem statement submission and management process. Built with React Native and Expo, it provides an intuitive interface for participants, mentors, and organizers to collaborate effectively.

### 🎯 Key Highlights

- 📱 **Cross-Platform**: Works seamlessly on iOS and Android
- 🎨 **Modern UI**: Beautiful animations and professional design
- 🌓 **Theme Support**: Dark and light mode for comfortable viewing
- 🌍 **Multi-Language**: Support for multiple languages
- 🔐 **Secure Authentication**: Firebase-powered authentication
- 📊 **Real-time Updates**: Live dashboard with instant notifications
- 🤖 **AI Integration**: AI-powered problem statement generation

---

## ✨ Features

### 👥 Role-Based Access

#### 🎯 Participant Features
- Submit problem statements with detailed descriptions
- Track submission status (Pending/Approved/Rejected)
- Browse approved problems by category
- Receive mentor feedback
- Save problems for later review
- Filter by difficulty, category, and urgency

#### 🛡️ Mentor Features
- Review pending submissions
- Approve or reject problem statements
- Assign problems to teams
- Provide detailed feedback
- Track approval statistics
- Highlight top picks

#### ⭐ Organizer Features
- Full administrative access
- Manage all submissions
- Assign mentors to problems
- View comprehensive analytics
- Configure hackathon settings
- Monitor platform activity

### 🎨 UI/UX Features

- **Animated Screens**: Smooth page transitions with floating shapes and shimmer effects
- **Professional Design**: Clean, modern interface with professional color schemes
- **Dark Mode**: Fully optimized dark and light themes
- **Responsive Layout**: Adapts to different screen sizes
- **Intuitive Navigation**: Bottom tab navigation with clear iconography
- **Interactive Cards**: Engaging card designs with hover effects

### 🔧 Technical Features

- **State Management**: Zustand for efficient state handling
- **Form Validation**: React Hook Form with Yup schemas
- **Secure Storage**: Expo Secure Store for sensitive data
- **Document Picker**: Upload attachments and documents
- **Image Picker**: Upload images for problem statements
- **Real-time Database**: Firebase Firestore integration
- **Authentication**: Firebase Auth with email/password and OAuth

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hackintake.git
   cd HackIntake
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Download your Firebase config
   - Create `src/config/firebase.ts` with your credentials:
   ```typescript
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

---

## 🚀 Usage

### First Time Setup

1. **Launch the app** and you'll see the welcome screen
2. **Sign up** or **Login** with your credentials
3. **Select your role**: Participant, Mentor, or Organizer
4. **Complete your profile** with necessary details

### For Participants

1. Navigate to **Dashboard** to see overview statistics
2. Click **Submit Problem** to create a new submission
3. Fill in:
   - Problem title
   - Detailed description
   - Category (AI/ML, Web Dev, Mobile Dev, etc.)
   - Difficulty level
   - Tags and attachments
4. Mark as **Urgent** if needed
5. Submit and track status in **Problems** tab

### For Mentors

1. Access the **Mentor Panel** from the bottom navigation
2. View pending submissions
3. Filter by status: All, Pending, Approved, Highlighted
4. Review problem details
5. **Approve** or **Reject** with feedback
6. **Assign** problems to yourself for review
7. Mark top problems as **Highlighted**

### For Organizers

1. Access all features from Participant and Mentor roles
2. View comprehensive analytics
3. Manage user roles and permissions
4. Configure categories and settings
5. Monitor platform activity

---

## 🏗️ Architecture

### Project Structure

```
HackIntake/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── PageAnimation.tsx
│   │   ├── ProblemCard.tsx
│   │   └── WelcomeModal.tsx
│   ├── screens/            # Application screens
│   │   ├── AIGeneratorScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MentorPanelScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ProblemsStatementScreen.tsx
│   │   ├── RoleSelectionScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── WelcomeScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── store/             # State management (Zustand)
│   │   └── appStore.ts
│   ├── utils/             # Utilities and helpers
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── config/            # Configuration files
│       └── firebase.ts
├── assets/                # Images, fonts, icons
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Tech Stack

#### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Yup** - Schema validation

#### Backend & Services
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - Real-time database
- **Firebase Storage** - File storage

#### UI/UX
- **Expo Linear Gradient** - Beautiful gradients
- **Expo Vector Icons** - Icon library
- **Animated API** - Smooth animations
- **NativeWind** - Tailwind CSS for React Native

---

## 🎨 Color Scheme

### Dark Mode
- Background: `#0A0E27`
- Card Background: `#1E293B`
- Primary: `#2563EB`
- Accent: `#60A5FA`
- Text Primary: `#000000` (Headings), `#FFFFFF` (Content)
- Text Secondary: `#94A3B8`

### Light Mode
- Background: `#E0F2FE`
- Card Background: `#FFFFFF`
- Primary: `#0EA5E9`
- Accent: `#38BDF8`
- Text Primary: `#0C4A6E`
- Text Secondary: `#0369A1`

---

## 🎭 Animations

HackIntake features custom animations powered by React Native's Animated API:

- **Page Animations**: 5 floating circles with shimmer effects
- **Entrance Animations**: Fade and slide effects (500ms)
- **Glow Effects**: Pulsing gradients (3-second cycles)
- **Shimmer Sweeps**: Diagonal light effects (2.5s and 3.5s cycles)
- **Interactive Cards**: Scale and shadow animations on press

Each screen has unique color variants:
- Home: Blue theme
- Problems: Purple theme
- Mentor: Green theme
- AI Generator: Purple-pink theme
- Profile: Sky blue theme

---

## 🌍 Multi-Language Support

Currently supported languages:
- English (Default)
- Spanish
- French
- German
- Hindi

Add more languages in `src/utils/LanguageContext.tsx`

---

## 🔐 Security Features

- Secure authentication with Firebase
- Encrypted storage with Expo Secure Store
- Role-based access control
- Input validation and sanitization
- Protected API endpoints
- Session management

---

## 📱 Screenshots

> Add your app screenshots here

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code formatting
- Write meaningful commit messages
- Test on both iOS and Android
- Update documentation for new features

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Device and OS information

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead**: HackIntake Team
- **Contributors**: [View all contributors](https://github.com/yourusername/hackintake/graphs/contributors)

---

## 📧 Contact

For questions or support, reach out to:
- Email: support@hackintake.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/hackintake/issues)

---

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev) for the amazing development platform
- [React Native Community](https://reactnative.dev) for the robust framework
- [Firebase](https://firebase.google.com) for backend services
- All contributors and users of HackIntake

---

<div align="center">

**Made with ❤️ by the HackIntake Team**

⭐ Star us on GitHub — it motivates us a lot!

</div>
