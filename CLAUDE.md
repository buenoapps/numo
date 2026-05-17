# CLAUDE.md

Operational notes for Claude Code agents working in this repo. Read `README.md` for the product overview; this file is about how to be productive without re-discovering the codebase.

## Project in one paragraph

Numo is an Expo Router app (Expo SDK 54, RN 0.81, TS strict) for early math practice. Two game modes (addition always, subtraction opt-in via parental settings) plus a Numbers screen that reads digits aloud. Persisted settings via AsyncStorage. Localized for 7 languages with auto-detect. Mascot is a placeholder built from styled Views.

## Daily commands

Run all four before pushing — CI runs the same:

```bash
npm run lint
npm run typecheck
npm test -- --ci
npm run build:web
```

Other commands:

- `npm install` — first time and after dependency changes.
- `npm start` — Expo dev server. Press `w` for the web sanity check (most reliable here).
- `npm run ios` / `android` / `web` — direct platform launchers.

**Do not** run `npm run build` for verification. It's `eas build --platform ios`, requires credentials, and takes ~10 minutes. Use `npm run build:web` instead — same Metro/TS exercise, much faster.

## Architecture map

`app/` (expo-router file-based routing):

- `_layout.tsx` — Root Stack. Wraps the tree in `SettingsProvider` and imports `@/lib/i18n` so the locale is set before any screen renders.
- `index.tsx` — Home. Floating gear → `/settings`. Single "Let's Play!" CTA, or two CTAs ("Add!" + "Take away!") when subtraction is enabled. A "Numbers!" CTA below routes to `/numbers`.
- `play.tsx` — Game loop. Reads `?op=add|sub`. Resets streak when `op` changes. Plays the success chime on correct answers (gated by `soundCorrectEnabled`) and a soft "uh-oh" chime on wrong ones (gated by `soundWrongEnabled`). Haptics use distinct `NotificationFeedbackType.Success` vs `.Error` patterns, each gated by their own flag (`hapticCorrectEnabled`, `hapticWrongEnabled`).
- `numbers.tsx` — 5×2 grid of 1–10. Each tile fires a haptic and `Speech.speak(value, { language: getSpeechLocale() })`.
- `settings.tsx` — Modal. Subtraction toggle, Sounds toggle, "more levels coming soon" card.

`components/`:

- `numo.tsx` — Mascot. Placeholder built from Views. `mood: 'idle' | 'happy' | 'thinking' | 'oops'` drives Reanimated shared values. **Single swap point** for real art when it lands.
- `dot-group.tsx` — Visual addends. `count` dots, `removed?` ghosts and strikes through the trailing N (subtraction).
- `answer-button.tsx` — Press scale, correct flash, wrong shake. Labels via `t()`.
- `streak-bar.tsx` — Star glyphs. `entering={ZoomIn.springify()}` on newly-filled stars.
- `floating-numbers.tsx` — Drifting background numerals; `pointerEvents="none"`.
- `themed-text.tsx` / `themed-view.tsx` — Theme-aware wrappers.

`lib/`:

- `problems.ts` — Pure `generateProblem(op, rng?)`. `op: 'add' | 'sub'`. Constraints keep the answer in `0..10`. Distractors are nearby integers, shuffled, unique. Tested in `lib/__tests__/problems.test.ts` with a seeded RNG.
- `settings.ts` — `SettingsProvider` + `useSettings()`. Storage key: `numo.store.v4` (multi-user). Per-user settings carry the page configs, language override, and four independent feedback flags: `soundCorrectEnabled` (defaults on), `soundWrongEnabled`, `hapticCorrectEnabled`, `hapticWrongEnabled` (all default off). `soundCorrectEnabled` also gates TTS reading of problems aloud, so it acts as the master "Numo speaks" switch.
- `i18n.ts` — i18n-js instance. Auto-selects locale on import. Exports `t(key, options?)` and `getSpeechLocale()`.
- `sounds.ts` — `useSuccessSound()` and `useWrongSound()` hooks. Wrap `expo-audio`'s `useAudioPlayer`. Respect `soundCorrectEnabled` and `soundWrongEnabled`. Failures swallowed.

`constants/theme.ts` — Purple palette (`primary`, `accent`, `correct`, `wrong`, etc.) on both `light` and `dark`. Plus `Fonts` (rounded for kid-friendly look).

`assets/sounds/success.wav` — Generated chime (~20 KB, rising C-E-G). Bundled, replaceable.

`.github/workflows/ci.yml` — Lint, typecheck, test, build:web on push to `main` and PRs against `main`.

`store.config.json` — App Store Connect metadata (title, subtitle, description, keywords) for the same 7 locales the app supports. Pushed via `eas metadata:push`. Referenced from `eas.json` under `submit.production.ios.metadataPath`. Before the first push, the user has to add `ascAppId` and real `privacyPolicyUrl` / `supportUrl` values.

## Conventions

- TypeScript strict. Explicit prop types. No `any`.
- Path alias `@/*` → repo root. Use it consistently.
- **Animations**: Reanimated only. No RN `Animated`, no Lottie, no Skia, no SVG (no `react-native-svg`).
- **Strings**: every visible label and accessibility text flows through `t()` from `@/lib/i18n`. Adding a new label means adding it to all seven locale blocks (`en`, `de`, `es`, `fr`, `it`, `zh`, `ja`). The brand name "Numo" is intentionally not translated.
- **Settings**: persistent state lives in the single `Settings` shape in `lib/settings.ts`. Adding a setting means: extend the type, the `DEFAULTS`, and add a setter in the context value. No new AsyncStorage keys.
- **Mascot art**: still a placeholder. Real PNG art is one edit inside `components/numo.tsx` — don't sprinkle `<Image>` or `require(...)` calls elsewhere.
- **Tests**: under `lib/__tests__/`. Anything random must use a seeded RNG so the suite is deterministic.
- **Don't ship over-eager refactors**, hardcoded UI strings, or feature-flag scaffolding. The codebase is intentionally small.

## Branch & PR workflow

The standing instruction in this repo is to develop on `claude/numo-addition-app-2q4Ru` and always rebase on `main` before adding new commits. For each change request:

1. `git fetch origin main && git rebase origin/main`
2. Make changes in logical commits with clear messages.
3. Run the four CI checks locally (`lint`, `typecheck`, `test`, `build:web`).
4. `git push -u origin claude/numo-addition-app-2q4Ru`
5. Open a PR against `main` with the GitHub MCP (`mcp__github__create_pull_request`). Never push to `main` directly.

Repo scope for the GitHub MCP is `buenoapps/numo` only.

## Adding a new dependency

`npx expo install` may fail in restricted networks here. If it does, fall back to `npm install <pkg>@<version>` using the version Expo SDK 54 expects (check the Expo docs or other Expo SDK 54 projects). Always commit `package.json` + `package-lock.json` together.

## Things to avoid

- Running `eas build` in CI or for sanity checks.
- Adding native modules that aren't on Expo's bundled list without confirming SDK 54 compatibility.
- Hardcoded UI strings — use `t()`.
- Swapping the success chime asset casually; it's a small generated WAV bundled on purpose.
- Force-pushing to `main` or to other developers' branches.
