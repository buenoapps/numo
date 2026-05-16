import Slider from '@react-native-community/slider';
import * as Application from 'expo-application';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Numo } from '@/components/numo';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useT, type LocaleOverride } from '@/lib/i18n';
import { useSettings, type PageKey } from '@/lib/settings';

const HOLD_MS = 3000;

const BASE_URL = 'https://buenoapps.com/numo';
const LINKS = {
  about: BASE_URL,
  contact: `${BASE_URL}/contact`,
  donate: `${BASE_URL}/donate`,
  privacy: `${BASE_URL}/privacy`,
  terms: `${BASE_URL}/terms`,
  openSource: `${BASE_URL}/licenses`,
};

type PageSectionSpec = {
  page: PageKey;
  titleKey: 'sectionListen' | 'sectionCount' | 'sectionAdd' | 'sectionSub';
  range: { min: number; max: number; step: number };
};

const PAGE_SECTIONS: PageSectionSpec[] = [
  { page: 'listen', titleKey: 'sectionListen', range: { min: 10, max: 100, step: 10 } },
  { page: 'count', titleKey: 'sectionCount', range: { min: 4, max: 10, step: 1 } },
  { page: 'add', titleKey: 'sectionAdd', range: { min: 10, max: 100, step: 10 } },
  { page: 'sub', titleKey: 'sectionSub', range: { min: 10, max: 100, step: 10 } },
];

type LinkKey = 'about' | 'contact' | 'donate' | 'privacy' | 'terms' | 'openSource';

const LINK_ROWS: { key: LinkKey; url: string }[] = [
  { key: 'about', url: LINKS.about },
  { key: 'contact', url: LINKS.contact },
  { key: 'donate', url: LINKS.donate },
  { key: 'privacy', url: LINKS.privacy },
  { key: 'terms', url: LINKS.terms },
  { key: 'openSource', url: LINKS.openSource },
];

export default function SettingsScreen() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) {
    return <ParentalGate onUnlock={() => setUnlocked(true)} />;
  }
  return <SettingsBody />;
}

function ParentalGate({ onUnlock }: { onUnlock: () => void }) {
  const t = useT();
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');

  const progress = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const onPressIn = () => {
    progress.value = withTiming(1, { duration: HOLD_MS });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
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
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.gateSafe} edges={['top', 'left', 'right', 'bottom']}>
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
            {t('settings')}
          </Text>
          <View style={styles.closeBtn} />
        </View>

        <View style={styles.gateContent}>
          <Numo mood="thinking" size={180} />

          <Text style={[styles.gateTitle, { color: text, fontFamily: Fonts?.rounded }]}>
            {t('parentalGateTitle')}
          </Text>
          <Text style={[styles.gateHint, { color: muted, fontFamily: Fonts?.rounded }]}>
            {t('parentalGateHint')}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('a11y.parentalGate')}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[
              styles.gateButton,
              { backgroundColor: card, shadowColor: primaryDeep ?? shadow, borderColor: primary },
            ]}
          >
            <Animated.View
              pointerEvents="none"
              style={[styles.gateFill, { backgroundColor: primary }, fillStyle]}
            />
            <Text style={[styles.gateButtonText, { color: text, fontFamily: Fonts?.rounded }]}>
              {t('parentalGateButton')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function SettingsBody() {
  const {
    settings,
    hydrated,
    activeUser,
    setPageConfig,
    setSoundsEnabled,
    setLanguageOverride,
    resetSettings,
  } = useSettings();
  const t = useT();
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const primary = useThemeColor({}, 'primary');
  const primaryDeep = useThemeColor({}, 'primaryDeep');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');
  const background = useThemeColor({}, 'background');
  const wrong = useThemeColor({}, 'wrong');

  const languageOptions: { value: LocaleOverride; label: string; flag: string }[] = [
    { value: 'device', label: t('languageSystem'), flag: '🌐' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'it', label: 'Italiano', flag: '🇮🇹' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'pt', label: 'Português', flag: '🇵🇹' },
    { value: 'pl', label: 'Polski', flag: '🇵🇱' },
    { value: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
  ];

  const onShare = () => {
    Share.share({ message: t('shareMessage') }).catch(() => {});
  };

  const onRate = async () => {
    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
        return;
      }
    } catch {
      // ignore — fall back to opening the homepage
    }
    Linking.openURL(BASE_URL).catch(() => {});
  };

  const onOpenLink = (url: string) => () => {
    Linking.openURL(url).catch(() => {});
  };

  const onRestoreDefaults = () => {
    Alert.alert(t('restoreDefaults'), t('restoreDefaultsDesc'), [
      { text: '×', style: 'cancel' },
      {
        text: t('restoreDefaults'),
        style: 'destructive',
        onPress: () => resetSettings(),
      },
    ]);
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
            {t('settings')}
          </Text>
          <View style={styles.closeBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Share with friends */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('a11y.share')}
            onPress={onShare}
            style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}
          >
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: text, fontFamily: Fonts?.rounded }]}>
                  {t('share')}
                </Text>
                <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
                  {t('shareDesc')}
                </Text>
              </View>
              <Text style={[styles.actionGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>
                ↗
              </Text>
            </View>
          </Pressable>

          {/* Rate the app */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('a11y.rate')}
            onPress={onRate}
            style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}
          >
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: text, fontFamily: Fonts?.rounded }]}>
                  {t('rate')}
                </Text>
                <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
                  {t('rateDesc')}
                </Text>
              </View>
              <Text style={[styles.actionGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>
                ★
              </Text>
            </View>
          </Pressable>

          {/* Sounds */}
          <View style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: text, fontFamily: Fonts?.rounded }]}>
                  {t('soundsLabel')}
                </Text>
                <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
                  {t('soundsDesc')}
                </Text>
              </View>
              <Switch
                accessibilityLabel={t('a11y.enableSounds')}
                value={settings.soundsEnabled}
                onValueChange={setSoundsEnabled}
                disabled={!hydrated}
                trackColor={{ true: primary, false: '#D6D2EA' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Language */}
          <View style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}>
            <Text style={[styles.sectionTitle, { color: text, fontFamily: Fonts?.rounded }]}>
              {t('language')}
            </Text>
            <View style={styles.chipRow}>
              {languageOptions.map((opt) => {
                const active = settings.languageOverride === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    accessibilityRole="button"
                    accessibilityLabel={t('a11y.pickLanguage', { label: opt.label })}
                    accessibilityState={{ selected: active }}
                    disabled={!hydrated}
                    onPress={() => setLanguageOverride(opt.value)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? primary : background,
                        borderColor: active ? primary : '#D6D2EA',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: active ? '#FFFFFF' : text,
                          fontFamily: Fonts?.rounded,
                        },
                      ]}
                    >
                      {opt.flag} {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Per-page complexity controls */}
          {PAGE_SECTIONS.map((section) => {
            const config = settings.pages[section.page];
            const title = t(section.titleKey);
            const scoredOp =
              section.page === 'count' || section.page === 'add' || section.page === 'sub'
                ? (section.page as 'count' | 'add' | 'sub')
                : null;
            const stat = scoredOp && activeUser ? activeUser.stats[scoredOp] : null;
            const total = stat ? stat.correct + stat.wrong : 0;
            const statsLabel =
              stat && total > 0
                ? t('statsLine', {
                    percent: Math.round((stat.correct / total) * 100),
                    correct: stat.correct,
                    total,
                  })
                : stat
                  ? t('statsEmpty')
                  : null;

            return (
              <View
                key={section.page}
                style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}
              >
                <Text style={[styles.sectionTitle, { color: text, fontFamily: Fonts?.rounded }]}>
                  {title}
                </Text>
                {statsLabel ? (
                  <Text style={[styles.statsLine, { color: muted, fontFamily: Fonts?.rounded }]}>
                    {statsLabel}
                  </Text>
                ) : null}

                <View style={styles.row}>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: text, fontFamily: Fonts?.rounded }]}>
                      {t('show')}
                    </Text>
                    <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
                      {t('showDesc')}
                    </Text>
                  </View>
                  <Switch
                    accessibilityLabel={t('a11y.enablePage', { label: title })}
                    value={config.enabled}
                    onValueChange={(v) => setPageConfig(section.page, { enabled: v })}
                    disabled={!hydrated}
                    trackColor={{ true: primary, false: '#D6D2EA' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: text, fontFamily: Fonts?.rounded }]}>
                      {t('includeZero')}
                    </Text>
                    <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
                      {t('includeZeroDesc')}
                    </Text>
                  </View>
                  <Switch
                    accessibilityLabel={t('a11y.includeZeroFor', { label: title })}
                    value={config.includeZero}
                    onValueChange={(v) => setPageConfig(section.page, { includeZero: v })}
                    disabled={!hydrated || !config.enabled}
                    trackColor={{ true: primary, false: '#D6D2EA' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.sliderRow}>
                  <Text style={[styles.rowLabel, { color: text, fontFamily: Fonts?.rounded }]}>
                    {t('untilLabel', { value: config.until })}
                  </Text>
                  <Slider
                    accessibilityLabel={t('a11y.untilFor', { label: title, value: config.until })}
                    minimumValue={section.range.min}
                    maximumValue={section.range.max}
                    step={section.range.step}
                    value={config.until}
                    onSlidingComplete={(v) =>
                      setPageConfig(section.page, { until: Math.round(v) })
                    }
                    disabled={!hydrated || !config.enabled}
                    minimumTrackTintColor={primary}
                    maximumTrackTintColor="#D6D2EA"
                    thumbTintColor={primary}
                    style={styles.slider}
                  />
                </View>
              </View>
            );
          })}

          {/* Restore defaults */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('a11y.restoreDefaults')}
            disabled={!hydrated}
            onPress={onRestoreDefaults}
            style={[
              styles.resetButton,
              { backgroundColor: card, borderColor: wrong, shadowColor: primaryDeep ?? shadow },
            ]}
          >
            <Text style={[styles.resetButtonText, { color: wrong, fontFamily: Fonts?.rounded }]}>
              {t('restoreDefaults')}
            </Text>
            <Text style={[styles.resetButtonSub, { color: muted, fontFamily: Fonts?.rounded }]}>
              {t('restoreDefaultsDesc')}
            </Text>
          </Pressable>

          {/* About Numo: link list */}
          <View style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}>
            <Text style={[styles.sectionTitle, { color: text, fontFamily: Fonts?.rounded }]}>
              {t('linksSection')}
            </Text>
            {LINK_ROWS.map((link, idx) => (
              <View key={link.key}>
                {idx > 0 ? <View style={styles.linkDivider} /> : null}
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={t(`a11y.${link.key}`)}
                  onPress={onOpenLink(link.url)}
                  style={styles.linkRow}
                >
                  <Text style={[styles.linkLabel, { color: text, fontFamily: Fonts?.rounded }]}>
                    {t(link.key)}
                  </Text>
                  <Text style={[styles.linkChevron, { color: muted, fontFamily: Fonts?.rounded }]}>
                    ›
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Version footer */}
          <Text style={[styles.versionFooter, { color: muted, fontFamily: Fonts?.rounded }]}>
            {t('version', {
              version: Application.nativeApplicationVersion ?? '—',
              build: Application.nativeBuildVersion ?? '—',
            })}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20 },
  gateSafe: { flex: 1, paddingHorizontal: 20 },
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
  gateContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  gateTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 8,
  },
  gateHint: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  gateButton: {
    overflow: 'hidden',
    minWidth: 240,
    paddingHorizontal: 32,
    paddingVertical: 22,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gateFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    opacity: 0.25,
  },
  gateButtonText: {
    fontSize: 20,
    fontWeight: '900',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  statsLine: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 12,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  rowSub: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  actionGlyph: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
  },
  sliderRow: {
    paddingTop: 12,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    marginTop: 24,
    marginBottom: 8,
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: '900',
  },
  resetButtonSub: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  linkLabel: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  linkChevron: {
    fontSize: 22,
    lineHeight: 22,
    marginLeft: 12,
  },
  linkDivider: {
    height: 1,
    backgroundColor: '#D6D2EA',
    opacity: 0.7,
  },
  versionFooter: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
});
