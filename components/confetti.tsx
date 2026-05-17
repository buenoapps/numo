import { Canvas, Group, RoundedRect } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  cancelAnimation,
  Easing,
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * One-shot confetti burst. Drop on top of any screen with `pointerEvents="none"`
 * so it doesn't block taps. Use the `triggerKey` prop with a counter — every
 * change re-mounts the component and re-runs the animation.
 *
 * Rendered through a single Skia <Canvas> so all particles composite in one
 * GPU pass instead of one Animated.View per particle.
 */
type Props = {
  triggerKey: number | string;
  count?: number;
  /** ms — total duration of the burst before particles are off-screen. */
  duration?: number;
};

const COLORS = ['#FACC15', '#22C55E', '#3B82F6', '#EC4899', '#F97316', '#7C3AED', '#FFFFFF'];

type ParticleSpec = {
  id: string;
  cx: number;
  size: number;
  color: string;
  drift: number;
  rotateEnd: number;
  delayFrac: number;
  durFrac: number;
};

export function Confetti({ triggerKey, count = 128, duration = 2200 }: Props) {
  const { width, height } = useWindowDimensions();

  const particles = useMemo<ParticleSpec[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `${triggerKey}-${i}`,
        cx: Math.random() * width,
        size: 8 + Math.floor(Math.random() * 8),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        drift: -40 + Math.random() * 80,
        rotateEnd: (-360 + Math.random() * 720) * (Math.PI / 180),
        delayFrac: Math.random() * 0.12,
        durFrac: 0.7 + Math.random() * 0.5,
      })),
    [triggerKey, count, width],
  );

  // Single shared clock for every particle. Once it lands at 1 the derived
  // values stop updating, so Skia stops issuing frames.
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: Easing.linear });
    return () => cancelAnimation(progress);
  }, [progress, duration]);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} spec={p} screenH={height} progress={progress} />
      ))}
    </Canvas>
  );
}

function Particle({
  spec,
  screenH,
  progress,
}: {
  spec: ParticleSpec;
  screenH: number;
  progress: SharedValue<number>;
}) {
  const { cx, size, color, drift, rotateEnd, delayFrac, durFrac } = spec;
  const startY = -40;
  const endY = screenH + 40;
  const halfW = size / 2;
  const halfH = size * 0.25;

  const transform = useDerivedValue(() => {
    const local = (progress.value - delayFrac) / durFrac;
    const t = local < 0 ? 0 : local > 1 ? 1 : local;
    const eased = t * t * t;
    return [
      { translateX: cx + drift * t },
      { translateY: startY + (endY - startY) * eased },
      { rotate: rotateEnd * t },
    ];
  });

  const opacity = useDerivedValue(() => {
    const local = (progress.value - delayFrac) / durFrac;
    if (local <= 0) return 1;
    if (local >= 1) return 0;
    return local < 0.82 ? 1 : 1 - (local - 0.82) / 0.18;
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <RoundedRect x={-halfW} y={-halfH} width={size} height={size * 0.5} r={2} color={color} />
    </Group>
  );
}
