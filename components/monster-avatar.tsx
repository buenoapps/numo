import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { MONSTER_PALETTES, type Monster } from '@/constants/monsters';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  monster: Monster;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Small profile pic — a coloured circle in the monster's primary with two
 * little white eyes and a `+` belly. Used in the top-left Home widget, the
 * switch-user list, and the onboarding picker.
 */
export function MonsterAvatar({ monster, size = 40, style }: Props) {
  const scheme = useColorScheme();
  const theme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  const palette = MONSTER_PALETTES[monster][theme];

  const eye = size * 0.18;
  const pupil = eye * 0.45;
  const plus = size * 0.32;

  return (
    <View
      style={[
        styles.body,
        {
          width: size,
          height: size,
          borderRadius: size * 0.3,
          backgroundColor: palette.primary,
          shadowColor: palette.primaryDeep,
        },
        style,
      ]}
    >
      <View style={[styles.eyesRow, { top: size * 0.22, gap: size * 0.08 }]}>
        <Eye size={eye} pupilSize={pupil} bg={palette.card} />
        <Eye size={eye} pupilSize={pupil} bg={palette.card} />
      </View>
      <View
        style={[
          styles.belly,
          {
            width: plus * 1.3,
            height: plus * 1.3,
            borderRadius: plus * 0.65,
            backgroundColor: palette.card,
            bottom: size * 0.16,
          },
        ]}
      >
        <Text
          style={{
            fontSize: plus * 0.95,
            lineHeight: plus * 1.05,
            fontWeight: '900',
            color: palette.primary,
            fontFamily: Fonts?.rounded,
          }}
        >
          +
        </Text>
      </View>
    </View>
  );
}

function Eye({ size, pupilSize, bg }: { size: number; pupilSize: number; bg: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: pupilSize,
          height: pupilSize,
          borderRadius: pupilSize / 2,
          backgroundColor: '#1F1B2E',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  eyesRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  belly: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
