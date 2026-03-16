# DroneFarm — iOS Build Guide

## Prerequisites

1. **Expo account** — Sign up at [expo.dev](https://expo.dev)
2. **Apple Developer account** — $99/year for App Store distribution
3. **EAS CLI** — Install globally:

```bash
npm install -g eas-cli
```

4. **Log in to Expo**:

```bash
eas login
```

---

## Step 1: Configure the project

The project already has:
- `eas.json` — Build profiles (development, preview, production)
- `app.json` — `bundleIdentifier`: `com.dronefarm.app`

To use your own bundle ID (recommended for App Store):

1. Open [Apple Developer Portal](https://developer.apple.com/account) → Identifiers
2. Create an App ID (e.g. `com.yourcompany.dronefarm`)
3. Update `app.json`:

```json
"ios": {
  "bundleIdentifier": "com.yourcompany.dronefarm",
  ...
}
```

---

## Step 2: Build for iOS Simulator (no Apple Developer account)

Test the app in the iOS Simulator without a paid account:

```bash
cd /Volumes/T9/DroneFarm
eas build --profile development --platform ios
```

Or run locally with Expo:

```bash
npm run ios
```

---

## Step 3: Build for a physical device (internal testing)

Requires an Apple Developer account:

```bash
eas build --profile preview --platform ios
```

This produces an `.ipa` you can install via a link or TestFlight.

---

## Step 4: Build for App Store (production)

```bash
eas build --profile production --platform ios
```

1. EAS will prompt for credentials if needed
2. First build may take 15–25 minutes
3. Download the `.ipa` from the [Expo dashboard](https://expo.dev)

---

## Step 5: Submit to App Store Connect

### Option A: EAS Submit (recommended)

1. Create the app in [App Store Connect](https://appstoreconnect.apple.com)
2. Update `eas.json` with your details:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your@email.com",
      "ascAppId": "1234567890",
      "appleTeamId": "XXXXXXXXXX"
    }
  }
}
```

3. Submit:

```bash
eas submit --platform ios --latest
```

### Option B: Manual upload

1. Download the `.ipa` from the Expo dashboard
2. Use **Transporter** (Mac App Store) or **Xcode** → Window → Organizer
3. Upload to App Store Connect

---

## Step 6: App Store Connect setup

1. **App Store Connect** → Your App → App Store tab
2. Add screenshots (required sizes: 6.5", 5.5", iPad Pro)
3. Fill in description (see `APP_STORE_DESCRIPTION.md`)
4. Set pricing, age rating, etc.
5. Submit for review

---

## Quick reference

| Goal                    | Command                                              |
|-------------------------|------------------------------------------------------|
| Run in simulator        | `npm run ios`                                        |
| Build for simulator     | `eas build -p ios --profile development`             |
| Build for device/test   | `eas build -p ios --profile preview`                |
| Build for App Store     | `eas build -p ios --profile production`              |
| Submit to App Store     | `eas submit -p ios --latest`                          |
| Check build status      | [expo.dev/accounts/.../projects](https://expo.dev)   |

---

## Troubleshooting

**"No valid credentials"**  
Run `eas credentials` and configure your Apple Developer account.

**"Bundle identifier already in use"**  
Change `bundleIdentifier` in `app.json` to a unique value.

**Build fails**  
Check the build logs on expo.dev for the exact error.
