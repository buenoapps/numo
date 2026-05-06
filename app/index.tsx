import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingNumbers } from '@/components/floating-numbers';
import { Numo } from '@/components/numo';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSettings } from '@/lib/settings';
import type { Op } from '@/lib/problems';

export default function HomeScreen() {
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const muted = useThemeColor({}, 'textMuted');
  const accent = useThemeColor({}, 'accent');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');

  const { settings } = useSettings();
  const showBoth = settings.subtractionEnabled;

  return (
    <ThemedView style={styles.flex}>
      <FloatingNumbers />
      <SafeAreaView style={styles.safe}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => router.push('/settings')}
          style={[styles.gear, { backgroundColor: card, shadowColor: shadow }]}
          hitSlop={8}
        >
          <Text style={[styles.gearGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>⚙︎</Text>
        </Pressable>

        <View style={styles.content}>
          <Text style={[styles.title, { color: primary, fontFamily: Fonts?.rounded }]}>Numo</Text>
          <Text style={[styles.subtitle, { color: muted, fontFamily: Fonts?.rounded }]}>
            Let&apos;s do math!
          </Text>

          <View style={styles.mascotWrap}>
            <Numo mood="idle" size={220} />
          </View>

          <View style={[styles.ctaStack, showBoth && styles.ctaStackDouble]}>
            <PlayCta
              label={showBoth ? 'Add!' : "Let's Play!"}
              symbol="+"
              op="add"
              bg={primary}
              shadowColor={primaryDeep ?? shadow}
            />
            {showBoth ? (
              <PlayCta
                label="Take away!"
                symbol="−"
                op="sub"
                bg={accent}
                fg={primaryDeep ?? '#1F1B2E'}
                shadowColor={primaryDeep ?? shadow}
              />
            ) : null}
          </View>
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
        accessibilityLabel={`Play ${label}`}
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  gear: {
    position: 'absolute',
    top: 12,
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
    marginBottom: 16,
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  ctaStack: {
    alignItems: 'center',
    gap: 16,
  },
  ctaStackDouble: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 32,
    gap: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaSymbol: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 32,
  },
  ctaText: {
    fontSize: 24,
    fontWeight: '900',
  },
});
