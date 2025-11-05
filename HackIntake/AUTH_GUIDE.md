# 🔐 HackIntake Authentication Guide

## ✨ New Authentication System

The app now features a beautiful, modern sign-in/sign-up experience!

---

## 🎯 Features

### **Sign In Page**
- ✅ Email/Password login
- ✅ Google Sign-In (One-tap authentication)
- ✅ "Forgot Password" option
- ✅ Form validation with error messages
- ✅ Loading states
- ✅ Smooth animations

### **Sign Up Page**
- ✅ Full name field
- ✅ Email validation
- ✅ Password strength requirements (min 6 characters)
- ✅ Confirm password matching
- ✅ Real-time validation
- ✅ Google Sign-Up option

### **Design Highlights**
- 🎨 Beautiful gradient logo
- 🌙 Dark/Light theme support
- 📱 Mobile-optimized keyboard handling
- ✨ Smooth transitions
- 🎯 Feature highlights
- 💫 Modern card-based design

---

## 🔄 How It Works

### **First Launch**
When you open the app, you'll see the authentication screen with:

1. **HackIntake Logo** - Rocket icon with gradient
2. **Welcome Message** - Context-aware (Sign In vs Sign Up)
3. **Form Fields** - Email, password, and more
4. **Google Button** - Quick sign-in with Google
5. **Toggle Link** - Switch between Sign In and Sign Up

### **Sign In Flow**
```
1. Enter email and password
2. Or click "Continue with Google"
3. Tap "Sign In" button
4. Loading state shown
5. Automatically redirected to Dashboard
```

### **Sign Up Flow**
```
1. Click "Sign Up" link
2. Enter full name
3. Enter email
4. Create password
5. Confirm password
6. Tap "Create Account"
7. Automatically logged in and redirected
```

---

## 🎨 UI Elements

### **Logo Section**
- Purple gradient background (#6366F1)
- Rocket icon (represents innovation)
- App name in large bold text
- Contextual subtitle

### **Form Card**
- Rounded corners (20px)
- Elevated shadow
- Theme-aware background
- Organized input fields

### **Input Fields**
All fields include:
- ✅ Label text
- ✅ Placeholder text
- ✅ Real-time validation
- ✅ Error messages
- ✅ Secure password input
- ✅ Email keyboard type

### **Buttons**

**Primary Button (Sign In/Create Account)**
- Full width
- Large size
- Loading spinner when processing
- Gradient background

**Google Button**
- White/dark background (theme-aware)
- Google logo icon
- Border outline
- "Continue with Google" text

### **Features List**
At the bottom, shows what users can do:
- ✅ Submit problem statements
- ✅ Review and approve submissions
- ✅ Browse and bookmark problems

---

## 🔒 Security Features

### **Password Requirements**
- Minimum 6 characters
- Secure text entry (hidden input)
- Match validation for sign-up

### **Email Validation**
- Proper email format
- Real-time validation
- Clear error messages

### **Form Validation**
- Required field validation
- Format validation
- Match validation (password confirm)
- Error display under each field

---

## 💡 Demo Mode

Currently, the authentication is in **demo mode**:

### **Sign In**
- Enter any valid email format
- Enter any password (min 6 chars)
- Click Sign In
- You'll be logged in as a "Mentor" user

### **Google Sign In**
- Click "Continue with Google"
- Simulates Google OAuth
- Automatically creates demo user
- Instant redirect to app

### **Sign Up**
- Fill in all fields
- Password must match confirmation
- Creates a new demo user
- Automatically logged in

---

## 🚀 Production Setup

To enable real authentication with Firebase:

### **1. Install Firebase**
Already installed! Just need to configure.

### **2. Set Up Firebase Project**
```bash
# 1. Go to https://console.firebase.google.com
# 2. Create a new project
# 3. Enable Authentication
# 4. Enable Email/Password provider
# 5. Enable Google provider
```

### **3. Get Configuration**
```javascript
// Add to src/config/firebase.ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### **4. Update AuthScreen.tsx**
Replace the `setTimeout` simulations with actual Firebase calls:

```typescript
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';

// For Email Sign In
const handleEmailSignIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // Store user in state
};

// For Google Sign In
const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // Store user in state
};
```

---

## 🎯 User Experience Flow

### **New User Journey**
```
Open App
    ↓
Auth Screen (Sign Up tab)
    ↓
Fill Name, Email, Password
    ↓
Create Account
    ↓
Dashboard (Home)
    ↓
Explore Features
```

### **Returning User Journey**
```
Open App
    ↓
Auth Screen (Sign In tab)
    ↓
Enter Email & Password
    ↓
Sign In
    ↓
Dashboard (Home)
    ↓
Continue from last session
```

### **Quick Sign In**
```
Open App
    ↓
Auth Screen
    ↓
Click "Continue with Google"
    ↓
Google Account Picker
    ↓
Instant Login
    ↓
Dashboard
```

---

## 🎨 Theme Support

### **Light Mode**
- White card background
- Dark text
- Soft shadows
- Google button with border

### **Dark Mode**
- Dark card background
- Light text
- Elevated shadows
- Theme-aware colors

Both themes maintain:
- ✅ Perfect contrast ratios
- ✅ Readable text
- ✅ Accessible colors
- ✅ Smooth transitions

---

## 📱 Mobile Optimization

### **Keyboard Handling**
- ✅ KeyboardAvoidingView for iOS
- ✅ Behavior: padding
- ✅ ScrollView for small screens
- ✅ Keyboard dismiss on tap outside

### **Input Types**
- Email: Email keyboard with @ symbol
- Password: Secure text entry
- Name: Standard keyboard

### **Screen Sizes**
- ✅ iPhone SE (small)
- ✅ iPhone 14 Pro (standard)
- ✅ iPhone 14 Pro Max (large)
- ✅ Android phones
- ✅ Tablets

---

## ✅ Validation Rules

### **Email**
- Must be valid email format
- Example: `user@domain.com`
- Shows error: "Invalid email"

### **Password (Sign In)**
- Minimum 6 characters
- Shows error: "Password must be at least 6 characters"

### **Password (Sign Up)**
- Minimum 6 characters
- Must match confirmation
- Shows error: "Passwords must match"

### **Name**
- Minimum 2 characters
- Required for sign up
- Shows error: "Name is required"

---

## 🔄 Toggle Between Modes

At the bottom of the form:
- **Sign In mode**: "Don't have an account? Sign Up"
- **Sign Up mode**: "Already have an account? Sign In"

Clicking toggles between modes and:
- ✅ Clears all form fields
- ✅ Resets validation
- ✅ Updates form schema
- ✅ Changes button text

---

## 🎉 Success States

### **After Sign In**
1. Button shows loading spinner
2. 1.5 second simulation
3. User stored in global state
4. Automatic navigation to Main tabs
5. Dashboard appears

### **After Sign Up**
1. Account created message
2. User automatically logged in
3. No need to sign in again
4. Direct access to app features

---

## 🐛 Error Handling

### **Common Errors**
- Empty fields → "Field is required"
- Invalid email → "Invalid email"
- Short password → "Password must be at least 6 characters"
- Password mismatch → "Passwords must match"

### **Network Errors (Production)**
When Firebase is integrated:
- Connection timeout
- Invalid credentials
- Account already exists
- Email not verified

---

## 💾 State Management

### **User State**
Stored in Zustand store:
```typescript
{
  id: string,
  name: string,
  email: string,
  role: 'organizer' | 'mentor' | 'team' | 'admin',
  photoURL?: string
}
```

### **Persistence**
- User state in memory during session
- Logs out on app close (demo mode)
- With Firebase: persist across sessions

---

## 🎯 Next Steps

Want to enhance authentication?

### **Add Features**
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social sign-in (Facebook, Apple)
- [ ] Two-factor authentication
- [ ] Remember me checkbox
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Profile photo upload during signup

### **Improve Security**
- [ ] CAPTCHA for bot prevention
- [ ] Rate limiting
- [ ] Session timeout
- [ ] Device management
- [ ] Security alerts

---

## 📞 Testing

### **Test Scenarios**

**Valid Sign In**
```
Email: test@example.com
Password: password123
Expected: Success, redirect to dashboard
```

**Valid Sign Up**
```
Name: John Doe
Email: john@example.com
Password: secure123
Confirm: secure123
Expected: Success, auto login
```

**Invalid Email**
```
Email: notanemail
Expected: "Invalid email" error
```

**Password Mismatch**
```
Password: test123
Confirm: test456
Expected: "Passwords must match" error
```

**Google Sign In**
```
Click "Continue with Google"
Expected: Loading, then redirect
```

---

## 🎨 Customization

### **Change Colors**
Edit `src/screens/AuthScreen.tsx`:
```typescript
// Logo background
backgroundColor: colors.primary // Change this

// Button colors
Use Button component's variant prop
```

### **Change Logo**
Replace the rocket icon:
```typescript
<Ionicons name="rocket" size={48} color="#FFFFFF" />
// Change "rocket" to any icon name
```

### **Modify Validation**
Edit schema at top of `AuthScreen.tsx`:
```typescript
password: yup.string()
  .min(8, 'Password must be at least 8 characters') // Change min length
  .matches(/[A-Z]/, 'Must contain uppercase') // Add complexity
```

---

## 🌟 Design Philosophy

The authentication screen follows:

1. **Clarity** - Clear purpose, obvious actions
2. **Trust** - Professional, secure appearance
3. **Speed** - Quick sign-in, minimal fields
4. **Flexibility** - Multiple sign-in options
5. **Guidance** - Helpful errors, clear labels

---

<div align="center">

**🔐 Secure, Beautiful, User-Friendly**

Your gateway to HackIntake starts here!

</div>
