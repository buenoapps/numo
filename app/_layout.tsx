import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import '@/lib/i18n';
import { SettingsProvider } from '@/lib/settings';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SettingsProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="play" options={{ animation: 'fade' }} />
          <Stack.Screen name="count" options={{ animation: 'fade' }} />
          <Stack.Screen name="listen" options={{ animation: 'fade' }} />
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SettingsProvider>
  );
}
