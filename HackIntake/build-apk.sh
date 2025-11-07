#!/bin/bash

# HackIntake APK Build Script
# This script helps you build a working APK for your Android device

set -e

echo "🚀 HackIntake APK Builder"
echo "========================="
echo ""

# Change to project directory
cd "$(dirname "$0")"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Login to EAS (if not logged in)
echo "🔐 Checking EAS login status..."
if ! eas whoami &> /dev/null; then
    echo "Please login to your Expo account:"
    eas login
fi

echo ""
echo "📦 Building APK..."
echo ""
echo "Choose build type:"
echo "1) Preview Build (APK for testing - Recommended)"
echo "2) Production Build (App Bundle for Play Store)"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo ""
        echo "Building Preview APK..."
        eas build -p android --profile preview
        ;;
    2)
        echo ""
        echo "Building Production App Bundle..."
        eas build -p android --profile production
        ;;
    *)
        echo "Invalid choice. Building Preview APK by default..."
        eas build -p android --profile preview
        ;;
esac

echo ""
echo "✅ Build initiated!"
echo ""
echo "📱 Next steps:"
echo "1. Wait for build to complete (check email or EAS dashboard)"
echo "2. Download the APK from the build page"
echo "3. Install on your Android device"
echo ""
echo "Build dashboard: https://expo.dev/accounts/devey_ankit/projects/HackIntake/builds"
