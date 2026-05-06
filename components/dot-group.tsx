import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  count: number;
  removed?: number;
  color?: string;
  size?: number;
};

const COLS = 5;

export function DotGroup({ count, removed = 0, color, size = 22 }: Props) {
  const themeColor = useThemeColor({}, 'primary');
  const shadow = useThemeColor({}, 'cardShadow');
  const wrong = useThemeColor({}, 'wrong');
  const dotColor = color ?? themeColor;
  const rows = Math.max(1, Math.ceil(Math.max(count, 1) / COLS));
  const containerWidth = COLS * (size + 8);
  const containerHeight = rows * (size + 8);
  const firstRemoved = Math.max(0, count - removed);

  if (count <= 0) {
    return <View style={{ width: containerWidth, height: size + 8 }} />;
  }

  return (
    <View style={[styles.wrap, { width: containerWidth, minHeight: containerHeight }]}>
      {Array.from({ length: count }).map((_, i) => {
        const isRemoved = i >= firstRemoved;
        return (
          <Animated.View
            key={`dot-${count}-${removed}-${i}`}
            entering={FadeIn.delay(i * 60).duration(220)}
            style={[
              styles.cell,
              {
                width: size,
                height: size,
              },
            ]}
          >
            <View
              style={[
                styles.dot,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: dotColor,
                  shadowColor: shadow,
                  opacity: isRemoved ? 0.25 : 1,
                },
              ]}
            />
            {isRemoved ? (
              <View
                style={[
                  styles.strike,
                  {
                    width: size * 1.1,
                    backgroundColor: wrong,
                  },
                ]}
              />
            ) : null}
          </Animated.View>
        );
      })}
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
  cell: {
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  strike: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
    transform: [{ rotate: '-20deg' }],
  },
});
