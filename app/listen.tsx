import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingNumbers } from '@/components/floating-numbers';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getSpeechLocale, useT } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';

/**
 * Bucket the visible digits into rows that read like place-value groups:
 *  - if 0 is included, it sits alone on its own row
 *  - then 1–10, 11–20, 21–30, etc. — each row capped at 10 tiles
 */
function bucketDigits(start: number, until: number): number[][] {
  const groups: number[][] = [];
  let cursor = start;
  if (cursor === 0) {
    groups.push([0]);
    cursor = 1;
  }
  for (let lo = cursor; lo <= until; lo += 10) {
    const hi = Math.min(lo + 9, until);
    const row: number[] = [];
    for (let n = lo; n <= hi; n++) row.push(n);
    groups.push(row);
  }
  return groups;
}

export default function ListenScreen() {
  const primary = useThemeColor({}, 'primary');
  const muted = useThemeColor({}, 'textMuted');
  const t = useT();
  const { settings } = useSettings();
  const { until, includeZero } = settings.pages.listen;
  const start = includeZero ? 0 : 1;
  const groups = bucketDigits(start, until);

  return (
    <ThemedView style={styles.flex}>
      <FloatingNumbers count={6} />
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
          <View style={styles.back} />
        </View>

        <Text style={[styles.title, { color: muted, fontFamily: Fonts?.rounded }]}>
          {t('listenTitle')}
        </Text>

        <ScrollView
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          {groups.map((row, idx) => (
            <Fragment key={`group-${idx}`}>
              {idx > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.groupRow}>
                {row.map((n) => (
                  <NumberTile key={n} value={n} />
                ))}
                {/* Fill to a row of 10 so a partial group lines up with full ones. */}
                {row.length > 1 && row.length < 10
                  ? Array.from({ length: 10 - row.length }).map((_, i) => (
                      <View key={`spacer-${idx}-${i}`} style={styles.tileWrap} />
                    ))
                  : null}
              </View>
            </Fragment>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function NumberTile({ value }: { value: number }) {
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');
  const t = useT();

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Speech.stop();
    Speech.speak(String(value), { language: getSpeechLocale() });
  };

  return (
    <Animated.View style={[styles.tileWrap, animatedStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('a11y.speakNumber', { value })}
        onPressIn={() => {
          scale.value = withSpring(0.94, { damping: 12 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        onPress={onPress}
        style={[styles.tile, { backgroundColor: card, shadowColor: primaryDeep ?? shadow }]}
      >
        <Text style={[styles.tileText, { color: primary, fontFamily: Fonts?.rounded }]}>
          {value}
        </Text>
      </Pressable>
    </Animated.View>
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
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  gridContent: {
    paddingBottom: 24,
  },
  groupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#D6D2EA',
    marginVertical: 8,
    marginHorizontal: 12,
    opacity: 0.7,
  },
  tileWrap: {
    width: '20%',
    aspectRatio: 1,
    padding: 4,
  },
  tile: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  tileText: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
});
