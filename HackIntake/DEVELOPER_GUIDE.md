# 🛠️ Developer Guide - HackIntake

A comprehensive guide for developers who want to understand, modify, or contribute to HackIntake.

---

## 📁 Project Structure

```
HackIntake/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Button.tsx          # Custom button component
│   │   ├── Input.tsx           # Form input component
│   │   └── ProblemCard.tsx     # Problem display card
│   │
│   ├── screens/                # Main app screens
│   │   ├── DashboardScreen.tsx      # Home/Dashboard
│   │   ├── SubmitProblemScreen.tsx  # Problem submission form
│   │   ├── MentorPanelScreen.tsx    # Mentor review panel
│   │   ├── TeamViewScreen.tsx       # Team browsing view
│   │   ├── ProfileScreen.tsx        # User profile
│   │   └── ProblemDetailScreen.tsx  # Detailed problem view
│   │
│   ├── navigation/             # Navigation configuration
│   │   └── AppNavigator.tsx   # Tab and stack navigation
│   │
│   ├── store/                  # State management
│   │   └── appStore.ts        # Zustand store
│   │
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts           # Shared types and interfaces
│   │
│   ├── utils/                  # Utility functions
│   │   ├── ThemeContext.tsx   # Theme provider
│   │   ├── aiHelper.ts        # AI utility functions
│   │   └── sampleData.ts      # Mock data for testing
│   │
│   └── config/                 # Configuration files
│
├── App.tsx                     # Root component
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind CSS config
├── babel.config.js             # Babel configuration
├── tsconfig.json               # TypeScript config
└── README.md                   # Documentation
```

---

## 🧩 Architecture Overview

### State Management (Zustand)

HackIntake uses Zustand for simple, performant state management.

**Store Location:** `src/store/appStore.ts`

**Key State:**
```typescript
{
  user: User | null                    // Current logged-in user
  problems: ProblemStatement[]         // All problems
  filteredProblems: ProblemStatement[] // Filtered results
  filters: FilterOptions               // Active filters
}
```

**Key Actions:**
- `setUser(user)` - Set current user
- `addProblem(problem)` - Add new problem
- `updateProblem(id, updates)` - Update existing problem
- `setFilters(filters)` - Apply filters
- `toggleBookmark(problemId, userId)` - Bookmark toggle
- `addComment(problemId, comment)` - Add comment

### Theme System

**Location:** `src/utils/ThemeContext.tsx`

Uses React Context for theme management with:
- Light/Dark mode support
- System preference detection
- Smooth transitions
- Color palette management

**Usage:**
```typescript
const { colors, theme, toggleTheme } = useTheme();
```

### Navigation Structure

**Location:** `src/navigation/AppNavigator.tsx`

**Stack Navigation:**
- Home Stack (Dashboard → SubmitProblem → ProblemDetail)
- Mentor Stack (MentorPanel → ProblemDetail)
- Team Stack (TeamView → ProblemDetail)

**Tab Navigation:**
- Home (all users)
- Mentor (mentors/admins only)
- Browse (all users)
- Profile (all users)

---

## 🎨 Styling System

### NativeWind (Tailwind CSS)

HackIntake uses NativeWind for styling with Tailwind utility classes.

**Configuration:** `tailwind.config.js`

**Custom Colors:**
```javascript
primary: '#6366F1'     // Indigo
secondary: '#A855F7'   // Purple
accent: '#84CC16'      // Lime
success: '#10B981'     // Green
warning: '#F59E0B'     // Orange
error: '#EF4444'       // Red
```

**Usage Example:**
```tsx
<View className="bg-primary rounded-lg p-4">
  <Text className="text-white font-bold">Hello</Text>
</View>
```

### Custom Styles

For complex styling, use StyleSheet:
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
```

---

## 🔧 Key Components

### Button Component

**Location:** `src/components/Button.tsx`

**Props:**
```typescript
{
  title: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  onPress: () => void
}
```

**Example:**
```tsx
<Button 
  title="Submit" 
  variant="primary" 
  onPress={handleSubmit}
/>
```

### Input Component

**Location:** `src/components/Input.tsx`

**Props:**
```typescript
{
  label?: string
  error?: string
  multiline?: boolean
  rows?: number
  ...TextInputProps
}
```

### ProblemCard Component

**Location:** `src/components/ProblemCard.tsx`

**Props:**
```typescript
{
  problem: ProblemStatement
  onPress: () => void
  showActions?: boolean
  onBookmark?: () => void
  isBookmarked?: boolean
}
```

---

## 🔐 TypeScript Types

**Location:** `src/types/index.ts`

### Core Interfaces

**User:**
```typescript
interface User {
  id: string
  name: string
  email: string
  role: UserRole  // 'organizer' | 'mentor' | 'team' | 'admin'
  photoURL?: string
}
```

**ProblemStatement:**
```typescript
interface ProblemStatement {
  id: string
  title: string
  category: string
  difficulty: DifficultyLevel  // 'Easy' | 'Medium' | 'Hard' | 'Expert'
  description: string
  constraints: string[]
  requirements: string[]
  tags: string[]
  urgent: boolean
  status: ProblemStatus  // 'pending' | 'approved' | 'rejected' | 'highlighted'
  createdBy: string
  createdAt: Date
  updatedAt: Date
  fileUrls?: string[]
  imageUrls?: string[]
  assignedMentor?: string
  assignedTeam?: string
  comments?: Comment[]
  aiScore?: number
  bookmarkedBy?: string[]
}
```

---

## 🤖 AI Helper Functions

**Location:** `src/utils/aiHelper.ts`

### Available Functions

**1. Calculate Quality Score**
```typescript
calculateQualityScore(problem): number
```
Returns 0-100 score based on completeness.

**2. Analyze Description**
```typescript
analyzeProblemDescription(description): AISuggestion[]
```
Provides suggestions for improvement.

**3. Suggest Constraints**
```typescript
suggestConstraints(category, existingConstraints): string[]
```
Returns category-specific constraint suggestions.

**4. Calculate Urgency**
```typescript
calculateUrgencyScore(title, description, tags): number
```
Scores urgency based on keywords.

---

## 📝 Form Handling

### React Hook Form + Yup

**Example from SubmitProblemScreen:**

```typescript
const schema = yup.object().shape({
  title: yup.string().required().min(5),
  description: yup.string().required().min(20),
});

const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
});

const onSubmit = (data) => {
  // Handle submission
};
```

---

## 🔥 Firebase Integration (Optional)

### Setup Steps

1. **Install Firebase:**
```bash
npm install firebase
```

2. **Create Firebase Config:**
```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

3. **Update Store:**
Replace local state with Firestore operations.

---

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Writing Tests

Use Jest and React Native Testing Library:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/Button';

test('Button calls onPress when clicked', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <Button title="Click me" onPress={onPress} />
  );
  
  fireEvent.press(getByText('Click me'));
  expect(onPress).toHaveBeenCalled();
});
```

---

## 🎯 Adding New Features

### Example: Add a New Screen

1. **Create Screen File:**
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

export const NewScreen = () => {
  const { colors } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Text style={{ color: colors.text }}>New Screen</Text>
    </View>
  );
};
```

2. **Add to Navigation:**
```typescript
// src/navigation/AppNavigator.tsx
import { NewScreen } from '../screens/NewScreen';

// Add to stack or tabs
<Stack.Screen name="NewScreen" component={NewScreen} />
```

3. **Navigate to Screen:**
```typescript
navigation.navigate('NewScreen');
```

### Example: Add Store Action

```typescript
// src/store/appStore.ts
export const useAppStore = create<AppState>((set, get) => ({
  // ... existing state
  
  newAction: (param) => {
    // Your logic here
    set({ /* updated state */ });
  },
}));
```

---

## 🐛 Debugging

### React Native Debugger

1. Install React Native Debugger
2. Shake device → Debug
3. Open debugger at http://localhost:8081/debugger-ui

### Useful Debug Commands

```typescript
console.log('Debug:', variable);
console.warn('Warning message');
console.error('Error message');
```

### Performance Monitoring

```typescript
import { PerformanceObserver } from 'perf_hooks';

const observer = new PerformanceObserver((list) => {
  console.log(list.getEntries());
});
```

---

## 📦 Building for Production

### iOS Build

```bash
expo build:ios
```

### Android Build

```bash
expo build:android
```

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

---

## 🔄 Git Workflow

### Branch Strategy

```bash
main          # Production-ready code
develop       # Development branch
feature/*     # New features
bugfix/*      # Bug fixes
hotfix/*      # Urgent fixes
```

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 📚 Useful Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Zustand Guide](https://docs.pmnd.rs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [NativeWind](https://www.nativewind.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 💡 Best Practices

### Component Structure
```typescript
// 1. Imports
import React from 'react';
import { View, Text } from 'react-native';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export const Component: React.FC<Props> = ({ title }) => {
  // 4. Hooks
  const { colors } = useTheme();
  
  // 5. Handlers
  const handlePress = () => {};
  
  // 6. Render
  return <View><Text>{title}</Text></View>;
};

// 7. Styles
const styles = StyleSheet.create({});
```

### Performance Tips
- Use `React.memo` for expensive components
- Implement `useMemo` and `useCallback`
- Optimize FlatList with `keyExtractor` and `getItemLayout`
- Lazy load images
- Minimize re-renders

### Code Quality
- Follow ESLint rules
- Use TypeScript strictly
- Write meaningful comments
- Keep functions small
- Use descriptive variable names

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

Quick checklist:
- ✅ Fork the repository
- ✅ Create feature branch
- ✅ Write tests
- ✅ Update documentation
- ✅ Submit PR with description

---

## 📞 Support

- **Technical Issues:** Open GitHub issue
- **Questions:** Discussion forum
- **Security:** security@hackintake.com

---

<div align="center">

**Happy Coding! 👨‍💻**

Built with ❤️ by developers, for developers

</div>
