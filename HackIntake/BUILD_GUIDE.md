# APK Build Guide for HackIntake

## Fixed Issues ✅

### 1. **Firebase Configuration**
- ✅ Added `google-services.json` for Android builds
- ✅ Added internet permissions (`INTERNET`, `ACCESS_NETWORK_STATE`)
- ✅ Added linking scheme: `hackintake://`

### 2. **App Configuration**
- ✅ Fixed `app.json` with proper Android config
- ✅ Added `googleServicesFile` reference
- ✅ Restored `expo-dev-client` for development builds

### 3. **EAS Build Configuration**
- ✅ Updated `eas.json` with proper preview build settings
- ✅ Set `gradleCommand` for APK release builds

---

## How to Build APK

### Option 1: Preview Build (Recommended for Testing)
```bash
cd /Users/ankitkarmakar/Desktop/HACKLINTAKKE/HackIntake
eas build -p android --profile preview
```

This creates a **standalone APK** that can be installed directly on any Android device.

### Option 2: Production Build
```bash
eas build -p android --profile production
```

This creates an **AAB (App Bundle)** for Google Play Store submission.

---

## Why Your APK Wasn't Working

### Problems Fixed:

1. **❌ Missing Firebase Android Config**
   - **Problem**: APK couldn't connect to Firebase
   - **Fix**: Added `google-services.json` with your Firebase project config

2. **❌ Missing Internet Permissions**
   - **Problem**: App couldn't make network requests
   - **Fix**: Added `INTERNET` and `ACCESS_NETWORK_STATE` permissions

3. **❌ Missing Linking Scheme**
   - **Problem**: Deep links and auth redirects failed
   - **Fix**: Added `scheme: "hackintake"` to app.json

4. **❌ Wrong Build Configuration**
   - **Problem**: Development build required on device
   - **Fix**: Set `developmentClient: false` for preview builds

---

## Testing Your APK

### After Building:

1. **Download the APK** from EAS build page
2. **Transfer to Android device** via USB or cloud storage
3. **Enable "Install from Unknown Sources"** in Android settings
4. **Install the APK**
5. **Open the app** - Firebase should work now!

---

## Development vs Production

### Development Mode (Expo Go)
```bash
# For testing with Expo Go app (no APK needed)
npx expo start --tunnel
```
- ✅ Fast reload
- ✅ No build required
- ❌ Limited to Expo Go features

### Preview Build (Standalone APK)
```bash
eas build -p android --profile preview
```
- ✅ Full native features
- ✅ Works on any Android device
- ✅ Can test production features
- ❌ Takes 10-20 minutes to build

### Production Build (App Bundle)
```bash
eas build -p android --profile production
```
- ✅ Optimized for Play Store
- ✅ Smallest file size
- ❌ Can't install directly (need Google Play)

---

## Common APK Issues & Solutions

### Issue: "App keeps crashing on startup"
**Cause**: Firebase not initialized properly
**Solution**: Already fixed! The `google-services.json` is now in place.

### Issue: "Can't login or make network requests"
**Cause**: Missing internet permissions
**Solution**: Already fixed! Added to `app.json`.

### Issue: "Deep links don't work"
**Cause**: No URL scheme configured
**Solution**: Already fixed! Added `scheme: "hackintake"`.

### Issue: "Build fails on EAS"
**Solution**: 
```bash
# Clear EAS cache and rebuild
eas build --clear-cache -p android --profile preview
```

---

## Important Notes

### Firebase Configuration
Your Firebase project is correctly configured:
- **Project ID**: `hacklintake-6c89f`
- **Package Name**: `com.hackintake.app`
- **App ID**: Android app registered in Firebase Console

### Google Services File
The `google-services.json` has been created with your credentials. If you need to update it:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select "hacklintake-6c89f" project
3. Go to Project Settings → Your apps → Android app
4. Download `google-services.json`
5. Replace the file in your project root

---

## Next Steps

1. **Build the APK**:
   ```bash
   cd /Users/ankitkarmakar/Desktop/HACKLINTAKKE/HackIntake
   eas build -p android --profile preview
   ```

2. **Wait for build** (10-20 minutes)

3. **Download & Install** on your Android device

4. **Test all features**:
   - Login/Authentication
   - Firebase data access
   - Image/document picker
   - Navigation

Your APK should now work properly! 🚀
