import { Canvas, Group, RoundedRect } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

import {
  type BurstParticleSpec,
  useBurstParticle,
  useBurstProgress,
} from '@/lib/use-burst';

/**
 * One-shot confetti burst. Drop on top of any screen with `pointerEvents="none"`
 * so it doesn't block taps. Use the `triggerKey` prop with a counter — every
 * change re-mounts the component and re-runs the animation.
 *
 * Rendered through a single Skia <Canvas> so all particles composite in one
 * GPU pass instead of one Animated.View per particle. All animation state
 * lives in `@/lib/use-burst`.
 */
type Props = {
  triggerKey: number | string;
  count?: number;
  /** ms — total duration of the burst before particles are off-screen. */
  duration?: number;
};

const COLORS = ['#FACC15', '#22C55E', '#3B82F6', '#EC4899', '#F97316', '#7C3AED', '#FFFFFF'];

type Particle = BurstParticleSpec & { id: string; color: string };

export function Confetti({ triggerKey, count = 128, duration = 2200 }: Props) {
  const { width, height } = useWindowDimensions();

  const particles = useMemo<Particle[]>(
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

  const progress = useBurstProgress(triggerKey, duration);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <ParticleNode key={p.id} spec={p} color={p.color} screenH={height} progress={progress} />
      ))}
    </Canvas>
  );
}

function ParticleNode({
  spec,
  color,
  screenH,
  progress,
}: {
  spec: BurstParticleSpec;
  color: string;
  screenH: number;
  progress: ReturnType<typeof useBurstProgress>;
}) {
  const { size } = spec;
  const halfW = size / 2;
  const halfH = size * 0.25;
  const { transform, opacity } = useBurstParticle(spec, screenH, progress);

  return (
    <Group transform={transform} opacity={opacity}>
      <RoundedRect x={-halfW} y={-halfH} width={size} height={size * 0.5} r={2} color={color} />
    </Group>
  );
}
