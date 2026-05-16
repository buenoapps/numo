import { Platform } from 'react-native';

import { MONSTER_PALETTES, DEFAULT_MONSTER } from '@/constants/monsters';

/**
 * Back-compat re-export so code that still imports `Colors` keeps working
 * with the default (purple) palette. New code should go through
 * `useThemeColor` instead, which honours the active user's monster.
 */
export const Colors = MONSTER_PALETTES[DEFAULT_MONSTER];

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
