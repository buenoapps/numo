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
import { useT } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';

type CtaSpec = {
  key: 'numbers' | 'count' | 'add' | 'sub';
  emoji: string;
  label: string;
  bg: string;
  fg: string;
  shadowColor: string;
  onPress: () => void;
};

export default function HomeScreen() {
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const muted = useThemeColor({}, 'textMuted');
  const accent = useThemeColor({}, 'accent');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');
  const text = useThemeColor({}, 'text');
  const insets = useSafeAreaInsets();
  const t = useT();

  const { settings } = useSettings();

  const ctas: CtaSpec[] = [];
  if (settings.pages.numbers.enabled) {
    ctas.push({
      key: 'numbers',
      emoji: '🔊',
      label: t('numbers'),
      bg: card,
      fg: primary,
      shadowColor: shadow,
      onPress: () => router.push('/numbers'),
    });
  }
  if (settings.pages.count.enabled) {
    ctas.push({
      key: 'count',
      emoji: '🔢',
      label: t('count'),
      bg: card,
      fg: primary,
      shadowColor: shadow,
      onPress: () => router.push('/count'),
    });
  }
  if (settings.pages.add.enabled) {
    ctas.push({
      key: 'add',
      emoji: '➕',
      label: t('add'),
      bg: primary,
      fg: '#FFFFFF',
      shadowColor: primaryDeep ?? shadow,
      onPress: () => router.push({ pathname: '/play', params: { op: 'add' } }),
    });
  }
  if (settings.pages.sub.enabled) {
    ctas.push({
      key: 'sub',
      emoji: '➖',
      label: t('subtract'),
      bg: accent,
      fg: text,
      shadowColor: primaryDeep ?? shadow,
      onPress: () => router.push({ pathname: '/play', params: { op: 'sub' } }),
    });
  }

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
            <Numo mood="idle" size={150} />
          </View>

          <View style={styles.ctaStack}>
            {ctas.map(({ key, ...rest }) => (
              <Cta key={key} {...rest} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function Cta({
  emoji,
  label,
  bg,
  fg,
  shadowColor,
  onPress,
}: Pick<CtaSpec, 'emoji' | 'label' | 'bg' | 'fg' | 'shadowColor' | 'onPress'>) {
  const t = useT();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={[styles.ctaWrap, animatedStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('a11y.play', { label })}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 12 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        onPress={onPress}
        style={[styles.cta, { backgroundColor: bg, shadowColor }]}
      >
        <Text style={[styles.ctaEmoji, { fontFamily: Fonts?.rounded }]}>{emoji}</Text>
        <Text style={[styles.ctaText, { color: fg, fontFamily: Fonts?.rounded }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const CTA_HEIGHT = 64;
const CTA_WIDTH = 280;

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
    gap: 8,
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
    marginVertical: 12,
  },
  ctaStack: {
    alignItems: 'center',
    gap: 10,
  },
  ctaWrap: {
    width: CTA_WIDTH,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: CTA_WIDTH,
    height: CTA_HEIGHT,
    borderRadius: CTA_HEIGHT / 2,
    paddingHorizontal: 24,
    gap: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  ctaText: {
    fontSize: 22,
    fontWeight: '900',
  },
});
