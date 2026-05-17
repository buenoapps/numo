import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Animation primitives for the Skia-rendered confetti burst.
 *
 * Reanimated lives behind this module so the confetti component itself can
 * stay free of Reanimated imports. The progress value is a single shared
 * clock (0 → 1 over `duration`); every particle derives its transform and
 * opacity from it via `useBurstParticle`.
 */

export type BurstParticleSpec = {
  cx: number;
  size: number;
  drift: number;
  rotateEnd: number;
  delayFrac: number;
  durFrac: number;
};

export function useBurstProgress(
  triggerKey: string | number,
  duration: number,
): SharedValue<number> {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: Easing.linear });
    return () => cancelAnimation(progress);
  }, [progress, duration, triggerKey]);
  return progress;
}

export function useBurstParticle(
  spec: BurstParticleSpec,
  screenH: number,
  progress: SharedValue<number>,
) {
  const { cx, drift, rotateEnd, delayFrac, durFrac } = spec;
  const startY = -40;
  const endY = screenH + 40;

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

  return { transform, opacity };
}
