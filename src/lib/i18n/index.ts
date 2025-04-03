import { cookies } from 'next/headers';
import { SUPPORTED_LANGUAGES } from './locales';

// Import all translation files
import enTranslations from './translations/en.json';
import zhTranslations from './translations/zh.json';

// Map of all translations
const translations: Record<string, any> = {
  en: enTranslations,
  zh: zhTranslations,
};

// Cookie name for storing language preference
const LANGUAGE_COOKIE = 'preferred_language';

/**
 * Detect the user's preferred language from cookies or Accept-Language header
 * @param requestHeaders - Optional headers from the request
 * @returns The detected language code
 */
export function detectLanguage(requestHeaders?: Headers): string {
  // First check if there's a cookie with language preference
  const cookieStore = cookies();
  const languageCookie = cookieStore.get(LANGUAGE_COOKIE);
  
  if (languageCookie?.value && isValidLanguage(languageCookie.value)) {
    return languageCookie.value;
  }
  
  // If no valid cookie, check Accept-Language header
  if (requestHeaders) {
    const acceptLanguage = requestHeaders.get('Accept-Language');
    if (acceptLanguage) {
      // Parse the Accept-Language header to get language preferences in order
      const languages = acceptLanguage
        .split(',')
        .map(lang => {
          const [language, quality = 'q=1.0'] = lang.trim().split(';');
          const q = parseFloat(quality.substring(2)) || 0;
          return { language: language.substring(0, 2), quality: q };
        })
        .sort((a, b) => b.quality - a.quality);
      
      // Find the first supported language
      for (const { language } of languages) {
        if (isValidLanguage(language)) {
          return language;
        }
      }
    }
  }
  
  // Default to English if no valid language detected
  return 'en';
}

/**
 * Set the user's preferred language
 * @param language - The language code to set
 */
export function setLanguage(language: string): void {
  if (isValidLanguage(language)) {
    cookies().set(LANGUAGE_COOKIE, language, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
}

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
function isValidLanguage(language: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === language);
}

export { translations, LANGUAGE_COOKIE }; 