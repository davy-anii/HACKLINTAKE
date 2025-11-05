const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsDir = path.join(__dirname, 'assets');

// Define the base64 placeholder - you need to save the actual image
const targetFiles = [
  'icon.png',
  'adaptive-icon.png',
  'splash-icon.png',
  'favicon.png'
];

console.log('🚀 Setting up HackIntake logo...\n');

// Try to find the logo in common locations
const possiblePaths = [
  path.join(process.env.HOME, 'Desktop', 'hackintake-logo.png'),
  path.join(process.env.HOME, 'Downloads', 'hackintake-logo.png'),
  path.join(process.env.HOME, 'Downloads', 'HacklinTake.png'),
  path.join(process.env.HOME, 'Desktop', 'HacklinTake.png'),
];

// Check Downloads for recent PNG files
try {
  const downloadFiles = execSync('ls -t ~/Downloads/*.png 2>/dev/null | head -1', { encoding: 'utf8' }).trim();
  if (downloadFiles) {
    possiblePaths.push(downloadFiles);
  }
} catch (e) {}

let sourcePath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    sourcePath = testPath;
    console.log(`✅ Found logo at: ${sourcePath}\n`);
    break;
  }
}

if (!sourcePath) {
  console.log('❌ Logo file not found!');
  console.log(`\nPlease save the HackIntake logo image to one of these locations:`);
  console.log(`   ~/Desktop/hackintake-logo.png`);
  console.log(`   ~/Downloads/hackintake-logo.png\n`);
  console.log('Then run this script again: node setup-logo.js\n');
  process.exit(1);
}

// Copy to all required locations
let success = 0;
targetFiles.forEach(filename => {
  const targetPath = path.join(assetsDir, filename);
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Created ${filename}`);
    success++;
  } catch (error) {
    console.log(`❌ Failed to create ${filename}: ${error.message}`);
  }
});

console.log(`\n✨ Successfully set up ${success}/${targetFiles.length} logo files!`);
console.log('\n📱 Next steps:');
console.log('   1. Run: rm -rf .expo');
console.log('   2. Run: npx expo start --clear');
console.log('\nYour new logo will appear! 🎉\n');
