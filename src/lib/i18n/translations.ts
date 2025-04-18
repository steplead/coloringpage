/**
 * Utility functions for working with translations
 */

import en from './translations/en.json';
import zh from './translations/zh.json';
import get from 'lodash.get';

// A cache to store translations to avoid reloading them
const translationsCache: Record<string, any> = {
  en,
  zh
};

export type TranslationVariables = Record<string, string | number>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TranslationData = Record<string, any>;

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
    // For languages other than English and Chinese, load them dynamically
    if (lang !== 'en' && lang !== 'zh') {
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
  // Keep English and Chinese (most used) but clear the rest
  Object.keys(translationsCache).forEach(key => {
    if (key !== 'en' && key !== 'zh') {
      delete translationsCache[key];
    }
  });
}

// Helper function to get nested translations
export function getTranslationSync(
  key: string, 
  vars?: TranslationVariables, 
  data: TranslationData | null = null,
  fallback: string = key
): string {
  if (!data) {
    return fallback;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let translation = get(data, key) as any; 

  if (typeof translation !== 'string') {
    return fallback; 
  }
  return translation;
}

// 注意：以上每个函数都已经使用export关键字导出，不需要重复导出 