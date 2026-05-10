import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useT } from '@/lib/i18n';

type Props = {
  streak: number;
  max?: number;
};

export function StreakBar({ streak, max = 5 }: Props) {
  const t = useT();
  const accent = useThemeColor({}, 'accent');
  const muted = useThemeColor({}, 'textMuted');
  const text = useThemeColor({}, 'text');
  const filled = Math.min(streak, max);

  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, i) => {
        const on = i < filled;
        return on ? (
          <Animated.Text
            key={`star-on-${i}`}
            entering={ZoomIn.springify().damping(10)}
            style={[styles.star, { color: accent }]}
          >
            ★
          </Animated.Text>
        ) : (
          <Text key={`star-off-${i}`} style={[styles.star, { color: muted, opacity: 0.4 }]}>
            ★
          </Text>
        );
      })}
      {streak >= max ? (
        <Text style={[styles.label, { color: text, fontFamily: Fonts?.rounded }]}>{t('onFire')}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 28,
    marginHorizontal: 2,
    lineHeight: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
