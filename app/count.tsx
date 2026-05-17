import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerButton } from '@/components/answer-button';
import { Confetti } from '@/components/confetti';
import { DotGroup } from '@/components/dot-group';
import { FloatingNumbers } from '@/components/floating-numbers';
import { Numo, type NumoMood } from '@/components/numo';
import { StreakBar } from '@/components/streak-bar';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getSpeechLocale, useT } from '@/lib/i18n';
import { generateProblem, type Problem } from '@/lib/problems';
import { useSettings } from '@/lib/settings';
import { useSuccessSound } from '@/lib/sounds';

const NEXT_DELAY_MS = 1500;
const WRONG_RESET_MS = 500;

export default function CountScreen() {
  const primary = useThemeColor({}, 'primary');
  const muted = useThemeColor({}, 'textMuted');
  const t = useT();

  const { settings, incrementStats } = useSettings();
  const pageConfig = settings.pages.count;

  const [problem, setProblem] = useState<Problem>(() =>
    generateProblem('count', { until: pageConfig.until, includeZero: pageConfig.includeZero }),
  );
  const [streak, setStreak] = useState(0);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [correctRevealed, setCorrectRevealed] = useState(false);
  const [firstAnswerLogged, setFirstAnswerLogged] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [trackedKey, setTrackedKey] = useState(
    `${pageConfig.until}:${pageConfig.includeZero}`,
  );

  const playSuccess = useSuccessSound();

  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const speak = useCallback(
    (phrase: string) => {
      if (!settings.soundsEnabled) return;
      try {
        // Intentionally don't Speech.stop() — let any in-flight utterance
        // finish so the answer readout isn't cut off when the next problem
        // appears. Speech queues naturally.
        Speech.speak(phrase, { language: getSpeechLocale() });
      } catch {
        // No TTS backend (e.g., web on some browsers) — silent fallback.
      }
    },
    [settings.soundsEnabled],
  );

  const currentKey = `${pageConfig.until}:${pageConfig.includeZero}`;
  if (trackedKey !== currentKey) {
    setTrackedKey(currentKey);
    setProblem(
      generateProblem('count', { until: pageConfig.until, includeZero: pageConfig.includeZero }),
    );
    setCorrectRevealed(false);
    setWrongChoice(null);
    setStreak(0);
    setFirstAnswerLogged(false);
  }

  useEffect(() => {
    return () => {
      if (nextTimer.current) clearTimeout(nextTimer.current);
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
      try {
        Speech.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  const nextProblem = useCallback(() => {
    setProblem(
      generateProblem('count', { until: pageConfig.until, includeZero: pageConfig.includeZero }),
    );
    setCorrectRevealed(false);
    setWrongChoice(null);
    setFirstAnswerLogged(false);
  }, [pageConfig.until, pageConfig.includeZero]);

  const onAnswer = useCallback(
    (value: number) => {
      if (correctRevealed) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      const right = value === problem.answer;
      if (!firstAnswerLogged) {
        incrementStats('count', right);
        setFirstAnswerLogged(true);
      }

      if (right) {
        setCorrectRevealed(true);
        setStreak((s) => {
          const next = Math.min(s + 1, 5);
          if (next === 5) setConfettiKey((k) => k + 1);
          return next;
        });
        playSuccess();
        speak(String(problem.answer));
        if (nextTimer.current) clearTimeout(nextTimer.current);
        nextTimer.current = setTimeout(nextProblem, NEXT_DELAY_MS);
      } else {
        setStreak((s) => Math.max(s - 1, 0));
        setWrongChoice(value);
        if (wrongTimer.current) clearTimeout(wrongTimer.current);
        wrongTimer.current = setTimeout(() => setWrongChoice(null), WRONG_RESET_MS);
      }
    },
    [
      correctRevealed,
      problem.answer,
      nextProblem,
      playSuccess,
      speak,
      firstAnswerLogged,
      incrementStats,
    ],
  );

  const mood: NumoMood = correctRevealed ? 'happy' : wrongChoice !== null ? 'oops' : 'thinking';

  return (
    <ThemedView style={styles.flex}>
      <FloatingNumbers count={7} />
      {confettiKey > 0 ? <Confetti triggerKey={confettiKey} /> : null}
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

        <Text style={[styles.title, { color: muted, fontFamily: Fonts?.rounded }]}>
          {t('countTitle')}
        </Text>

        <View style={styles.mascot}>
          <Numo mood={mood} size={140} />
        </View>

        <View style={styles.visualRow}>
          <DotGroup count={problem.a} size={28} />
        </View>

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
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
    paddingHorizontal: 24,
  },
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  visualRow: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  choices: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  choiceRow: {
    flexDirection: 'row',
  },
});
