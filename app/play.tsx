import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerButton } from '@/components/answer-button';
import { DotGroup } from '@/components/dot-group';
import { FloatingNumbers } from '@/components/floating-numbers';
import { Numo, type NumoMood } from '@/components/numo';
import { StreakBar } from '@/components/streak-bar';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { generateProblem, type Problem } from '@/lib/problems';

const NEXT_DELAY_MS = 900;
const WRONG_RESET_MS = 500;

export default function PlayScreen() {
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');

  const [problem, setProblem] = useState<Problem>(() => generateProblem());
  const [streak, setStreak] = useState(0);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [correctRevealed, setCorrectRevealed] = useState(false);

  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (nextTimer.current) clearTimeout(nextTimer.current);
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
    };
  }, []);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem());
    setCorrectRevealed(false);
    setWrongChoice(null);
  }, []);

  const onAnswer = useCallback(
    (value: number) => {
      if (correctRevealed) return;

      if (value === problem.answer) {
        setCorrectRevealed(true);
        setStreak((s) => s + 1);
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }
        if (nextTimer.current) clearTimeout(nextTimer.current);
        nextTimer.current = setTimeout(nextProblem, NEXT_DELAY_MS);
      } else {
        setWrongChoice(value);
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        if (wrongTimer.current) clearTimeout(wrongTimer.current);
        wrongTimer.current = setTimeout(() => setWrongChoice(null), WRONG_RESET_MS);
      }
    },
    [correctRevealed, problem.answer, nextProblem],
  );

  const mood: NumoMood = correctRevealed ? 'happy' : wrongChoice !== null ? 'oops' : 'thinking';

  return (
    <ThemedView style={styles.flex}>
      <FloatingNumbers count={7} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go home"
            onPress={() => router.back()}
            style={styles.back}
            hitSlop={12}
          >
            <Text style={[styles.backGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>‹</Text>
          </Pressable>
          <StreakBar streak={streak} />
          <View style={styles.back} />
        </View>

        <View style={styles.mascot}>
          <Numo mood={mood} size={140} />
        </View>

        <View style={styles.visualRow}>
          <DotGroup count={problem.a} />
          <Text style={[styles.plus, { color: muted, fontFamily: Fonts?.rounded }]}>+</Text>
          <DotGroup count={problem.b} />
        </View>

        <Text style={[styles.equation, { color: text, fontFamily: Fonts?.rounded }]}>
          {problem.a} + {problem.b} = ?
        </Text>

        <View style={styles.choices}>
          <View style={styles.choiceRow}>
            {problem.choices.slice(0, 2).map((c) => (
              <AnswerButton
                key={`c-${c}`}
                value={c}
                state={
                  correctRevealed && c === problem.answer
                    ? 'correct'
                    : wrongChoice === c
                      ? 'wrong'
                      : 'idle'
                }
                disabled={correctRevealed}
                onPress={onAnswer}
              />
            ))}
          </View>
          <View style={styles.choiceRow}>
            {problem.choices.slice(2, 4).map((c) => (
              <AnswerButton
                key={`c-${c}`}
                value={c}
                state={
                  correctRevealed && c === problem.answer
                    ? 'correct'
                    : wrongChoice === c
                      ? 'wrong'
                      : 'idle'
                }
                disabled={correctRevealed}
                onPress={onAnswer}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    fontSize: 40,
    lineHeight: 40,
    fontWeight: '900',
  },
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  visualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    paddingHorizontal: 8,
    gap: 12,
  },
  plus: {
    fontSize: 36,
    fontWeight: '900',
  },
  equation: {
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 12,
  },
  choices: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  choiceRow: {
    flexDirection: 'row',
  },
});
