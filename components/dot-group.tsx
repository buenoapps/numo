import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  count: number;
  color?: string;
  size?: number;
};

const COLS = 5;

export function DotGroup({ count, color, size = 22 }: Props) {
  const themeColor = useThemeColor({}, 'primary');
  const shadow = useThemeColor({}, 'cardShadow');
  const dotColor = color ?? themeColor;
  const rows = Math.max(1, Math.ceil(Math.max(count, 1) / COLS));
  const containerWidth = COLS * (size + 8);
  const containerHeight = rows * (size + 8);

  if (count <= 0) {
    return <View style={{ width: containerWidth, height: size + 8 }} />;
  }

  return (
    <View style={[styles.wrap, { width: containerWidth, minHeight: containerHeight }]}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={`dot-${count}-${i}`}
          entering={FadeIn.delay(i * 60).duration(220)}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: dotColor,
              shadowColor: shadow,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    margin: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
});
