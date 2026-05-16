import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/**
 * One-shot confetti burst. Drop on top of any screen with `pointerEvents="none"`
 * so it doesn't block taps. Use the `triggerKey` prop with a counter — every
 * change re-mounts the component and re-runs the animation.
 */
type Props = {
  triggerKey: number | string;
  count?: number;
  /** ms — total duration of the burst before particles are off-screen. */
  duration?: number;
};

const COLORS = ['#FACC15', '#22C55E', '#3B82F6', '#EC4899', '#F97316', '#7C3AED', '#FFFFFF'];

export function Confetti({ triggerKey, count = 128, duration = 2200 }: Props) {
  // Re-randomize particles only when the key changes, so a single burst
  // keeps stable positions/colors for its lifetime.
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `${triggerKey}-${i}`,
        leftPct: Math.random() * 100,
        size: 8 + Math.floor(Math.random() * 8),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        drift: -40 + Math.random() * 80,
        rotateEnd: -360 + Math.random() * 720,
        delay: Math.floor(Math.random() * 250),
        duration: Math.floor(duration * (0.7 + Math.random() * 0.5)),
      })),
    [triggerKey, count, duration],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </View>
  );
}

function Particle({
  id: _id,
  leftPct,
  size,
  color,
  drift,
  rotateEnd,
  delay,
  duration,
}: {
  id: string;
  leftPct: number;
  size: number;
  color: string;
  drift: number;
  rotateEnd: number;
  delay: number;
  duration: number;
}) {
  const { height } = useWindowDimensions();

  const y = useSharedValue(-40);
  const x = useSharedValue(0);
  const rot = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withTiming(height + 40, { duration, easing: Easing.in(Easing.cubic) }),
    );
    x.value = withDelay(delay, withTiming(drift, { duration }));
    rot.value = withDelay(delay, withTiming(rotateEnd, { duration }));
    opacity.value = withDelay(delay + duration - 400, withTiming(0, { duration: 400 }));
    return () => {
      cancelAnimation(y);
      cancelAnimation(x);
      cancelAnimation(rot);
      cancelAnimation(opacity);
    };
    // Animation parameters are stable for a single burst (memoized upstream).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { translateX: x.value },
      { rotate: `${rot.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${leftPct}%`,
          width: size,
          height: size * 0.5,
          backgroundColor: color,
          borderRadius: 2,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
  },
});
