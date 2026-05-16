import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonsterAvatar } from '@/components/monster-avatar';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useT } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';

const HOLD_MS = 3000;

export default function UsersScreen() {
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const { users, activeUser, switchUser } = useSettings();
  const t = useT();

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');

  const sortedUsers = Object.values(users).sort((a, b) => a.createdAt - b.createdAt);

  const onPickUser = (id: string) => {
    if (id !== activeUser?.id) switchUser(id);
    router.back();
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('a11y.closeSettings')}
            onPress={() => router.back()}
            style={styles.closeBtn}
            hitSlop={12}
          >
            <Text style={[styles.closeGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>×</Text>
          </Pressable>
          <Text style={[styles.title, { color: text, fontFamily: Fonts?.rounded }]}>
            {t('users')}
          </Text>
          <View style={styles.closeBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedUsers.map((u) => {
            const isActive = u.id === activeUser?.id;
            return (
              <Pressable
                key={u.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => onPickUser(u.id)}
                style={[
                  styles.userRow,
                  {
                    backgroundColor: card,
                    borderColor: isActive ? primary : 'transparent',
                    shadowColor: shadow,
                  },
                ]}
              >
                <MonsterAvatar monster={u.monster} size={56} />
                <Text style={[styles.userName, { color: text, fontFamily: Fonts?.rounded }]}>
                  {u.name}
                </Text>
                {isActive ? (
                  <Text style={[styles.checkGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>
                    ✓
                  </Text>
                ) : null}
              </Pressable>
            );
          })}

          {/* Gated Add-Kid button at the bottom. */}
          <AddKidGate
            unlocked={gateUnlocked}
            onUnlock={() => {
              setGateUnlocked(true);
              router.push({ pathname: '/onboarding', params: { mode: 'add' } });
              // Re-lock on next mount so the gate runs again next time.
              setTimeout(() => setGateUnlocked(false), 500);
            }}
            label={t('addKid')}
            primary={primary}
            primaryDeep={primaryDeep}
            text={text}
            muted={muted}
            card={card}
            shadow={shadow}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function AddKidGate({
  unlocked,
  onUnlock,
  label,
  primary,
  primaryDeep,
  text,
  muted,
  card,
  shadow,
}: {
  unlocked: boolean;
  onUnlock: () => void;
  label: string;
  primary: string;
  primaryDeep: string;
  text: string;
  muted: string;
  card: string;
  shadow: string;
}) {
  const t = useT();
  const progress = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const onPressIn = () => {
    if (unlocked) return;
    progress.value = withTiming(1, { duration: HOLD_MS });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      progress.value = 0;
      onUnlock();
    }, HOLD_MS);
  };

  const onPressOut = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    progress.value = withTiming(0, { duration: 220 });
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.addKidWrap}>
      <Text style={[styles.gateHint, { color: muted, fontFamily: Fonts?.rounded }]}>
        {t('parentalGateHint')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('a11y.parentalGate')}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.addKidButton,
          { backgroundColor: card, borderColor: primary, shadowColor: primaryDeep ?? shadow },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.addKidFill, { backgroundColor: primary }, fillStyle]}
        />
        <Text style={[styles.addKidLabel, { color: text, fontFamily: Fonts?.rounded }]}>
          + {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20 },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: {
    fontSize: 36,
    lineHeight: 36,
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 3,
    marginVertical: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  userName: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
  },
  checkGlyph: {
    fontSize: 28,
    fontWeight: '900',
  },
  addKidWrap: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  gateHint: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  addKidButton: {
    overflow: 'hidden',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addKidFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    opacity: 0.25,
  },
  addKidLabel: {
    fontSize: 18,
    fontWeight: '900',
  },
});
