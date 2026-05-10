import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useT, type LocaleOverride } from '@/lib/i18n';
import { useSettings, type NumbersRange } from '@/lib/settings';

export default function SettingsScreen() {
  const {
    settings,
    hydrated,
    setSubtractionEnabled,
    setSoundsEnabled,
    setLanguageOverride,
    setNumbersRange,
  } = useSettings();
  const t = useT();
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const primary = useThemeColor({}, 'primary');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');
  const background = useThemeColor({}, 'background');

  const languageOptions: { value: LocaleOverride; label: string }[] = [
    { value: 'device', label: t('languageSystem') },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
    { value: 'it', label: 'Italiano' },
    { value: 'es', label: 'Español' },
    { value: 'pt', label: 'Português' },
    { value: 'pl', label: 'Polski' },
    { value: 'hr', label: 'Hrvatski' },
  ];

  const rangeOptions: { value: NumbersRange; label: string }[] = [
    { value: 10, label: '0–10' },
    { value: 21, label: '0–21' },
  ];

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
          <Text style={[styles.parentNote, { color: muted, fontFamily: Fonts?.rounded }]}>
            {t('forGrownUps')}
          </Text>

          <View style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: text, fontFamily: Fonts?.rounded }]}>
                  {t('subtractionLabel')}
                </Text>
                <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
                  {t('subtractionDesc')}
                </Text>
              </View>
              <Switch
                accessibilityLabel={t('a11y.enableSubtraction')}
                value={settings.subtractionEnabled}
                onValueChange={setSubtractionEnabled}
                disabled={!hydrated}
                trackColor={{ true: primary, false: '#D6D2EA' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: text, fontFamily: Fonts?.rounded }]}>
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

          <View style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}>
            <Text style={[styles.rowTitle, { color: text, fontFamily: Fonts?.rounded }]}>
              {t('numbersRangeLabel')}
            </Text>
            <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
              {t('numbersRangeDesc')}
            </Text>
            <View style={styles.chipRow}>
              {rangeOptions.map((opt) => {
                const active = settings.numbersRange === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    disabled={!hydrated}
                    onPress={() => setNumbersRange(opt.value)}
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
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}>
            <Text style={[styles.rowTitle, { color: text, fontFamily: Fonts?.rounded }]}>
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
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
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
  parentNote: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 4,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  rowSub: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
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
});
