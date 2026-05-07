import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingNumbers } from '@/components/floating-numbers';
import { Numo } from '@/components/numo';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { t } from '@/lib/i18n';
import type { Op } from '@/lib/problems';
import { useSettings } from '@/lib/settings';

export default function HomeScreen() {
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const muted = useThemeColor({}, 'textMuted');
  const accent = useThemeColor({}, 'accent');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');
  const insets = useSafeAreaInsets();

  const { settings } = useSettings();
  const showBoth = settings.subtractionEnabled;

  return (
    <ThemedView style={styles.flex}>
      <FloatingNumbers />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('a11y.openSettings')}
        onPress={() => router.push('/settings')}
        style={[
          styles.gear,
          { backgroundColor: card, shadowColor: shadow, top: insets.top + 12 },
        ]}
        hitSlop={8}
      >
        <Text style={[styles.gearGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>⚙︎</Text>
      </Pressable>

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: primary, fontFamily: Fonts?.rounded }]}>Numo</Text>
          <Text style={[styles.subtitle, { color: muted, fontFamily: Fonts?.rounded }]}>
            {t('subtitle')}
          </Text>

          <View style={styles.mascotWrap}>
            <Numo mood="idle" size={200} />
          </View>

          <View style={[styles.ctaRow, showBoth && styles.ctaRowDouble]}>
            <PlayCta
              label={showBoth ? t('add') : t('letsPlay')}
              symbol="+"
              op="add"
              bg={primary}
              shadowColor={primaryDeep ?? shadow}
            />
            {showBoth ? (
              <PlayCta
                label={t('subtract')}
                symbol="−"
                op="sub"
                bg={accent}
                fg={primaryDeep ?? '#1F1B2E'}
                shadowColor={primaryDeep ?? shadow}
              />
            ) : null}
          </View>

          <NumbersCta primary={primary} card={card} shadow={shadow} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function PlayCta({
  label,
  symbol,
  op,
  bg,
  fg = '#FFFFFF',
  shadowColor,
}: {
  label: string;
  symbol: string;
  op: Op;
  bg: string;
  fg?: string;
  shadowColor: string;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('a11y.play', { label })}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 12 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        onPress={() => router.push({ pathname: '/play', params: { op } })}
        style={[styles.cta, { backgroundColor: bg, shadowColor }]}
      >
        <Text style={[styles.ctaSymbol, { color: fg, fontFamily: Fonts?.rounded }]}>{symbol}</Text>
        <Text style={[styles.ctaText, { color: fg, fontFamily: Fonts?.rounded }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function NumbersCta({
  primary,
  card,
  shadow,
}: {
  primary: string;
  card: string;
  shadow: string;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={[styles.numbersWrap, animatedStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('a11y.play', { label: t('numbers') })}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 12 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        onPress={() => router.push('/numbers')}
        style={[styles.numbersCta, { backgroundColor: card, shadowColor: shadow }]}
      >
        <Text style={[styles.numbersSymbol, { color: primary, fontFamily: Fonts?.rounded }]}>🔊</Text>
        <Text style={[styles.numbersText, { color: primary, fontFamily: Fonts?.rounded }]}>
          {t('numbers')}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  gear: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  gearGlyph: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 72,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  ctaRowDouble: {},
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 32,
    gap: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaSymbol: {
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32,
  },
  ctaText: {
    fontSize: 22,
    fontWeight: '900',
  },
  numbersWrap: {
    marginTop: 12,
  },
  numbersCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  numbersSymbol: {
    fontSize: 24,
    lineHeight: 26,
  },
  numbersText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
