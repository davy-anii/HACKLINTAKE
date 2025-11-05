# ⚡ Quick Start Guide - HackIntake

Get up and running with HackIntake in 5 minutes!

## 🎯 Prerequisites Checklist

Before you begin, ensure you have:

- ✅ Node.js (v16+) installed
- ✅ npm or yarn package manager
- ✅ Expo Go app on your phone (iOS/Android)
  - [Download for iOS](https://apps.apple.com/app/expo-go/id982107779)
  - [Download for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Setup (3 Steps)

### Step 1: Navigate to Project
```bash
cd /Users/ankitkarmakar/Desktop/HACKLINTAKKE/HackIntake
```

### Step 2: Install Dependencies (if not done)
```bash
npm install
```

### Step 3: Start the App
```bash
npm start
```

## 📱 Running the App

After running `npm start`, you'll see a QR code in your terminal.

### Option A: Mobile Device (Recommended)
1. Open **Expo Go** app on your phone
2. Scan the QR code
3. Wait for the app to load
4. Start exploring! 🎉

### Option B: iOS Simulator (Mac Only)
```bash
npm run ios
```

### Option C: Android Emulator
```bash
npm run android
```

### Option D: Web Browser
```bash
npm run web
```

## 🎨 First Launch

When the app opens:

1. **You're automatically logged in** as a Mentor user (demo mode)
2. **Sample problems** are pre-loaded for testing
3. **Explore the tabs**: Home, Mentor, Browse, Profile

## 🧪 Try These Features

### 1. Submit a Problem (30 seconds)
- Tap the **+ button** in Home
- Fill in title: "My Test Problem"
- Select any category
- Choose difficulty level
- Add description
- Tap "Submit Problem"

### 2. Review Problems (Mentor Panel)
- Go to **Mentor tab**
- See pending problems
- Tap **Approve** or **Reject**
- Try **Highlight** on approved ones

### 3. Browse as a Team
- Go to **Browse tab**
- Tap bookmark icon on any problem
- Toggle "Bookmarked" to see your saved items

### 4. Toggle Dark Mode
- Go to **Profile tab**
- Toggle the **Dark Mode** switch
- See the beautiful theme change! 🌙

## 🎯 Demo Data

The app comes with 5 sample problems:
- Smart Campus Navigation System
- Climate Action Tracker
- AI-Powered Healthcare Chatbot
- Blockchain Supply Chain Tracker
- Mental Health Support Platform

Feel free to interact with them!

## 🔄 Reset the App

To start fresh:
```bash
npm start -- --clear
```

## 🐛 Troubleshooting

### "Can't scan QR code"
- Make sure your phone and computer are on the same WiFi
- Try the "Tunnel" connection method in Expo

### "Module not found" errors
```bash
npm install
npm start -- --clear
```

### "Port already in use"
```bash
# Kill the process on port 8081
lsof -ti:8081 | xargs kill
npm start
```

### App won't load
- Close and reopen Expo Go app
- Shake device → Reload
- Check your internet connection

## 📚 Next Steps

Once you're comfortable:

1. **Read the full [USER_GUIDE.md](USER_GUIDE.md)** for detailed features
2. **Check [README.md](README.md)** for architecture details
3. **Explore the code** in `src/` directory
4. **Customize** colors, themes, and features
5. **Integrate Firebase** for production use

## 💡 Quick Tips

- **Shake your device** to open developer menu
- **Use filters** on Dashboard to find problems quickly
- **Bookmark problems** you find interesting
- **Toggle dark mode** for different experiences
- **Add comments** to engage with problems

## 🎨 Customization Quick Wins

### Change Primary Color
Edit `tailwind.config.js`:
```js
primary: {
  DEFAULT: '#YOUR_COLOR', // Change this!
}
```

### Change App Name
Edit `app.json`:
```json
"name": "YourAppName"
```

### Modify Sample Data
Edit `src/utils/sampleData.ts`

## 📞 Need Help?

- **Errors?** Check the terminal output
- **Questions?** Read USER_GUIDE.md
- **Bugs?** Check the console logs
- **Stuck?** Create an issue on GitHub

## 🎉 You're All Set!

The app is now running. Here's what you can do:

✅ Submit problem statements  
✅ Review as a mentor  
✅ Browse and bookmark  
✅ Toggle dark/light theme  
✅ View detailed problem info  
✅ Add comments and feedback  

---

<div align="center">

**Ready to hack? Let's go! 🚀**

If you encounter any issues, don't hesitate to reach out!

[← Back to README](README.md) | [User Guide →](USER_GUIDE.md)

</div>
