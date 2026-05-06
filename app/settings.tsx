import { router } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSettings } from '@/lib/settings';

export default function SettingsScreen() {
  const { settings, hydrated, setSubtractionEnabled } = useSettings();
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const primary = useThemeColor({}, 'primary');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'cardShadow');

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close settings"
            onPress={() => router.back()}
            style={styles.closeBtn}
            hitSlop={12}
          >
            <Text style={[styles.closeGlyph, { color: primary, fontFamily: Fonts?.rounded }]}>×</Text>
          </Pressable>
          <Text style={[styles.title, { color: text, fontFamily: Fonts?.rounded }]}>Settings</Text>
          <View style={styles.closeBtn} />
        </View>

        <Text style={[styles.parentNote, { color: muted, fontFamily: Fonts?.rounded }]}>
          For grown-ups
        </Text>

        <View style={[styles.card, { backgroundColor: card, shadowColor: shadow }]}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: text, fontFamily: Fonts?.rounded }]}>
                Subtraction
              </Text>
              <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
                Add minus problems with results 0–10.
              </Text>
            </View>
            <Switch
              accessibilityLabel="Enable subtraction"
              value={settings.subtractionEnabled}
              onValueChange={setSubtractionEnabled}
              disabled={!hydrated}
              trackColor={{ true: primary, false: '#D6D2EA' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.card, styles.comingSoon, { backgroundColor: card, shadowColor: shadow }]}>
          <Text style={[styles.rowTitle, { color: text, fontFamily: Fonts?.rounded }]}>
            More levels coming soon
          </Text>
          <Text style={[styles.rowSub, { color: muted, fontFamily: Fonts?.rounded }]}>
            We&apos;re working on bigger numbers, multiplication, and more games for Numo.
          </Text>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20 },
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
  comingSoon: {
    opacity: 0.85,
  },
});
