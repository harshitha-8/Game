const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude macOS resource fork files (._*) that cause SyntaxError
config.resolver = config.resolver || {};
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  /\/\._.*$/,
  /.*\/\._.*$/,
];

module.exports = config;
