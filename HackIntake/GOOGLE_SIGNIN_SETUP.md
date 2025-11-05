# Google Sign-In Setup Guide

## 🎯 Overview
The HackIntake app now includes Google Sign-In with account picker functionality. When users click "Continue with Google", they'll see all their Google accounts and can choose which one to use for login.

## ✨ Features Implemented

### 1. **Account Picker Modal**
- Shows all available Google accounts
- Displays user profile pictures, names, and emails
- "Use another account" option for adding new accounts
- Professional UI with theme support (light/dark mode)
- Smooth animations and transitions

### 2. **Mock Authentication** (Current Demo)
- 4 pre-loaded demo accounts for testing
- Instant account selection
- Seamless login flow
- All accounts work with the app

### 3. **Production-Ready Structure**
- Google OAuth utilities setup
- Expo Auth Session integration
- Ready for real Google API connection

## 🚀 How It Works (Demo Mode)

1. User clicks **"Continue with Google"** button
2. Account picker modal appears showing 4 demo accounts:
   - john.doe@gmail.com
   - jane.smith@gmail.com
   - alex.johnson@gmail.com
   - sarah.williams@gmail.com
3. User selects any account
4. User is logged in with that account's details

## 🔧 Setting Up for Production

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen
6. For Application type, select:
   - **iOS** for iOS app
   - **Android** for Android app
   - **Web** for web testing

### Step 2: Get Client IDs

**For iOS:**
- Bundle ID: Your app's bundle identifier (e.g., `com.hackintake.app`)
- Copy the **iOS Client ID**

**For Android:**
- Package name: Your app's package name
- SHA-1 certificate fingerprint (run: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`)
- Copy the **Android Client ID**

**For Expo:**
- Also create a **Web** OAuth client ID for Expo Go testing

### Step 3: Update Configuration

Edit `src/utils/googleAuth.ts`:

```typescript
// Replace with your actual Google OAuth Client ID
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
```

### Step 4: Update app.json

Add the scheme to your `app.json`:

```json
{
  "expo": {
    "scheme": "hackintake",
    "ios": {
      "bundleIdentifier": "com.hackintake.app"
    },
    "android": {
      "package": "com.hackintake.app"
    }
  }
}
```

### Step 5: Backend API Setup (Recommended)

For security, implement backend authentication:

1. **Frontend**: Send authorization code to your backend
2. **Backend**: Exchange code for access token
3. **Backend**: Fetch user info from Google
4. **Backend**: Create session/JWT token
5. **Frontend**: Store token and login user

Example backend endpoint:
```javascript
POST /api/auth/google
Body: { code: "authorization_code_from_google" }
Response: { user: {...}, token: "jwt_token" }
```

## 📱 Testing in Development

### Current Demo Mode:
- No Google API calls needed
- Click "Continue with Google"
- Select any demo account
- Instant login

### To Test Real Google Sign-In:

1. Install Expo Go on your device
2. Make sure Google OAuth is configured
3. Update `GOOGLE_CLIENT_ID` in `googleAuth.ts`
4. Run the app
5. Click "Continue with Google"
6. Real Google account picker will appear
7. Sign in with your Google account

## 🎨 UI Customization

The account picker supports both themes:

**Dark Mode:**
- Navy background (#1E293B)
- Professional blue accents (#2563EB)
- White text

**Light Mode:**
- White background (#FFFFFF)
- Sky blue accents (#0EA5E9)
- Dark blue text (#0C4A6E)

## 🔒 Security Notes

1. **Never expose Client Secret** in frontend code
2. **Always validate** tokens on backend
3. **Use HTTPS** for redirect URIs in production
4. **Implement rate limiting** on auth endpoints
5. **Store tokens securely** (SecureStore for Expo)

## 📦 Dependencies

```json
{
  "expo-auth-session": "^5.x.x",
  "expo-web-browser": "^13.x.x"
}
```

Already installed! ✅

## 🐛 Troubleshooting

### Issue: "Invalid client ID"
- Double-check your Client ID in `googleAuth.ts`
- Ensure you're using the correct Client ID for your platform (iOS/Android/Web)

### Issue: "Redirect URI mismatch"
- Verify your app scheme in `app.json` matches OAuth configuration
- For Expo: Use the development redirect URI in Google Console

### Issue: Account picker not showing
- Check if modal is properly imported
- Verify `showAccountPicker` state is being set to `true`

## 🎯 Future Enhancements

- [ ] Real-time account syncing
- [ ] Remember last used account
- [ ] Face ID/Touch ID for quick sign-in
- [ ] Social account linking (Facebook, Apple)
- [ ] Multi-account switching without logout

## 📚 References

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)

---

**Note**: Currently running in **demo mode** with mock accounts. Replace with real Google OAuth credentials for production use.
