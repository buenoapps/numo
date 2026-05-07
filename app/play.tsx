import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerButton } from '@/components/answer-button';
import { DotGroup } from '@/components/dot-group';
import { FloatingNumbers } from '@/components/floating-numbers';
import { Numo, type NumoMood } from '@/components/numo';
import { StreakBar } from '@/components/streak-bar';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { t } from '@/lib/i18n';
import { generateProblem, type Op, type Problem } from '@/lib/problems';
import { useSuccessSound } from '@/lib/sounds';

const NEXT_DELAY_MS = 900;
const WRONG_RESET_MS = 500;

function parseOp(raw: string | string[] | undefined): Op {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === 'sub' ? 'sub' : 'add';
}

export default function PlayScreen() {
  const params = useLocalSearchParams<{ op?: string }>();
  const op = parseOp(params.op);

  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');

  const [problem, setProblem] = useState<Problem>(() => generateProblem(op));
  const [streak, setStreak] = useState(0);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [correctRevealed, setCorrectRevealed] = useState(false);

  const playSuccess = useSuccessSound();

  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (nextTimer.current) clearTimeout(nextTimer.current);
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
    };
  }, []);

  useEffect(() => {
    setProblem(generateProblem(op));
    setCorrectRevealed(false);
    setWrongChoice(null);
    setStreak(0);
  }, [op]);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem(op));
    setCorrectRevealed(false);
    setWrongChoice(null);
  }, [op]);

  const onAnswer = useCallback(
    (value: number) => {
      if (correctRevealed) return;

      // Haptic on every press, regardless of correctness.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      if (value === problem.answer) {
        setCorrectRevealed(true);
        setStreak((s) => s + 1);
        playSuccess();
        if (nextTimer.current) clearTimeout(nextTimer.current);
        nextTimer.current = setTimeout(nextProblem, NEXT_DELAY_MS);
      } else {
        setWrongChoice(value);
        if (wrongTimer.current) clearTimeout(wrongTimer.current);
        wrongTimer.current = setTimeout(() => setWrongChoice(null), WRONG_RESET_MS);
      }
    },
    [correctRevealed, problem.answer, nextProblem, playSuccess],
  );

  const mood: NumoMood = correctRevealed ? 'happy' : wrongChoice !== null ? 'oops' : 'thinking';
  const opSymbol = problem.op === 'add' ? '+' : '−';
  const title = problem.op === 'add' ? t('add') : t('subtract');

  return (
    <ThemedView style={styles.flex}>
      <FloatingNumbers count={7} />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('a11y.goHome')}
            onPress={() => router.back()}
            style={styles.back}
            hitSlop={12}
          >
            <Text style={[styles.backGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>‹</Text>
          </Pressable>
          <StreakBar streak={streak} />
          <View style={styles.back} />
        </View>

        <Text style={[styles.modeLabel, { color: muted, fontFamily: Fonts?.rounded }]}>{title}</Text>

        <View style={styles.mascot}>
          <Numo mood={mood} size={140} />
        </View>

        <View style={styles.visualRow}>
          {problem.op === 'add' ? (
            <>
              <DotGroup count={problem.a} />
              <Text style={[styles.opGlyph, { color: muted, fontFamily: Fonts?.rounded }]}>+</Text>
              <DotGroup count={problem.b} />
            </>
          ) : (
            <DotGroup count={problem.a} removed={problem.b} />
          )}
        </View>

        <Text style={[styles.equation, { color: text, fontFamily: Fonts?.rounded }]}>
          {problem.a} {opSymbol} {problem.b} = ?
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
  modeLabel: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 4,
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
  opGlyph: {
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
