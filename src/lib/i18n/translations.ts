/**
 * Utility functions for working with translations
 */

import en from './translations/en.json';
import zh from './translations/zh.json';

// A cache to store translations to avoid reloading them
const translationsCache: Record<string, any> = {
  en,
  zh
};

/**
 * Get translations for a specific language
 */
export async function getTranslations(lang: string): Promise<any> {
  // If translations are cached, return them
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  // Only allow English and Chinese for now as those are the only translation files we have
  if (lang !== 'en' && lang !== 'zh') {
    console.warn(`Translation file for ${lang} not available, falling back to English`);
    return translationsCache['en'] || en;
  }

  // Fall back to English if the requested language is not available
  return translationsCache['en'] || en;
}

/**
 * Get a specific translation key from a language file
 */
export async function getTranslation(lang: string, key: string): Promise<string> {
  const translations = await getTranslations(lang);
  
  // Split the key by dots to navigate the nested structure
  const keys = key.split('.');
  let result = translations;
  
  // Traverse the translations object
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // If key not found, return the key itself as fallback
      return key;
    }
  }
  
  return typeof result === 'string' ? result : key;
}

/**
 * Clear the translations cache
 */
export function clearTranslationCache(): void {
  // Keep English and Chinese (most used) but clear the rest
  Object.keys(translationsCache).forEach(key => {
    if (key !== 'en' && key !== 'zh') {
      delete translationsCache[key];
    }
  });
} 