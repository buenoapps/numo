/**
 * Resolve a theme color for the currently active user.
 *
 * The lookup goes: explicit prop override -> active user's monster palette
 * for the current light/dark scheme -> default (purple) palette as a safe
 * fallback when no user is active yet (e.g., onboarding).
 */

import { DEFAULT_MONSTER, MONSTER_PALETTES, type Palette } from '@/constants/monsters';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettings } from '@/lib/settings';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof Palette,
) {
  const scheme = useColorScheme();
  const theme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  const { effectiveMonster } = useSettings();
  const colorFromProps = props[theme];
  if (colorFromProps) return colorFromProps;
  return MONSTER_PALETTES[effectiveMonster ?? DEFAULT_MONSTER][theme][colorName];
}
