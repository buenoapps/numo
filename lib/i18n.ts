import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

export const SUPPORTED_LOCALES = ['en', 'de', 'es', 'fr', 'it', 'zh', 'ja'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

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
    soundsDesc: 'Play a happy chime when an answer is correct.',
    comingSoon: 'More levels coming soon',
    comingSoonDesc:
      "We're working on bigger numbers, multiplication, and more games for Numo.",
    numbersTitle: 'Tap a number to hear it!',
    a11y: {
      openSettings: 'Open settings',
      closeSettings: 'Close settings',
      goHome: 'Go home',
      enableSubtraction: 'Enable subtraction',
      enableSounds: 'Enable sounds',
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
    soundsDesc: 'Bei richtiger Antwort einen fröhlichen Klang abspielen.',
    comingSoon: 'Bald gibt es mehr Levels',
    comingSoonDesc:
      'Wir arbeiten an größeren Zahlen, dem Einmaleins und weiteren Spielen für Numo.',
    numbersTitle: 'Tippe eine Zahl, um sie zu hören!',
    a11y: {
      openSettings: 'Einstellungen öffnen',
      closeSettings: 'Einstellungen schließen',
      goHome: 'Zurück zur Startseite',
      enableSubtraction: 'Subtraktion aktivieren',
      enableSounds: 'Töne aktivieren',
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
    soundsDesc: 'Reproducir un sonido alegre cuando la respuesta es correcta.',
    comingSoon: 'Más niveles próximamente',
    comingSoonDesc:
      'Estamos preparando números más grandes, multiplicación y más juegos para Numo.',
    numbersTitle: '¡Toca un número para escucharlo!',
    a11y: {
      openSettings: 'Abrir ajustes',
      closeSettings: 'Cerrar ajustes',
      goHome: 'Ir al inicio',
      enableSubtraction: 'Activar resta',
      enableSounds: 'Activar sonidos',
      answer: 'Respuesta {{value}}',
      play: 'Jugar {{label}}',
      speakNumber: 'Decir el número {{value}}',
    },
  },
  fr: {
    subtitle: 'Faisons des maths !',
    letsPlay: 'On joue !',
    add: 'Plus !',
    subtract: 'Moins !',
    numbers: 'Chiffres !',
    onFire: 'Super !',
    settings: 'Réglages',
    forGrownUps: 'Pour les adultes',
    subtractionLabel: 'Soustraction',
    subtractionDesc:
      'Ajouter des soustractions avec des résultats entre 0 et 10.',
    soundsLabel: 'Sons',
    soundsDesc: 'Jouer un son joyeux quand la réponse est correcte.',
    comingSoon: 'Plus de niveaux bientôt',
    comingSoonDesc:
      'Nous préparons de plus grands nombres, la multiplication et d’autres jeux pour Numo.',
    numbersTitle: 'Appuie sur un nombre pour l’entendre !',
    a11y: {
      openSettings: 'Ouvrir les réglages',
      closeSettings: 'Fermer les réglages',
      goHome: 'Retour à l’accueil',
      enableSubtraction: 'Activer la soustraction',
      enableSounds: 'Activer les sons',
      answer: 'Réponse {{value}}',
      play: 'Jouer : {{label}}',
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
    soundsDesc: 'Riproduci un suono allegro quando la risposta è corretta.',
    comingSoon: 'Altri livelli in arrivo',
    comingSoonDesc:
      'Stiamo lavorando a numeri più grandi, alla moltiplicazione e ad altri giochi per Numo.',
    numbersTitle: 'Tocca un numero per sentirlo!',
    a11y: {
      openSettings: 'Apri impostazioni',
      closeSettings: 'Chiudi impostazioni',
      goHome: 'Torna alla home',
      enableSubtraction: 'Attiva sottrazione',
      enableSounds: 'Attiva suoni',
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
    soundsDesc: '答对时播放欢快的声音。',
    comingSoon: '更多关卡即将推出',
    comingSoonDesc: '我们正在为 Numo 准备更大的数字、乘法和更多游戏。',
    numbersTitle: '点击数字听一听！',
    a11y: {
      openSettings: '打开设置',
      closeSettings: '关闭设置',
      goHome: '回到首页',
      enableSubtraction: '启用减法',
      enableSounds: '启用声音',
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
    soundsDesc: 'せいかいのときにたのしいおとをならします。',
    comingSoon: 'もっとレベルがふえます',
    comingSoonDesc:
      'もっとおおきなかず、かけざん、ほかのゲームをじゅんびちゅうです。',
    numbersTitle: 'すうじをタップしてきこう！',
    a11y: {
      openSettings: 'せっていをひらく',
      closeSettings: 'せっていをとじる',
      goHome: 'ホームにもどる',
      enableSubtraction: 'ひきざんをゆうこうにする',
      enableSounds: 'おとをゆうこうにする',
      answer: 'こたえ {{value}}',
      play: '{{label}} であそぶ',
      speakNumber: 'すうじ {{value}} をよむ',
    },
  },
};

function detectLocale(): SupportedLocale {
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
i18n.locale = detectLocale();

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

/** BCP-47-ish tag for APIs that need a region (e.g., Speech). */
export function getSpeechLocale(): string {
  const map: Record<SupportedLocale, string> = {
    en: 'en-US',
    de: 'de-DE',
    es: 'es-ES',
    fr: 'fr-FR',
    it: 'it-IT',
    zh: 'zh-CN',
    ja: 'ja-JP',
  };
  return map[i18n.locale as SupportedLocale] ?? 'en-US';
}
