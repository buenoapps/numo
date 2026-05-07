import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

import { useSettings } from '@/lib/settings';

const successSource = require('@/assets/sounds/success.wav');

export function useSuccessSound(): () => void {
  const player = useAudioPlayer(successSource);
  const { settings } = useSettings();

  return useCallback(() => {
    if (!settings.soundsEnabled) return;
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // Web / missing audio backend — fail silently, the gameplay still advances.
    }
  }, [player, settings.soundsEnabled]);
}
