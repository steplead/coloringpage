/**
 * Utility functions for working with translations
 */

import en from './translations/en.json';
import zh from './translations/zh.json';
import es from './translations/es.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import ja from './translations/ja.json';
import ko from './translations/ko.json';
import ru from './translations/ru.json';

// A cache to store translations to avoid reloading them
const translationsCache: Record<string, any> = {
  en,
  zh,
  es,
  fr,
  de,
  ja,
  ko,
  ru
};

/**
 * Get translations for a specific language
 */
export async function getTranslations(lang: string): Promise<any> {
  // If translations are cached, return them
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  // Try to dynamically load the translations
  try {
    // For languages not preloaded, load them dynamically
    if (!Object.keys(translationsCache).includes(lang)) {
      const module = await import(`./translations/${lang}.json`);
      translationsCache[lang] = module.default;
      return module.default;
    }
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
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
  // Keep all directly imported languages (most used) but clear the rest
  const importedLanguages = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru'];
  Object.keys(translationsCache).forEach(key => {
    if (!importedLanguages.includes(key)) {
      delete translationsCache[key];
    }
  });
} 