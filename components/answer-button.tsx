import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type AnswerState = 'idle' | 'correct' | 'wrong';

type Props = {
  value: number;
  state: AnswerState;
  disabled?: boolean;
  onPress: (value: number) => void;
};

export function AnswerButton({ value, state, disabled, onPress }: Props) {
  const card = useThemeColor({}, 'card');
  const correct = useThemeColor({}, 'correct');
  const wrong = useThemeColor({}, 'wrong');
  const text = useThemeColor({}, 'text');
  const shadow = useThemeColor({}, 'cardShadow');

  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (state === 'wrong') {
      shake.value = withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
    } else if (state === 'correct') {
      scale.value = withSpring(1.08, { damping: 8 });
    } else {
      scale.value = withSpring(1);
    }
    return () => {
      cancelAnimation(shake);
    };
  }, [state, scale, shake]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: scale.value }],
  }));

  const bg = state === 'correct' ? correct : state === 'wrong' ? wrong : card;
  const fg = state === 'idle' ? text : '#FFFFFF';

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Answer ${value}`}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withSpring(0.94, { damping: 12 });
        }}
        onPressOut={() => {
          if (state !== 'correct') scale.value = withSpring(1, { damping: 12 });
        }}
        onPress={() => onPress(value)}
        style={[
          styles.button,
          { backgroundColor: bg, shadowColor: shadow, opacity: disabled && state === 'idle' ? 0.6 : 1 },
        ]}
      >
        <Text style={[styles.label, { color: fg, fontFamily: Fonts?.rounded }]}>{value}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    margin: 8,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
  },
});
