# Numo

A playful math app for very young learners. Numo, a friendly purple monster, helps kids practice addition, subtraction, and number recognition through a tap-to-answer game with big buttons, dot-based visuals, and a celebrating mascot.

Built with Expo Router on top of React Native + TypeScript.

## Status

Active development. v1 ships:

- Addition with sums up to 10.
- Subtraction with results in 0–10 (parent-controlled opt-in).
- Numbers 1–10 grid that reads each digit aloud in the system language.
- Persisted settings (subtraction toggle, sounds toggle).
- Localized UI for English, German, Spanish, French, Italian, Chinese, Japanese — auto-detected from the system locale.
- Success chime + uniform haptic feedback on every answer tap.
- GitHub Actions CI: lint, typecheck, unit tests, web build.

## Tech stack

- Expo SDK 54, expo-router 6
- React 19, React Native 0.81, TypeScript strict
- New Architecture and React Compiler enabled
- `react-native-reanimated` for all animations
- `expo-audio` for the success chime, `expo-speech` for digit TTS, `expo-haptics` for vibration
- `i18n-js` + `expo-localization` for translations
- `@react-native-async-storage/async-storage` for persisted settings
- `jest-expo` for unit tests

## Getting started

Prerequisites: Node 20+ and npm. iOS Simulator (Xcode) or Android Emulator (Android Studio) for native runs.

```bash
npm install
npm start
```

Then press `w` for web, `i` for iOS, or `a` for Android in the Expo CLI. The web target is the easiest local sanity check.

Direct platform shortcuts:

```bash
npm run ios       # Expo on iOS Simulator
npm run android   # Expo on Android Emulator
npm run web       # Expo on the browser
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server. |
| `npm run ios` / `android` / `web` | Start dev server for a specific platform. |
| `npm run lint` | Run `expo lint` (ESLint + `eslint-config-expo`). |
| `npm run typecheck` | Run `tsc --noEmit`. |
| `npm test` | Run the jest suite (`jest-expo` preset). |
| `npm run build:web` | Build the static web bundle via `expo export -p web`. Used in CI as a Metro/TS smoke test. |
| `npm run build` | `eas build --platform ios` — native iOS build, requires EAS credentials. Not run in CI. |
| `npm run submit` | `eas submit` for the latest iOS build. |
| `npm run reset-project` | Move the current `app/` aside to `app-example/` and create a blank one (Expo template script; rarely needed). |

## Project layout

```
app/                      expo-router routes
  _layout.tsx             Root Stack, SettingsProvider, i18n init
  index.tsx               Home screen + CTAs
  play.tsx                Game screen (?op=add|sub)
  numbers.tsx             1-10 grid that reads digits aloud
  settings.tsx            Modal with parental toggles
components/               Reusable UI building blocks
  numo.tsx                Mascot (placeholder art, mood prop)
  dot-group.tsx           Visual addends; supports `removed` for subtraction
  answer-button.tsx       Big rounded answer with correct/wrong feedback
  streak-bar.tsx          Star streak indicator
  floating-numbers.tsx    Decorative drifting numerals
  themed-text.tsx, themed-view.tsx
lib/
  problems.ts             Pure problem generator (add + sub)
  settings.ts             SettingsProvider + AsyncStorage persistence
  i18n.ts                 Translations + locale detection
  sounds.ts               useSuccessSound() hook (expo-audio)
  __tests__/              Jest test suites
constants/theme.ts        Purple palette + Fonts
hooks/                    use-color-scheme + use-theme-color
assets/
  images/                 App icons, splash, favicon
  sounds/success.wav      Generated success chime (~20 KB)
.github/workflows/ci.yml  Lint, typecheck, test, build on main + PRs
```

## Languages

The active locale is selected once on launch from `Localization.getLocales()` (`expo-localization`) and falls back to English if the system locale isn't supported.

Supported: `en`, `de`, `es`, `fr`, `it`, `zh`, `ja`.

All visible strings are keyed in `lib/i18n.ts` and accessed through `t('key')`. The numbers screen also uses `getSpeechLocale()` to pick the right TTS voice.

## Settings

The parental settings modal lives at `/settings` (gear icon on Home) and exposes:

- **Subtraction** — opt-in; default off. When on, the Home screen shows two CTAs.
- **Sounds** — default on. Controls the success chime; the haptic on every answer tap is independent.

Both flags are persisted in AsyncStorage under the key `numo.settings.v1` via `lib/settings.ts`.

## Mascot art

The Numo character is currently a styled-View placeholder (purple body, yellow-star antennae, white eyes, "+" belly) so the app ships without external assets. To swap in real art, edit `components/numo.tsx` only — the rest of the app uses the component through its `mood` and `size` props and doesn't care what's inside.

## App Store metadata

The App Store listing (title, subtitle, description, keywords) lives in `store.config.json` at the repo root and is managed via [EAS Metadata](https://docs.expo.dev/eas/metadata/). Same 7 locales as the in-app UI. `eas.json` points at it under `submit.production.ios.metadataPath`.

```bash
eas metadata:push --profile production    # upload local file to App Store Connect
eas metadata:pull --profile production    # download current ASC values into the file
```

Before the first push you'll also need: an App Store Connect API key (via `eas credentials`), an `ascAppId` in `eas.json`, and a real privacy policy / support URL added to each `info` block.

## Testing & CI

```bash
npm run lint
npm run typecheck
npm test -- --ci
npm run build:web
```

CI runs the same four steps in `.github/workflows/ci.yml` on every push to `main` and every pull request against `main`. Test files live under `lib/__tests__/`.

## License

TBD.
