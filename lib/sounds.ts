import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

import { useSettings } from '@/lib/settings';

const successSource = require('@/assets/sounds/success.wav');
const wrongSource = require('@/assets/sounds/wrong.wav');

export function useSuccessSound(): () => void {
  const player = useAudioPlayer(successSource);
  const { settings } = useSettings();

  return useCallback(() => {
    if (!settings.soundCorrectEnabled) return;
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // Web / missing audio backend — fail silently, the gameplay still advances.
    }
  }, [player, settings.soundCorrectEnabled]);
}

export function useWrongSound(): () => void {
  const player = useAudioPlayer(wrongSource);
  const { settings } = useSettings();

  return useCallback(() => {
    if (!settings.soundWrongEnabled) return;
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // ignore — see useSuccessSound.
    }
  }, [player, settings.soundWrongEnabled]);
}
