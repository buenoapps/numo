import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type FloatSpec = {
  digit: number;
  top: string;
  left: string;
  size: number;
  drift: number;
  duration: number;
  delay: number;
};

function buildSpecs(count: number): FloatSpec[] {
  const out: FloatSpec[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      digit: Math.floor(Math.random() * 10),
      top: `${Math.floor(Math.random() * 85)}%`,
      left: `${Math.floor(Math.random() * 85)}%`,
      size: 48 + Math.floor(Math.random() * 48),
      drift: 20 + Math.floor(Math.random() * 40),
      duration: 4000 + Math.floor(Math.random() * 3000),
      delay: Math.floor(Math.random() * 2000),
    });
  }
  return out;
}

export function FloatingNumbers({ count = 9 }: { count?: number }) {
  const specs = useMemo(() => buildSpecs(count), [count]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {specs.map((s, i) => (
        <FloatingNumber key={`fn-${i}`} spec={s} />
      ))}
    </View>
  );
}

function FloatingNumber({ spec }: { spec: FloatSpec }) {
  const color = useThemeColor({}, 'floatingNumber');
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withDelay(
      spec.delay,
      withRepeat(
        withSequence(
          withTiming(-spec.drift, { duration: spec.duration }),
          withTiming(0, { duration: spec.duration }),
        ),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(offset);
  }, [offset, spec.delay, spec.drift, spec.duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.Text
      style={[
        styles.numeral,
        {
          top: spec.top as `${number}%`,
          left: spec.left as `${number}%`,
          fontSize: spec.size,
          lineHeight: spec.size * 1.05,
          color,
          fontFamily: Fonts?.rounded,
        },
        animatedStyle,
      ]}
    >
      {spec.digit}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  numeral: {
    position: 'absolute',
    fontWeight: '900',
    opacity: 0.5,
  },
});
