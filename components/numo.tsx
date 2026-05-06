import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type NumoMood = 'idle' | 'happy' | 'thinking' | 'oops';

type Props = {
  mood?: NumoMood;
  size?: number;
};

export function Numo({ mood = 'idle', size = 180 }: Props) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const accent = useThemeColor({}, 'accent');
  const card = useThemeColor({}, 'card');

  useEffect(() => {
    cancelAnimation(translateY);
    cancelAnimation(translateX);
    cancelAnimation(rotate);
    cancelAnimation(scale);
    translateY.value = 0;
    translateX.value = 0;
    rotate.value = 0;
    scale.value = 1;

    if (mood === 'idle') {
      translateY.value = withRepeat(
        withSequence(withTiming(-4, { duration: 1200 }), withTiming(0, { duration: 1200 })),
        -1,
        true,
      );
    } else if (mood === 'happy') {
      translateY.value = withSequence(
        withTiming(-24, { duration: 200 }),
        withSpring(0, { damping: 6 }),
      );
      scale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withSpring(1, { damping: 6 }),
      );
    } else if (mood === 'thinking') {
      rotate.value = withRepeat(
        withSequence(withTiming(3, { duration: 600 }), withTiming(-3, { duration: 600 })),
        -1,
        true,
      );
    } else if (mood === 'oops') {
      translateX.value = withSequence(
        withTiming(-6, { duration: 80 }),
        withTiming(6, { duration: 80 }),
        withTiming(-6, { duration: 80 }),
        withTiming(6, { duration: 80 }),
        withTiming(0, { duration: 80 }),
      );
    }

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(rotate);
      cancelAnimation(scale);
    };
  }, [mood, translateY, translateX, rotate, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const bodySize = size;
  const eyeSize = size * 0.22;
  const pupilSize = eyeSize * 0.45;
  const antennaHeight = size * 0.18;
  const starSize = size * 0.18;
  const plusSize = size * 0.32;

  return (
    <Animated.View style={[{ width: bodySize, height: bodySize + antennaHeight + starSize }, animatedStyle]}>
      {/* Antennae with stars */}
      <View style={[styles.antennaeRow, { height: antennaHeight + starSize }]}>
        <Antenna height={antennaHeight} starSize={starSize} stalkColor={primaryDeep} starColor={accent} />
        <View style={{ width: bodySize * 0.18 }} />
        <Antenna height={antennaHeight} starSize={starSize} stalkColor={primaryDeep} starColor={accent} />
      </View>

      {/* Body */}
      <View
        style={[
          styles.body,
          {
            width: bodySize,
            height: bodySize,
            borderRadius: bodySize * 0.32,
            backgroundColor: primary,
            shadowColor: primaryDeep,
          },
        ]}
      >
        {/* Eyes */}
        <View style={[styles.eyesRow, { top: bodySize * 0.2 }]}>
          <Eye size={eyeSize} pupilSize={pupilSize} bg={card} />
          <View style={{ width: bodySize * 0.1 }} />
          <Eye size={eyeSize} pupilSize={pupilSize} bg={card} />
        </View>

        {/* Plus belly */}
        <View
          style={[
            styles.belly,
            {
              width: plusSize * 1.4,
              height: plusSize * 1.4,
              borderRadius: plusSize * 0.7,
              backgroundColor: card,
              bottom: bodySize * 0.12,
            },
          ]}
        >
          <Text
            style={{
              fontSize: plusSize,
              lineHeight: plusSize * 1.05,
              fontWeight: '900',
              color: primary,
              fontFamily: Fonts?.rounded,
            }}
          >
            +
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function Antenna({
  height,
  starSize,
  stalkColor,
  starColor,
}: {
  height: number;
  starSize: number;
  stalkColor: string;
  starColor: string;
}) {
  const wiggle = useSharedValue(0);
  useEffect(() => {
    wiggle.value = withDelay(
      Math.random() * 600,
      withRepeat(
        withSequence(withTiming(-6, { duration: 900 }), withTiming(6, { duration: 900 })),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(wiggle);
  }, [wiggle]);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wiggle.value}deg` }],
  }));
  return (
    <Animated.View style={[styles.antenna, style]}>
      <Text style={{ fontSize: starSize, color: starColor, lineHeight: starSize * 1.05 }}>★</Text>
      <View style={{ width: 4, height, backgroundColor: stalkColor, borderRadius: 2, marginTop: -2 }} />
    </Animated.View>
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
  antennaeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  antenna: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
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
