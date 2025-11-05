const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable watchman due to permission issues
config.watchFolders = [];

module.exports = config;
