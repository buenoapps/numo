import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1F1B2E',
    background: '#F5F3FF',
    primary: '#7C3AED',
    primaryDeep: '#5B21B6',
    card: '#FFFFFF',
    cardShadow: '#C4B5FD',
    accent: '#FACC15',
    correct: '#22C55E',
    wrong: '#EF4444',
    textMuted: '#6B6486',
    floatingNumber: '#E9D5FF',
  },
  dark: {
    text: '#F5F3FF',
    background: '#1E1B2E',
    primary: '#A78BFA',
    primaryDeep: '#7C3AED',
    card: '#2A2640',
    cardShadow: '#000000',
    accent: '#FDE047',
    correct: '#4ADE80',
    wrong: '#F87171',
    textMuted: '#B5AECF',
    floatingNumber: '#3B2F5C',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
