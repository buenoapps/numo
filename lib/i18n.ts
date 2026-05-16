import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { useMemo, useSyncExternalStore } from 'react';

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
    listen: 'Listen!',
    count: 'Count!',
    add: 'Plus',
    subtract: 'Minus',
    onFire: 'On fire!',
    settings: 'Settings',
    soundsLabel: 'Sounds',
    soundsDesc: 'Play a chime and read problems aloud.',
    language: 'Language',
    languageSystem: 'System',
    listenTitle: 'Tap a number to hear it!',
    countTitle: 'How many do you see?',
    sectionListen: 'Listen',
    sectionCount: 'Count',
    sectionAdd: 'Plus',
    sectionSub: 'Minus',
    show: 'Show on home',
    showDesc: 'Let your child open this page.',
    includeZero: 'Include zero',
    includeZeroDesc: 'Allow 0 in problems.',
    untilLabel: 'Up to {{value}}',
    restoreDefaults: 'Restore defaults',
    restoreDefaultsDesc: 'Remove every saved setting and start fresh.',
    a11y: {
      openSettings: 'Open settings',
      closeSettings: 'Close settings',
      goHome: 'Go home',
      enableSounds: 'Enable sounds',
      pickLanguage: 'Pick language: {{label}}',
      answer: 'Answer {{value}}',
      play: 'Play {{label}}',
      speakNumber: 'Speak number {{value}}',
      enablePage: 'Show {{label}} on home',
      includeZeroFor: 'Include zero in {{label}}',
      untilFor: '{{label}} up to {{value}}',
      restoreDefaults: 'Restore default settings',
    },
  },
  de: {
    subtitle: 'Lass uns rechnen!',
    listen: 'Hören!',
    count: 'Zählen!',
    add: 'Plus',
    subtract: 'Minus',
    onFire: 'Super!',
    settings: 'Einstellungen',
    soundsLabel: 'Töne',
    soundsDesc: 'Klang abspielen und Aufgaben vorlesen.',
    language: 'Sprache',
    languageSystem: 'Gerät',
    listenTitle: 'Tippe eine Zahl, um sie zu hören!',
    countTitle: 'Wie viele siehst du?',
    sectionListen: 'Hören',
    sectionCount: 'Zählen',
    sectionAdd: 'Plus',
    sectionSub: 'Minus',
    show: 'Auf Startseite anzeigen',
    showDesc: 'Deinem Kind diese Seite zugänglich machen.',
    includeZero: 'Null einbeziehen',
    includeZeroDesc: 'Die 0 in Aufgaben zulassen.',
    untilLabel: 'Bis {{value}}',
    restoreDefaults: 'Standard wiederherstellen',
    restoreDefaultsDesc: 'Alle gespeicherten Einstellungen löschen.',
    a11y: {
      openSettings: 'Einstellungen öffnen',
      closeSettings: 'Einstellungen schließen',
      goHome: 'Zurück zur Startseite',
      enableSounds: 'Töne aktivieren',
      pickLanguage: 'Sprache wählen: {{label}}',
      answer: 'Antwort {{value}}',
      play: '{{label}} spielen',
      speakNumber: 'Zahl {{value}} sprechen',
      enablePage: '{{label}} auf Startseite anzeigen',
      includeZeroFor: 'Null in {{label}} einbeziehen',
      untilFor: '{{label}} bis {{value}}',
      restoreDefaults: 'Standardeinstellungen wiederherstellen',
    },
  },
  es: {
    subtitle: '¡Vamos a hacer mate!',
    listen: '¡Escuchar!',
    count: '¡Contar!',
    add: 'Más',
    subtract: 'Menos',
    onFire: '¡Genial!',
    settings: 'Ajustes',
    soundsLabel: 'Sonidos',
    soundsDesc: 'Reproducir un sonido y leer las preguntas en voz alta.',
    language: 'Idioma',
    languageSystem: 'Sistema',
    listenTitle: '¡Toca un número para escucharlo!',
    countTitle: '¿Cuántos ves?',
    sectionListen: 'Escuchar',
    sectionCount: 'Contar',
    sectionAdd: 'Más',
    sectionSub: 'Menos',
    show: 'Mostrar en inicio',
    showDesc: 'Permite a tu hija o hijo abrir esta página.',
    includeZero: 'Incluir cero',
    includeZeroDesc: 'Permitir el 0 en los problemas.',
    untilLabel: 'Hasta {{value}}',
    restoreDefaults: 'Restablecer ajustes',
    restoreDefaultsDesc: 'Borra todos los ajustes guardados.',
    a11y: {
      openSettings: 'Abrir ajustes',
      closeSettings: 'Cerrar ajustes',
      goHome: 'Ir al inicio',
      enableSounds: 'Activar sonidos',
      pickLanguage: 'Elegir idioma: {{label}}',
      answer: 'Respuesta {{value}}',
      play: 'Jugar {{label}}',
      speakNumber: 'Decir el número {{value}}',
      enablePage: 'Mostrar {{label}} en inicio',
      includeZeroFor: 'Incluir cero en {{label}}',
      untilFor: '{{label}} hasta {{value}}',
      restoreDefaults: 'Restablecer los ajustes por defecto',
    },
  },
  fr: {
    subtitle: 'Faisons des maths !',
    listen: 'Écouter !',
    count: 'Compter !',
    add: 'Plus',
    subtract: 'Moins',
    onFire: 'Super !',
    settings: 'Réglages',
    soundsLabel: 'Sons',
    soundsDesc: 'Jouer un son et lire les questions à voix haute.',
    language: 'Langue',
    languageSystem: 'Système',
    listenTitle: 'Appuie sur un nombre pour l’entendre !',
    countTitle: 'Combien tu en vois ?',
    sectionListen: 'Écouter',
    sectionCount: 'Compter',
    sectionAdd: 'Plus',
    sectionSub: 'Moins',
    show: 'Afficher sur l’accueil',
    showDesc: 'Rends cette page accessible à ton enfant.',
    includeZero: 'Inclure zéro',
    includeZeroDesc: 'Autoriser 0 dans les questions.',
    untilLabel: 'Jusqu’à {{value}}',
    restoreDefaults: 'Restaurer les réglages',
    restoreDefaultsDesc: 'Efface tous les réglages enregistrés.',
    a11y: {
      openSettings: 'Ouvrir les réglages',
      closeSettings: 'Fermer les réglages',
      goHome: 'Retour à l’accueil',
      enableSounds: 'Activer les sons',
      pickLanguage: 'Choisir la langue : {{label}}',
      answer: 'Réponse {{value}}',
      play: 'Jouer : {{label}}',
      speakNumber: 'Dire le nombre {{value}}',
      enablePage: 'Afficher {{label}} sur l’accueil',
      includeZeroFor: 'Inclure zéro dans {{label}}',
      untilFor: '{{label}} jusqu’à {{value}}',
      restoreDefaults: 'Restaurer les réglages par défaut',
    },
  },
  it: {
    subtitle: 'Facciamo matematica!',
    listen: 'Ascolta!',
    count: 'Conta!',
    add: 'Più',
    subtract: 'Meno',
    onFire: 'Forte!',
    settings: 'Impostazioni',
    soundsLabel: 'Suoni',
    soundsDesc: 'Riprodurre un suono e leggere le domande ad alta voce.',
    language: 'Lingua',
    languageSystem: 'Sistema',
    listenTitle: 'Tocca un numero per sentirlo!',
    countTitle: 'Quanti ne vedi?',
    sectionListen: 'Ascoltare',
    sectionCount: 'Contare',
    sectionAdd: 'Più',
    sectionSub: 'Meno',
    show: 'Mostra sulla home',
    showDesc: 'Permetti a tuo figlio o tua figlia di aprire questa pagina.',
    includeZero: 'Includere zero',
    includeZeroDesc: 'Consentire lo 0 nei problemi.',
    untilLabel: 'Fino a {{value}}',
    restoreDefaults: 'Ripristina impostazioni',
    restoreDefaultsDesc: 'Cancella tutte le impostazioni salvate.',
    a11y: {
      openSettings: 'Apri impostazioni',
      closeSettings: 'Chiudi impostazioni',
      goHome: 'Torna alla home',
      enableSounds: 'Attiva suoni',
      pickLanguage: 'Scegli lingua: {{label}}',
      answer: 'Risposta {{value}}',
      play: 'Gioca a {{label}}',
      speakNumber: 'Pronuncia il numero {{value}}',
      enablePage: 'Mostra {{label}} sulla home',
      includeZeroFor: 'Includere lo zero in {{label}}',
      untilFor: '{{label}} fino a {{value}}',
      restoreDefaults: 'Ripristina le impostazioni predefinite',
    },
  },
  pt: {
    subtitle: 'Vamos fazer matemática!',
    listen: 'Ouvir!',
    count: 'Contar!',
    add: 'Mais',
    subtract: 'Menos',
    onFire: 'Mandou bem!',
    settings: 'Ajustes',
    soundsLabel: 'Sons',
    soundsDesc: 'Tocar um som e ler as perguntas em voz alta.',
    language: 'Idioma',
    languageSystem: 'Sistema',
    listenTitle: 'Toque em um número para ouvi-lo!',
    countTitle: 'Quantos você vê?',
    sectionListen: 'Ouvir',
    sectionCount: 'Contar',
    sectionAdd: 'Mais',
    sectionSub: 'Menos',
    show: 'Mostrar no início',
    showDesc: 'Deixa que a criança abra esta página.',
    includeZero: 'Incluir zero',
    includeZeroDesc: 'Permitir 0 nos problemas.',
    untilLabel: 'Até {{value}}',
    restoreDefaults: 'Restaurar padrões',
    restoreDefaultsDesc: 'Apaga todas as configurações salvas.',
    a11y: {
      openSettings: 'Abrir ajustes',
      closeSettings: 'Fechar ajustes',
      goHome: 'Ir para o início',
      enableSounds: 'Ativar sons',
      pickLanguage: 'Escolher idioma: {{label}}',
      answer: 'Resposta {{value}}',
      play: 'Jogar {{label}}',
      speakNumber: 'Falar o número {{value}}',
      enablePage: 'Mostrar {{label}} no início',
      includeZeroFor: 'Incluir zero em {{label}}',
      untilFor: '{{label}} até {{value}}',
      restoreDefaults: 'Restaurar configurações padrão',
    },
  },
  pl: {
    subtitle: 'Pobawmy się matematyką!',
    listen: 'Posłuchaj!',
    count: 'Licz!',
    add: 'Plus',
    subtract: 'Minus',
    onFire: 'Super!',
    settings: 'Ustawienia',
    soundsLabel: 'Dźwięki',
    soundsDesc: 'Odtwarzaj dźwięk i czytaj pytania na głos.',
    language: 'Język',
    languageSystem: 'System',
    listenTitle: 'Stuknij liczbę, aby ją usłyszeć!',
    countTitle: 'Ile widzisz?',
    sectionListen: 'Słuchanie',
    sectionCount: 'Liczenie',
    sectionAdd: 'Plus',
    sectionSub: 'Minus',
    show: 'Pokaż na ekranie głównym',
    showDesc: 'Udostępnij tę stronę dziecku.',
    includeZero: 'Uwzględnij zero',
    includeZeroDesc: 'Zezwól na 0 w zadaniach.',
    untilLabel: 'Do {{value}}',
    restoreDefaults: 'Przywróć domyślne',
    restoreDefaultsDesc: 'Usuń wszystkie zapisane ustawienia.',
    a11y: {
      openSettings: 'Otwórz ustawienia',
      closeSettings: 'Zamknij ustawienia',
      goHome: 'Wróć do strony głównej',
      enableSounds: 'Włącz dźwięki',
      pickLanguage: 'Wybierz język: {{label}}',
      answer: 'Odpowiedź {{value}}',
      play: 'Graj w {{label}}',
      speakNumber: 'Wypowiedz liczbę {{value}}',
      enablePage: 'Pokaż {{label}} na ekranie głównym',
      includeZeroFor: 'Uwzględnij zero w {{label}}',
      untilFor: '{{label}} do {{value}}',
      restoreDefaults: 'Przywróć ustawienia domyślne',
    },
  },
  hr: {
    subtitle: 'Hajdemo računati!',
    listen: 'Slušaj!',
    count: 'Broji!',
    add: 'Plus',
    subtract: 'Minus',
    onFire: 'Odlično!',
    settings: 'Postavke',
    soundsLabel: 'Zvukovi',
    soundsDesc: 'Pusti zvuk i naglas pročitaj pitanja.',
    language: 'Jezik',
    languageSystem: 'Sustav',
    listenTitle: 'Dodirni broj da ga čuješ!',
    countTitle: 'Koliko ih vidiš?',
    sectionListen: 'Slušanje',
    sectionCount: 'Brojanje',
    sectionAdd: 'Plus',
    sectionSub: 'Minus',
    show: 'Prikaži na početnoj',
    showDesc: 'Omogući djetetu da otvori ovu stranicu.',
    includeZero: 'Uključi nulu',
    includeZeroDesc: 'Dopusti 0 u zadacima.',
    untilLabel: 'Do {{value}}',
    restoreDefaults: 'Vrati zadano',
    restoreDefaultsDesc: 'Obriši sve spremljene postavke.',
    a11y: {
      openSettings: 'Otvori postavke',
      closeSettings: 'Zatvori postavke',
      goHome: 'Idi na početnu',
      enableSounds: 'Omogući zvukove',
      pickLanguage: 'Odaberi jezik: {{label}}',
      answer: 'Odgovor {{value}}',
      play: 'Igraj {{label}}',
      speakNumber: 'Izgovori broj {{value}}',
      enablePage: 'Prikaži {{label}} na početnoj',
      includeZeroFor: 'Uključi nulu u {{label}}',
      untilFor: '{{label}} do {{value}}',
      restoreDefaults: 'Vrati zadane postavke',
    },
  },
  zh: {
    subtitle: '我们来做数学！',
    listen: '听一听！',
    count: '数一数！',
    add: '加',
    subtract: '减',
    onFire: '太棒了！',
    settings: '设置',
    soundsLabel: '声音',
    soundsDesc: '播放音效并朗读题目。',
    language: '语言',
    languageSystem: '系统',
    listenTitle: '点击数字听一听！',
    countTitle: '你看到几个？',
    sectionListen: '听一听',
    sectionCount: '数一数',
    sectionAdd: '加',
    sectionSub: '减',
    show: '在主页显示',
    showDesc: '让孩子可以打开此页面。',
    includeZero: '包含零',
    includeZeroDesc: '允许题目中出现 0。',
    untilLabel: '最多到 {{value}}',
    restoreDefaults: '恢复默认设置',
    restoreDefaultsDesc: '删除所有已保存的设置。',
    a11y: {
      openSettings: '打开设置',
      closeSettings: '关闭设置',
      goHome: '回到首页',
      enableSounds: '启用声音',
      pickLanguage: '选择语言：{{label}}',
      answer: '答案 {{value}}',
      play: '玩{{label}}',
      speakNumber: '读出数字 {{value}}',
      enablePage: '在主页显示{{label}}',
      includeZeroFor: '在{{label}}中包含 0',
      untilFor: '{{label}}最多到 {{value}}',
      restoreDefaults: '恢复默认设置',
    },
  },
  ja: {
    subtitle: 'さんすうしよう！',
    listen: 'きく！',
    count: 'かぞえる！',
    add: 'プラス',
    subtract: 'マイナス',
    onFire: 'すごい！',
    settings: 'せってい',
    soundsLabel: 'おと',
    soundsDesc: 'おとをならし、もんだいをよみあげます。',
    language: 'げんご',
    languageSystem: 'システム',
    listenTitle: 'すうじをタップしてきこう！',
    countTitle: 'いくつあるかな？',
    sectionListen: 'きく',
    sectionCount: 'かぞえる',
    sectionAdd: 'プラス',
    sectionSub: 'マイナス',
    show: 'ホームにひょうじ',
    showDesc: 'おこさまがこのページをひらけるようにします。',
    includeZero: 'ゼロをふくむ',
    includeZeroDesc: 'もんだいに 0 をゆるす。',
    untilLabel: '{{value}} まで',
    restoreDefaults: 'しょきにもどす',
    restoreDefaultsDesc: 'ほぞんしたせっていをすべてけします。',
    a11y: {
      openSettings: 'せっていをひらく',
      closeSettings: 'せっていをとじる',
      goHome: 'ホームにもどる',
      enableSounds: 'おとをゆうこうにする',
      pickLanguage: 'げんごをえらぶ：{{label}}',
      answer: 'こたえ {{value}}',
      play: '{{label}} であそぶ',
      speakNumber: 'すうじ {{value}} をよむ',
      enablePage: '{{label}} をホームにひょうじ',
      includeZeroFor: '{{label}} にゼロをふくむ',
      untilFor: '{{label}} は {{value}} まで',
      restoreDefaults: 'しょきせっていにもどす',
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
 * Hook form of t(). Subscribes the calling component to locale changes and
 * returns a translator bound to the active locale.
 *
 * Two things matter here:
 *  - `useSyncExternalStore` makes the component re-render when the locale
 *    flips.
 *  - The returned function is a new reference whenever the locale changes,
 *    and it passes the locale explicitly to `i18n.t`. Without that, the
 *    React Compiler caches JSX cells like `<Text>{t('foo')}</Text>` against
 *    a stable `t` reference and serves stale translations even though the
 *    component re-renders.
 */
export function useT(): (key: string, options?: Record<string, unknown>) => string {
  const locale = useSyncExternalStore(_subscribe, _snapshot, _snapshot);
  return useMemo(
    () =>
      (key: string, options?: Record<string, unknown>) =>
        i18n.t(key, { locale, ...options }),
    [locale],
  );
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
