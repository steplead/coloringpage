// Import all translation files
import enTranslations from './translations/en.json';
import zhTranslations from './translations/zh.json';
import esTranslations from './translations/es.json';
import frTranslations from './translations/fr.json';
import deTranslations from './translations/de.json';
import jaTranslations from './translations/ja.json';
import koTranslations from './translations/ko.json';
import ruTranslations from './translations/ru.json';
import { SUPPORTED_LANGUAGES } from './locales';

// Map of all translations
export const translations: Record<string, any> = {
  en: enTranslations,
  zh: zhTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  ru: ruTranslations,
};

// Cookie name for storing language preference
export const LANGUAGE_COOKIE = 'NEXT_LOCALE';

/**
 * Client-side language detection from navigator
 * @returns The detected language code
 */
export function detectClientLanguage(): string {
  if (typeof window === 'undefined') {
    return 'en'; // Default to English on the server
  }
  
  // Try to get from localStorage first
  const storedLang = localStorage.getItem(LANGUAGE_COOKIE);
  if (storedLang && isValidLanguage(storedLang)) {
    return storedLang;
  }
  
  // Check navigator language
  const browserLang = navigator.language?.substring(0, 2);
  if (browserLang && isValidLanguage(browserLang)) {
    return browserLang;
  }
  
  // Default to English
  return 'en';
}

// Type for translation variables
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TranslationVariables = Record<string, any>;

/**
 * Get translation for a specific key in the current language
 * @param language - The language code
 * @param key - The translation key in dot notation (e.g., 'common.button.save')
 * @param fallback - Optional fallback text if translation is not found
 * @returns The translated text
 */
export function getTranslation(language: string, key: string, fallback?: string): string {
  const lang = isValidLanguage(language) ? language : 'en';
  const keys = key.split('.');
  
  try {
    let value: any = translations[lang];
    
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    
    if (value !== undefined && typeof value === 'string') {
      return value;
    }
    
    // If not found in the target language, try fallback to English
    if (lang !== 'en') {
      let enValue: any = translations['en'];
      for (const k of keys) {
        if (enValue === undefined) break;
        enValue = enValue[k];
      }
      
      if (enValue !== undefined && typeof enValue === 'string') {
        return enValue;
      }
    }
    
    // Use provided fallback or the key itself
    return fallback || key;
  } catch (error) {
    console.error(`Translation error for key: ${key}`, error);
    return fallback || key;
  }
}

/**
 * Get all translations for a specific language
 * @param language - The language code
 * @returns The complete translation object
 */
export function getTranslations(language: string): any {
  return isValidLanguage(language) ? translations[language] : translations['en'];
}

/**
 * Check if a language is supported
 * @param language - The language code to check
 * @returns True if the language is supported
 */
export function isValidLanguage(language: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === language);
}

// Removed duplicated getTranslation and loadTranslations functions below
/*
// Helper function to get nested translations
export const getTranslation = (key: string, data: Record<string, any>, vars?: Record<string, any>): string => { // eslint-disable-line @typescript-eslint/no-explicit-any
  let translation = get(data, key);

  if (typeof translation !== 'string') {
    // ... existing code ...
  }

  // ... existing code ...
}

// Load translations from API endpoint
export const loadTranslations = async (locale: string): Promise<Record<string, any>> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!locales.includes(locale)) {
    locale = DEFAULT_LOCALE;
    // ... existing code ...
    console.log(`[i18n] Fetching translations for locale: ${locale} from ${apiUrl}`);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`[i18n] Failed to fetch translations for ${locale}: ${response.status}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return defaultTranslations[locale as keyof typeof defaultTranslations] || (defaultTranslations as any).en;
    }
    const data = await response.json();
    // ... existing code ...
    return data;
  } catch (error) {
    console.error(`[i18n] Error loading translations for ${locale}:`, error);
    // Fallback to default English translations on error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return defaultTranslations[locale as keyof typeof defaultTranslations] || (defaultTranslations as any).en;
  }
};

// ... existing code ... 
*/ 