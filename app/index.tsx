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

export default function HomeScreen() {
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const muted = useThemeColor({}, 'textMuted');
  const shadow = useThemeColor({}, 'cardShadow');

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ThemedView style={styles.flex}>
      <FloatingNumbers />
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: primary, fontFamily: Fonts?.rounded }]}>Numo</Text>
          <Text style={[styles.subtitle, { color: muted, fontFamily: Fonts?.rounded }]}>
            Let&apos;s add!
          </Text>

          <View style={styles.mascotWrap}>
            <Numo mood="idle" size={220} />
          </View>

          <Animated.View style={animatedStyle}>
            <Pressable
              accessibilityRole="button"
              onPressIn={() => {
                scale.value = withSpring(0.96, { damping: 12 });
              }}
              onPressOut={() => {
                scale.value = withSpring(1, { damping: 12 });
              }}
              onPress={() => router.push('/play')}
              style={[
                styles.cta,
                {
                  backgroundColor: primary,
                  shadowColor: primaryDeep ?? shadow,
                },
              ]}
            >
              <Text style={[styles.ctaText, { fontFamily: Fonts?.rounded }]}>Let&apos;s Play!</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
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
  cta: {
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 32,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
});
