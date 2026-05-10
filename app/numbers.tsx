import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
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

export default function NumbersScreen() {
  const primary = useThemeColor({}, 'primary');
  const muted = useThemeColor({}, 'textMuted');
  const t = useT();
  const { settings } = useSettings();
  const max = settings.numbersRange;
  const numbers = Array.from({ length: max + 1 }, (_, i) => i);
  const cols = max > 10 ? 5 : 4;

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

        <ScrollView
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {numbers.map((n) => (
              <NumberTile key={n} value={n} cols={cols} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function NumberTile({ value, cols }: { value: number; cols: number }) {
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

  const tileWidth = `${100 / cols}%` as const;
  const fontSize = cols === 5 ? 32 : 40;
  const lineHeight = cols === 5 ? 38 : 48;

  return (
    <Animated.View style={[styles.tileWrap, { width: tileWidth }, animatedStyle]}>
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
        <Text
          style={[
            styles.tileText,
            { color: primary, fontFamily: Fonts?.rounded, fontSize, lineHeight },
          ]}
        >
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tileWrap: {
    aspectRatio: 1,
    padding: 6,
  },
  tile: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tileText: {
    fontWeight: '900',
  },
});
