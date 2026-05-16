import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonsterAvatar } from '@/components/monster-avatar';
import { Numo } from '@/components/numo';
import { ThemedView } from '@/components/themed-view';
import { MONSTERS, type Monster } from '@/constants/monsters';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useT } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';

type Mode = 'initial' | 'add';

export default function OnboardingScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: Mode = (Array.isArray(params.mode) ? params.mode[0] : params.mode) === 'add' ? 'add' : 'initial';

  // In add mode, skip the intro pages and open straight on the picker.
  const [step, setStep] = useState<number>(mode === 'add' ? 2 : 0);
  const [name, setName] = useState('');
  const [monster, setMonster] = useState<Monster>('purple');

  const t = useT();
  const { addUser, setPreviewMonster } = useSettings();

  // Always clear the theme preview when leaving the screen so the previous
  // monster is restored if the kid backs out without creating a user.
  useEffect(
    () => () => {
      setPreviewMonster(null);
    },
    [setPreviewMonster],
  );

  // Push the picker's selection into the preview so the whole page retints
  // live as the kid taps different monsters. Only active on the picker step.
  useEffect(() => {
    if (step === 2) setPreviewMonster(monster);
    else setPreviewMonster(null);
  }, [step, monster, setPreviewMonster]);

  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');
  const background = useThemeColor({}, 'background');

  const totalSteps = mode === 'add' ? 1 : 3;
  const visibleStep = mode === 'add' ? 0 : step;

  const canFinish = name.trim().length > 0;
  const isLast = step === 2;

  const onNext = () => {
    if (isLast) {
      if (!canFinish) return;
      addUser(name.trim(), monster);
      if (mode === 'add') {
        router.back();
      } else {
        router.replace('/');
      }
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const onBack = () => {
    if (mode === 'add' || step === 0) {
      router.back();
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 0 ? (
              <FeaturesPage text={text} muted={muted} t={t} primary={primary} />
            ) : null}
            {step === 1 ? <AboutPage text={text} muted={muted} t={t} primary={primary} /> : null}
            {step === 2 ? (
              <ProfilePage
                t={t}
                name={name}
                setName={setName}
                monster={monster}
                setMonster={setMonster}
                text={text}
                muted={muted}
                primary={primary}
                background={background}
                card={card}
                shadow={shadow}
              />
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            {totalSteps > 1 ? (
              <View style={styles.dots}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: i === visibleStep ? primary : '#D6D2EA',
                        width: i === visibleStep ? 24 : 8,
                      },
                    ]}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.dots} />
            )}

            <View style={styles.buttonRow}>
              {step > 0 || mode === 'add' ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={onBack}
                  style={[styles.secondaryButton, { borderColor: '#D6D2EA' }]}
                >
                  <Text style={[styles.secondaryText, { color: text, fontFamily: Fonts?.rounded }]}>
                    {t('onboardingBack')}
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.secondaryPlaceholder} />
              )}

              <Pressable
                accessibilityRole="button"
                disabled={isLast && !canFinish}
                onPress={onNext}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: primary,
                    shadowColor: primaryDeep,
                    opacity: isLast && !canFinish ? 0.5 : 1,
                  },
                ]}
              >
                <Text style={[styles.primaryText, { fontFamily: Fonts?.rounded }]}>
                  {isLast ? t('onboardingDone') : t('onboardingNext')}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

function FeaturesPage({
  text,
  muted,
  primary,
  t,
}: {
  text: string;
  muted: string;
  primary: string;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const items = [
    { emoji: '🔊', body: t('onboardingFeatureListen') },
    { emoji: '🔢', body: t('onboardingFeatureCount') },
    { emoji: '➕', body: t('onboardingFeaturePlus') },
    { emoji: '➖', body: t('onboardingFeatureMinus') },
  ];
  return (
    <View style={styles.page}>
      <View style={styles.mascot}>
        <Numo mood="happy" size={160} />
      </View>
      <Text style={[styles.title, { color: primary, fontFamily: Fonts?.rounded }]}>
        {t('onboardingTitleFeatures')}
      </Text>
      <View style={styles.featureList}>
        {items.map((it) => (
          <View key={it.emoji} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{it.emoji}</Text>
            <Text style={[styles.featureBody, { color: text, fontFamily: Fonts?.rounded }]}>
              {it.body}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AboutPage({
  text,
  muted,
  primary,
  t,
}: {
  text: string;
  muted: string;
  primary: string;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const items = [
    { emoji: '🔒', body: t('onboardingPrivacy') },
    { emoji: '👧', body: t('onboardingMultiKid') },
    { emoji: '⚙︎', body: t('onboardingGateHint') },
  ];
  return (
    <View style={styles.page}>
      <View style={styles.mascot}>
        <Numo mood="thinking" size={140} />
      </View>
      <Text style={[styles.title, { color: primary, fontFamily: Fonts?.rounded }]}>
        {t('onboardingTitleAbout')}
      </Text>
      <View style={styles.featureList}>
        {items.map((it) => (
          <View key={it.emoji} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{it.emoji}</Text>
            <Text style={[styles.featureBody, { color: text, fontFamily: Fonts?.rounded }]}>
              {it.body}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProfilePage({
  t,
  name,
  setName,
  monster,
  setMonster,
  text,
  muted,
  primary,
  background,
  card,
  shadow,
}: {
  t: (key: string, options?: Record<string, unknown>) => string;
  name: string;
  setName: (s: string) => void;
  monster: Monster;
  setMonster: (m: Monster) => void;
  text: string;
  muted: string;
  primary: string;
  background: string;
  card: string;
  shadow: string;
}) {
  return (
    <View style={styles.page}>
      <Text style={[styles.title, { color: primary, fontFamily: Fonts?.rounded }]}>
        {t('onboardingTitlePick')}
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={t('onboardingNamePlaceholder')}
        placeholderTextColor={muted}
        style={[
          styles.input,
          {
            backgroundColor: card,
            borderColor: primary,
            color: text,
            fontFamily: Fonts?.rounded,
            shadowColor: shadow,
          },
        ]}
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={20}
        returnKeyType="done"
      />

      <Text style={[styles.subTitle, { color: muted, fontFamily: Fonts?.rounded }]}>
        {t('onboardingPickMonster')}
      </Text>

      <View style={styles.monsterGrid}>
        {MONSTERS.map((m) => {
          const selected = m === monster;
          return (
            <Pressable
              key={m}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={t('a11y.pickMonster', { label: t(`monster${cap(m)}`) })}
              onPress={() => setMonster(m)}
              style={[
                styles.monsterTile,
                {
                  borderColor: selected ? primary : 'transparent',
                  backgroundColor: card,
                  shadowColor: shadow,
                },
              ]}
            >
              <MonsterAvatar monster={m} size={64} />
              <Text style={[styles.monsterLabel, { color: text, fontFamily: Fonts?.rounded }]}>
                {t(`monster${cap(m)}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20 },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
  },
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 12,
  },
  featureList: {
    width: '100%',
    gap: 14,
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 4,
  },
  featureEmoji: {
    fontSize: 32,
    width: 40,
    textAlign: 'center',
  },
  featureBody: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 20,
    fontWeight: '700',
    borderRadius: 18,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 8,
  },
  monsterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  monsterTile: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  monsterLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 4,
    gap: 12,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    height: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 2,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryPlaceholder: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
});
