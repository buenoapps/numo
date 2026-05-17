import { router, useLocalSearchParams } from 'expo-router';
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
import { useSuccessSound, useWrongSound } from '@/lib/sounds';

const NEXT_DELAY_MS = 2800;
const WRONG_RESET_MS = 500;
/**
 * Above this, both operands stop getting a dot grid — too many dots clutter
 * the screen. The numeric equation is enough for larger numbers.
 */
const MAX_DOTS_PER_GROUP = 10;

type MathOp = 'add' | 'sub';

function parseOp(raw: string | string[] | undefined): MathOp {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === 'sub' ? 'sub' : 'add';
}

export default function PlayScreen() {
  const params = useLocalSearchParams<{ op?: string }>();
  const op = parseOp(params.op);

  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const t = useT();

  const { settings, incrementStats } = useSettings();
  const pageConfig = settings.pages[op];

  const [problem, setProblem] = useState<Problem>(() =>
    generateProblem(op, { until: pageConfig.until, includeZero: pageConfig.includeZero }),
  );
  const [streak, setStreak] = useState(0);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [correctRevealed, setCorrectRevealed] = useState(false);
  const [firstAnswerLogged, setFirstAnswerLogged] = useState(false);
  // Bumped every time the kid hits a correct answer while at 5 stars to
  // re-mount the Confetti component and replay its animation.
  const [confettiKey, setConfettiKey] = useState(0);
  const [trackedKey, setTrackedKey] = useState(
    `${op}:${pageConfig.until}:${pageConfig.includeZero}`,
  );

  const playSuccess = useSuccessSound();
  const playWrong = useWrongSound();

  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // TTS reading the problem and answer rides on the "sound on correct"
  // toggle — that one defaults on and acts as the master "Numo speaks"
  // switch, mirroring the pre-split single Sounds toggle.
  const speak = useCallback(
    (phrase: string) => {
      if (!settings.soundCorrectEnabled) return;
      try {
        Speech.stop();
        Speech.speak(phrase, { language: getSpeechLocale() });
      } catch {
        // No TTS backend (e.g., web on some browsers) — silent fallback.
      }
    },
    [settings.soundCorrectEnabled],
  );

  // Reset the round when the mode or its config changes — render-time
  // "adjust state on prop change" pattern, not an effect.
  const currentKey = `${op}:${pageConfig.until}:${pageConfig.includeZero}`;
  if (trackedKey !== currentKey) {
    setTrackedKey(currentKey);
    setProblem(
      generateProblem(op, { until: pageConfig.until, includeZero: pageConfig.includeZero }),
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

  // Read each new problem aloud when it appears.
  useEffect(() => {
    if (correctRevealed) return;
    const opWord = problem.op === 'add' ? '+' : '−';
    speak(`${problem.a} ${opWord} ${problem.b}`);
  }, [problem, correctRevealed, speak]);

  const nextProblem = useCallback(() => {
    setProblem(
      generateProblem(op, { until: pageConfig.until, includeZero: pageConfig.includeZero }),
    );
    setCorrectRevealed(false);
    setWrongChoice(null);
    setFirstAnswerLogged(false);
  }, [op, pageConfig.until, pageConfig.includeZero]);

  const onAnswer = useCallback(
    (value: number) => {
      if (correctRevealed) return;

      const right = value === problem.answer;

      // Only the very first answer for this problem counts towards stats —
      // a kid who retries after a miss only logs the original wrong tick.
      if (!firstAnswerLogged) {
        incrementStats(op, right);
        setFirstAnswerLogged(true);
      }

      if (right) {
        if (settings.hapticCorrectEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }
        setCorrectRevealed(true);
        setStreak((s) => {
          const next = Math.min(s + 1, 5);
          if (next === 5) setConfettiKey((k) => k + 1);
          return next;
        });
        playSuccess();
        const opWord = problem.op === 'add' ? '+' : '−';
        speak(`${problem.a} ${opWord} ${problem.b} = ${problem.answer}`);
        if (nextTimer.current) clearTimeout(nextTimer.current);
        nextTimer.current = setTimeout(nextProblem, NEXT_DELAY_MS);
      } else {
        if (settings.hapticWrongEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        }
        playWrong();
        setStreak((s) => Math.max(s - 1, 0));
        setWrongChoice(value);
        if (wrongTimer.current) clearTimeout(wrongTimer.current);
        wrongTimer.current = setTimeout(() => setWrongChoice(null), WRONG_RESET_MS);
      }
    },
    [
      correctRevealed,
      problem,
      nextProblem,
      playSuccess,
      playWrong,
      speak,
      firstAnswerLogged,
      incrementStats,
      op,
      settings.hapticCorrectEnabled,
      settings.hapticWrongEnabled,
    ],
  );

  const mood: NumoMood = correctRevealed ? 'happy' : wrongChoice !== null ? 'oops' : 'thinking';
  const opSymbol = problem.op === 'add' ? '+' : '−';
  const title = problem.op === 'add' ? t('add') : t('subtract');
  const showDots =
    problem.a <= MAX_DOTS_PER_GROUP && problem.b <= MAX_DOTS_PER_GROUP;

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

        <Text style={[styles.modeLabel, { color: muted, fontFamily: Fonts?.rounded }]}>{title}</Text>

        <View style={styles.mascot}>
          <Numo mood={mood} size={140} />
        </View>

        {showDots ? (
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
        ) : (
          <View style={styles.visualSpacer} />
        )}

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
  visualSpacer: {
    height: 24,
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
