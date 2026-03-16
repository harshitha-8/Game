# Changelog — DroneFarm

## Steps taken (summary)

### 1. Initial build
- React Native Expo app with TypeScript
- Expo Router, Zustand, React Native Reanimated
- Splash, onboarding, home, mission detail, simulator, results, profile, settings
- Python-like interpreter (parser, executor)
- 10 tutorial + 3 advanced missions
- Farm grid, code editor, game runner

### 2. iOS build setup
- `eas.json` — development, preview, production profiles
- `app.json` — `bundleIdentifier: com.dronefarm.app`
- `BUILD_IOS.md` — step-by-step iOS/App Store guide
- `package.json` — `build:ios`, `build:ios:preview` scripts

### 3. macOS resource fork fix
- Removed `._*` files that caused "Unexpected character" / "com.apple.provenance" errors
- `metro.config.js` — blockList for `._*` to prevent future corruption
- `.gitignore` — `._*` already present

### 4. Web compatibility fix
- `FarmGrid.tsx` — changed `&&` conditionals to ternaries for React Native Web
- Web export verified: `npx expo export --platform web`

### 5. Dependencies & docs
- Installed deps for DroneFarm, game, Game-repo
- EAS CLI installed globally
- README, SETUP_GUIDE (T9 root), APP_STORE_DESCRIPTION
