/**
 * Six monsters, each with its own light + dark palette. The active user's
 * `monster` field drives every `useThemeColor` lookup, so picking a monster
 * during onboarding retints the entire app.
 *
 * Per-monster keys map 1:1 to the legacy `Colors.light` / `Colors.dark`
 * shape so existing callers don't change.
 */

export const MONSTERS = ['purple', 'red', 'blue', 'green', 'orange', 'pink'] as const;
export type Monster = (typeof MONSTERS)[number];

export type Palette = {
  text: string;
  background: string;
  primary: string;
  primaryDeep: string;
  card: string;
  cardShadow: string;
  accent: string;
  correct: string;
  wrong: string;
  textMuted: string;
  floatingNumber: string;
};

export type MonsterPalette = { light: Palette; dark: Palette };

// Shared across monsters (the meaning of "correct"/"wrong" doesn't change with theme).
const SHARED = {
  light: {
    text: '#1F1B2E',
    textMuted: '#6B6486',
    correct: '#22C55E',
    wrong: '#EF4444',
  },
  dark: {
    text: '#F5F3FF',
    textMuted: '#B5AECF',
    correct: '#4ADE80',
    wrong: '#F87171',
  },
} as const;

type PaletteSeed = {
  light: Pick<Palette, 'background' | 'primary' | 'primaryDeep' | 'card' | 'cardShadow' | 'accent' | 'floatingNumber'>;
  dark: Pick<Palette, 'background' | 'primary' | 'primaryDeep' | 'card' | 'cardShadow' | 'accent' | 'floatingNumber'>;
};

const SEEDS: Record<Monster, PaletteSeed> = {
  purple: {
    light: {
      background: '#F5F3FF',
      primary: '#7C3AED',
      primaryDeep: '#5B21B6',
      card: '#FFFFFF',
      cardShadow: '#C4B5FD',
      accent: '#FACC15',
      floatingNumber: '#E9D5FF',
    },
    dark: {
      background: '#1E1B2E',
      primary: '#A78BFA',
      primaryDeep: '#7C3AED',
      card: '#2A2640',
      cardShadow: '#000000',
      accent: '#FDE047',
      floatingNumber: '#3B2F5C',
    },
  },
  red: {
    light: {
      background: '#FEF2F2',
      primary: '#EF4444',
      primaryDeep: '#B91C1C',
      card: '#FFFFFF',
      cardShadow: '#FCA5A5',
      accent: '#FACC15',
      floatingNumber: '#FECACA',
    },
    dark: {
      background: '#2A1717',
      primary: '#F87171',
      primaryDeep: '#EF4444',
      card: '#3A2020',
      cardShadow: '#000000',
      accent: '#FDE047',
      floatingNumber: '#5B2F2F',
    },
  },
  blue: {
    light: {
      background: '#EFF6FF',
      primary: '#2563EB',
      primaryDeep: '#1D4ED8',
      card: '#FFFFFF',
      cardShadow: '#93C5FD',
      accent: '#FBBF24',
      floatingNumber: '#BFDBFE',
    },
    dark: {
      background: '#181E2D',
      primary: '#60A5FA',
      primaryDeep: '#2563EB',
      card: '#252C40',
      cardShadow: '#000000',
      accent: '#FCD34D',
      floatingNumber: '#2C3553',
    },
  },
  green: {
    light: {
      background: '#ECFDF5',
      primary: '#10B981',
      primaryDeep: '#047857',
      card: '#FFFFFF',
      cardShadow: '#6EE7B7',
      accent: '#FACC15',
      floatingNumber: '#A7F3D0',
    },
    dark: {
      background: '#152722',
      primary: '#34D399',
      primaryDeep: '#10B981',
      card: '#1F3530',
      cardShadow: '#000000',
      accent: '#FDE047',
      floatingNumber: '#234B43',
    },
  },
  orange: {
    light: {
      background: '#FFF7ED',
      primary: '#F97316',
      primaryDeep: '#C2410C',
      card: '#FFFFFF',
      cardShadow: '#FDBA74',
      accent: '#FACC15',
      floatingNumber: '#FED7AA',
    },
    dark: {
      background: '#2A1B0F',
      primary: '#FB923C',
      primaryDeep: '#F97316',
      card: '#3A2718',
      cardShadow: '#000000',
      accent: '#FDE047',
      floatingNumber: '#5B3A22',
    },
  },
  pink: {
    light: {
      background: '#FDF2F8',
      primary: '#DB2777',
      primaryDeep: '#9D174D',
      card: '#FFFFFF',
      cardShadow: '#F9A8D4',
      accent: '#FCD34D',
      floatingNumber: '#FBCFE8',
    },
    dark: {
      background: '#2A1622',
      primary: '#F472B6',
      primaryDeep: '#DB2777',
      card: '#3A1F32',
      cardShadow: '#000000',
      accent: '#FDE047',
      floatingNumber: '#5B2F4E',
    },
  },
};

function buildPalette(seed: PaletteSeed): MonsterPalette {
  return {
    light: { ...seed.light, ...SHARED.light },
    dark: { ...seed.dark, ...SHARED.dark },
  };
}

export const MONSTER_PALETTES: Record<Monster, MonsterPalette> = {
  purple: buildPalette(SEEDS.purple),
  red: buildPalette(SEEDS.red),
  blue: buildPalette(SEEDS.blue),
  green: buildPalette(SEEDS.green),
  orange: buildPalette(SEEDS.orange),
  pink: buildPalette(SEEDS.pink),
};

export const DEFAULT_MONSTER: Monster = 'purple';
