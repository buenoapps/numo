import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import { getSpeechLocale, t } from '@/lib/i18n';

const NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function NumbersScreen() {
  const primary = useThemeColor({}, 'primary');
  const muted = useThemeColor({}, 'textMuted');

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
          {t('numbersTitle')}
        </Text>

        <View style={styles.grid}>
          {NUMBERS.map((n) => (
            <NumberTile key={n} value={n} />
          ))}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function NumberTile({ value }: { value: number }) {
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');

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
        <Text style={[styles.tileText, { color: primary, fontFamily: Fonts?.rounded }]}>{value}</Text>
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
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tileWrap: {
    width: '40%',
    aspectRatio: 1,
    padding: 8,
  },
  tile: {
    flex: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  tileText: {
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 72,
  },
});
