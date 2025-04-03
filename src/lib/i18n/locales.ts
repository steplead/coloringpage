/**
 * Configuration for supported languages in the application
 */

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction?: 'ltr' | 'rtl';
}

/**
 * List of supported languages with their display information
 */
export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    direction: 'ltr',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    direction: 'ltr',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    direction: 'ltr',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    direction: 'ltr',
  },
];

/**
 * Get language information by language code
 */
export function getLanguageInfo(code: string): LanguageInfo | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

/**
 * Get native name display based on language code
 */
export function getLanguageNativeName(code: string): string {
  const lang = getLanguageInfo(code);
  return lang ? lang.nativeName : code;
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(code: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
} 