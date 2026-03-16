# DroneFarm

**Code. Fly. Grow.**

A programming game where you write simple Python-like commands to control a drone that automates farming tasks. Learn to code while playing—modern, playful, and premium.

## Features

- **Python-like scripting** — `move_up()`, `water()`, `scan()`, `for` loops, `if` conditionals
- **Visual feedback** — Watch your drone move and farm in real-time
- **13 missions** — 10 tutorials + 3 advanced optimization challenges
- **Cross-platform** — iOS, Android, Web
- **Progress saved locally** — Stars, badges, achievements

## Quick Start

```bash
# Install
cd DroneFarm
npm install

# Run
npm run web      # Browser at http://localhost:8081
npm run ios      # iOS Simulator
npm run android  # Android emulator
```

## API Reference

### Movement
| Function | Description |
|----------|-------------|
| `move_up()` | Move drone up one cell |
| `move_down()` | Move drone down one cell |
| `move_left()` | Move drone left one cell |
| `move_right()` | Move drone right one cell |

### Farming
| Function | Description |
|----------|-------------|
| `scan()` | Scan current tile |
| `water()` | Water dry crop |
| `spray()` | Spray weed |
| `collect_sample()` | Collect plant sample |
| `recharge()` | Recharge at station |

### Control
| Syntax | Description |
|--------|-------------|
| `if crop_is_dry:` | Water only when needed |
| `if weed_detected:` | Spray only when weed present |
| `for i in range(5):` | Loop 5 times |
| `while battery > 20:` | Loop while condition true |
| `print("msg")` | Log to console |

## Project Structure

```
DroneFarm/
├── app/                 # Expo Router screens
│   ├── index.tsx        # Splash
│   ├── onboarding.tsx   # Onboarding carousel
│   ├── (tabs)/          # Home, Profile, Settings
│   ├── mission/[id].tsx # Mission detail
│   ├── simulator/[id].tsx# Coding simulator
│   └── results/[id].tsx # Mission results
├── src/
│   ├── interpreter/     # Parser & executor
│   ├── game/            # Farm utils, game runner
│   ├── data/            # Missions JSON
│   └── store/           # Zustand state
├── components/          # Reusable UI
└── constants/           # Theme, colors
```

## Tech Stack

- **Expo** — React Native + web
- **Expo Router** — File-based routing
- **Zustand** — State management
- **React Native Reanimated** — Animations
- **TypeScript** — Full type safety

## Tests

```bash
npm test
```

## License

MIT
