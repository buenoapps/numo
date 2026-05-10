import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { useSyncExternalStore } from 'react';

export const SUPPORTED_LOCALES = [
  'en',
  'de',
  'es',
  'fr',
  'it',
  'pt',
  'pl',
  'hr',
  'zh',
  'ja',
] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Override values the user can pick from the Settings screen. */
export type LocaleOverride = 'device' | SupportedLocale;

const translations = {
  en: {
    subtitle: "Let's do math!",
    letsPlay: "Let's Play!",
    add: 'Add!',
    subtract: 'Take away!',
    numbers: 'Numbers!',
    onFire: 'On fire!',
    settings: 'Settings',
    forGrownUps: 'For grown-ups',
    subtractionLabel: 'Subtraction',
    subtractionDesc: 'Add minus problems with results 0–10.',
    soundsLabel: 'Sounds',
    soundsDesc: 'Play a chime and read problems aloud.',
    numbersRangeLabel: 'Numbers range',
    numbersRangeDesc: 'How far the Numbers page counts.',
    language: 'Language',
    languageSystem: 'System',
    numbersTitle: 'Tap a number to hear it!',
    a11y: {
      openSettings: 'Open settings',
      closeSettings: 'Close settings',
      goHome: 'Go home',
      enableSubtraction: 'Enable subtraction',
      enableSounds: 'Enable sounds',
      pickLanguage: 'Pick language: {{label}}',
      answer: 'Answer {{value}}',
      play: 'Play {{label}}',
      speakNumber: 'Speak number {{value}}',
    },
  },
  de: {
    subtitle: 'Lass uns rechnen!',
    letsPlay: "Los geht's!",
    add: 'Plus!',
    subtract: 'Minus!',
    numbers: 'Zahlen!',
    onFire: 'Super!',
    settings: 'Einstellungen',
    forGrownUps: 'Für Erwachsene',
    subtractionLabel: 'Subtraktion',
    subtractionDesc: 'Minusaufgaben mit Ergebnissen von 0 bis 10.',
    soundsLabel: 'Töne',
    soundsDesc: 'Klang abspielen und Aufgaben vorlesen.',
    numbersRangeLabel: 'Zahlenbereich',
    numbersRangeDesc: 'Wie weit die Zahlenseite zählt.',
    language: 'Sprache',
    languageSystem: 'Gerät',
    numbersTitle: 'Tippe eine Zahl, um sie zu hören!',
    a11y: {
      openSettings: 'Einstellungen öffnen',
      closeSettings: 'Einstellungen schließen',
      goHome: 'Zurück zur Startseite',
      enableSubtraction: 'Subtraktion aktivieren',
      enableSounds: 'Töne aktivieren',
      pickLanguage: 'Sprache wählen: {{label}}',
      answer: 'Antwort {{value}}',
      play: '{{label}} spielen',
      speakNumber: 'Zahl {{value}} sprechen',
    },
  },
  es: {
    subtitle: '¡Vamos a hacer mate!',
    letsPlay: '¡A jugar!',
    add: '¡Sumar!',
    subtract: '¡Restar!',
    numbers: '¡Números!',
    onFire: '¡Genial!',
    settings: 'Ajustes',
    forGrownUps: 'Para adultos',
    subtractionLabel: 'Resta',
    subtractionDesc: 'Añadir problemas de resta con resultados entre 0 y 10.',
    soundsLabel: 'Sonidos',
    soundsDesc: 'Reproducir un sonido y leer las preguntas en voz alta.',
    numbersRangeLabel: 'Rango de números',
    numbersRangeDesc: 'Hasta cuánto cuenta la pantalla de Números.',
    language: 'Idioma',
    languageSystem: 'Sistema',
    numbersTitle: '¡Toca un número para escucharlo!',
    a11y: {
      openSettings: 'Abrir ajustes',
      closeSettings: 'Cerrar ajustes',
      goHome: 'Ir al inicio',
      enableSubtraction: 'Activar resta',
      enableSounds: 'Activar sonidos',
      pickLanguage: 'Elegir idioma: {{label}}',
      answer: 'Respuesta {{value}}',
      play: 'Jugar {{label}}',
      speakNumber: 'Decir el número {{value}}',
    },
  },
  fr: {
    subtitle: 'Faisons des maths !',
    letsPlay: 'On joue !',
    add: 'Plus !',
    subtract: 'Moins !',
    numbers: 'Chiffres !',
    onFire: 'Super !',
    settings: 'Réglages',
    forGrownUps: 'Pour les adultes',
    subtractionLabel: 'Soustraction',
    subtractionDesc:
      'Ajouter des soustractions avec des résultats entre 0 et 10.',
    soundsLabel: 'Sons',
    soundsDesc: 'Jouer un son et lire les questions à voix haute.',
    numbersRangeLabel: 'Plage de nombres',
    numbersRangeDesc: 'Jusqu’où compte la page Chiffres.',
    language: 'Langue',
    languageSystem: 'Système',
    numbersTitle: 'Appuie sur un nombre pour l’entendre !',
    a11y: {
      openSettings: 'Ouvrir les réglages',
      closeSettings: 'Fermer les réglages',
      goHome: 'Retour à l’accueil',
      enableSubtraction: 'Activer la soustraction',
      enableSounds: 'Activer les sons',
      pickLanguage: 'Choisir la langue : {{label}}',
      answer: 'Réponse {{value}}',
      play: 'Jouer : {{label}}',
      speakNumber: 'Dire le nombre {{value}}',
    },
  },
  it: {
    subtitle: 'Facciamo matematica!',
    letsPlay: 'Giochiamo!',
    add: 'Più!',
    subtract: 'Meno!',
    numbers: 'Numeri!',
    onFire: 'Forte!',
    settings: 'Impostazioni',
    forGrownUps: 'Per adulti',
    subtractionLabel: 'Sottrazione',
    subtractionDesc: 'Aggiungi problemi di sottrazione con risultati da 0 a 10.',
    soundsLabel: 'Suoni',
    soundsDesc: 'Riprodurre un suono e leggere le domande ad alta voce.',
    numbersRangeLabel: 'Intervallo numeri',
    numbersRangeDesc: 'Fino a quanto conta la pagina Numeri.',
    language: 'Lingua',
    languageSystem: 'Sistema',
    numbersTitle: 'Tocca un numero per sentirlo!',
    a11y: {
      openSettings: 'Apri impostazioni',
      closeSettings: 'Chiudi impostazioni',
      goHome: 'Torna alla home',
      enableSubtraction: 'Attiva sottrazione',
      enableSounds: 'Attiva suoni',
      pickLanguage: 'Scegli lingua: {{label}}',
      answer: 'Risposta {{value}}',
      play: 'Gioca a {{label}}',
      speakNumber: 'Pronuncia il numero {{value}}',
    },
  },
  zh: {
    subtitle: '我们来做数学！',
    letsPlay: '开始玩！',
    add: '加法！',
    subtract: '减法！',
    numbers: '数字！',
    onFire: '太棒了！',
    settings: '设置',
    forGrownUps: '给家长',
    subtractionLabel: '减法',
    subtractionDesc: '添加结果在 0 到 10 之间的减法题。',
    soundsLabel: '声音',
    soundsDesc: '播放音效并朗读题目。',
    numbersRangeLabel: '数字范围',
    numbersRangeDesc: '数字页面计数的范围。',
    language: '语言',
    languageSystem: '系统',
    numbersTitle: '点击数字听一听！',
    a11y: {
      openSettings: '打开设置',
      closeSettings: '关闭设置',
      goHome: '回到首页',
      enableSubtraction: '启用减法',
      enableSounds: '启用声音',
      pickLanguage: '选择语言：{{label}}',
      answer: '答案 {{value}}',
      play: '玩{{label}}',
      speakNumber: '读出数字 {{value}}',
    },
  },
  ja: {
    subtitle: 'さんすうしよう！',
    letsPlay: 'あそぼう！',
    add: 'たしざん！',
    subtract: 'ひきざん！',
    numbers: 'すうじ！',
    onFire: 'すごい！',
    settings: 'せってい',
    forGrownUps: 'おとなのかたへ',
    subtractionLabel: 'ひきざん',
    subtractionDesc: '0〜10 のひきざんもんだいをついかします。',
    soundsLabel: 'おと',
    soundsDesc: 'おとをならし、もんだいをよみあげます。',
    numbersRangeLabel: 'すうじのはんい',
    numbersRangeDesc: 'すうじページのはんい。',
    language: 'げんご',
    languageSystem: 'システム',
    numbersTitle: 'すうじをタップしてきこう！',
    a11y: {
      openSettings: 'せっていをひらく',
      closeSettings: 'せっていをとじる',
      goHome: 'ホームにもどる',
      enableSubtraction: 'ひきざんをゆうこうにする',
      enableSounds: 'おとをゆうこうにする',
      pickLanguage: 'げんごをえらぶ：{{label}}',
      answer: 'こたえ {{value}}',
      play: '{{label}} であそぶ',
      speakNumber: 'すうじ {{value}} をよむ',
    },
  },
  pt: {
    subtitle: 'Vamos fazer matemática!',
    letsPlay: 'Vamos jogar!',
    add: 'Somar!',
    subtract: 'Subtrair!',
    numbers: 'Números!',
    onFire: 'Mandou bem!',
    settings: 'Ajustes',
    forGrownUps: 'Para adultos',
    subtractionLabel: 'Subtração',
    subtractionDesc: 'Adicionar problemas de subtração com resultados de 0 a 10.',
    soundsLabel: 'Sons',
    soundsDesc: 'Tocar um som e ler as perguntas em voz alta.',
    numbersRangeLabel: 'Faixa de números',
    numbersRangeDesc: 'Até onde a tela de Números conta.',
    language: 'Idioma',
    languageSystem: 'Sistema',
    numbersTitle: 'Toque em um número para ouvi-lo!',
    a11y: {
      openSettings: 'Abrir ajustes',
      closeSettings: 'Fechar ajustes',
      goHome: 'Ir para o início',
      enableSubtraction: 'Ativar subtração',
      enableSounds: 'Ativar sons',
      pickLanguage: 'Escolher idioma: {{label}}',
      answer: 'Resposta {{value}}',
      play: 'Jogar {{label}}',
      speakNumber: 'Falar o número {{value}}',
    },
  },
  pl: {
    subtitle: 'Pobawmy się matematyką!',
    letsPlay: 'Zagrajmy!',
    add: 'Dodaj!',
    subtract: 'Odejmij!',
    numbers: 'Liczby!',
    onFire: 'Super!',
    settings: 'Ustawienia',
    forGrownUps: 'Dla dorosłych',
    subtractionLabel: 'Odejmowanie',
    subtractionDesc: 'Dodaj zadania z odejmowania z wynikami od 0 do 10.',
    soundsLabel: 'Dźwięki',
    soundsDesc: 'Odtwarzaj dźwięk i czytaj pytania na głos.',
    numbersRangeLabel: 'Zakres liczb',
    numbersRangeDesc: 'Do ilu liczy strona Liczby.',
    language: 'Język',
    languageSystem: 'System',
    numbersTitle: 'Stuknij liczbę, aby ją usłyszeć!',
    a11y: {
      openSettings: 'Otwórz ustawienia',
      closeSettings: 'Zamknij ustawienia',
      goHome: 'Wróć do strony głównej',
      enableSubtraction: 'Włącz odejmowanie',
      enableSounds: 'Włącz dźwięki',
      pickLanguage: 'Wybierz język: {{label}}',
      answer: 'Odpowiedź {{value}}',
      play: 'Graj w {{label}}',
      speakNumber: 'Wypowiedz liczbę {{value}}',
    },
  },
  hr: {
    subtitle: 'Hajdemo računati!',
    letsPlay: 'Idemo se igrati!',
    add: 'Zbroji!',
    subtract: 'Oduzmi!',
    numbers: 'Brojevi!',
    onFire: 'Odlično!',
    settings: 'Postavke',
    forGrownUps: 'Za odrasle',
    subtractionLabel: 'Oduzimanje',
    subtractionDesc: 'Dodaj zadatke oduzimanja s rezultatima od 0 do 10.',
    soundsLabel: 'Zvukovi',
    soundsDesc: 'Pusti zvuk i naglas pročitaj pitanja.',
    numbersRangeLabel: 'Raspon brojeva',
    numbersRangeDesc: 'Dokle broji stranica Brojevi.',
    language: 'Jezik',
    languageSystem: 'Sustav',
    numbersTitle: 'Dodirni broj da ga čuješ!',
    a11y: {
      openSettings: 'Otvori postavke',
      closeSettings: 'Zatvori postavke',
      goHome: 'Idi na početnu',
      enableSubtraction: 'Omogući oduzimanje',
      enableSounds: 'Omogući zvukove',
      pickLanguage: 'Odaberi jezik: {{label}}',
      answer: 'Odgovor {{value}}',
      play: 'Igraj {{label}}',
      speakNumber: 'Izgovori broj {{value}}',
    },
  },
};

export function getDeviceLocale(): SupportedLocale {
  const locales = Localization.getLocales();
  for (const l of locales) {
    const code = (l.languageCode ?? '').toLowerCase();
    if ((SUPPORTED_LOCALES as readonly string[]).includes(code)) {
      return code as SupportedLocale;
    }
  }
  return 'en';
}

export const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

let _activeLocale: SupportedLocale = getDeviceLocale();
i18n.locale = _activeLocale;

// Minimal external store so React (and the React Compiler) can subscribe to
// locale changes. Without this, components that read t() at render time but
// don't otherwise depend on the locale get auto-memoized to stale strings.
const _listeners = new Set<() => void>();
function _subscribe(cb: () => void): () => void {
  _listeners.add(cb);
  return () => {
    _listeners.delete(cb);
  };
}
function _snapshot(): SupportedLocale {
  return _activeLocale;
}

/**
 * Apply the active locale based on the user's override choice. Notifies
 * subscribers via useSyncExternalStore so every t() consumer re-renders.
 *
 * Must be called from an event handler or effect, not during render — calling
 * listeners during another component's render is unsafe.
 */
export function applyLocale(override: LocaleOverride): SupportedLocale {
  const next: SupportedLocale = override === 'device' ? getDeviceLocale() : override;
  if (_activeLocale === next) return next;
  _activeLocale = next;
  i18n.locale = next;
  _listeners.forEach((l) => l());
  return next;
}

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

/**
 * Hook form of t(). Subscribes the calling component to locale changes so
 * the returned function always reflects the active locale even when other
 * inputs to the component are unchanged.
 */
export function useT(): typeof t {
  useSyncExternalStore(_subscribe, _snapshot, _snapshot);
  return t;
}

/** BCP-47-ish tag for APIs that need a region (e.g., Speech). */
export function getSpeechLocale(): string {
  const map: Record<SupportedLocale, string> = {
    en: 'en-US',
    de: 'de-DE',
    es: 'es-ES',
    fr: 'fr-FR',
    it: 'it-IT',
    pt: 'pt-BR',
    pl: 'pl-PL',
    hr: 'hr-HR',
    zh: 'zh-CN',
    ja: 'ja-JP',
  };
  return map[i18n.locale as SupportedLocale] ?? 'en-US';
}
