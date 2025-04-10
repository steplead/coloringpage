'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './index';
import Cookies from 'js-cookie';
import { LANGUAGE_COOKIE } from './index';

// Default to English translations as initial value
const defaultTranslations = translations.en;

interface TranslationContextType {
  translations: Record<string, any>;
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  isLoading: boolean;
  getTranslation: (key: string, fallback?: string) => string;
  refreshTranslations: () => Promise<void>;
  lastError: string | null;
}

const TranslationContext = createContext<TranslationContextType>({
  translations: defaultTranslations,
  language: 'en',
  setLanguage: async () => {},
  isLoading: false,
  getTranslation: () => '',
  refreshTranslations: async () => {},
  lastError: null,
});

export function useTranslation() {
  return useContext(TranslationContext);
}

interface TranslationProviderProps {
  children: ReactNode;
  initialLang?: string;
}

// Version flag to detect updates to translation files - increase whenever translations are updated
const TRANSLATION_VERSION = '1.3';

// Cache translations to avoid repeated fetches - add version suffix to localStorage key
const getStorageKey = (lang: string) => `translations_${lang}_v${TRANSLATION_VERSION}`;

// Initialize translation cache with English as default
const translationCache: Record<string, Record<string, any>> = {
  en: defaultTranslations
};

// Debug functions to help troubleshoot translation issues
const debugLog = (message: string, data?: any) => {
  if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'development' || localStorage.getItem('DEBUG_TRANSLATIONS') === 'true')) {
    console.log(`[Translation] ${message}`, data || '');
  }
};

// Try to load cached translations from localStorage - only run on client side
const initializeCache = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear any old version translations from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('translations_') && !key.includes(`_v${TRANSLATION_VERSION}`)) {
        debugLog(`Clearing outdated translation cache: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Load cached translations that match current version
    Object.keys(translations).forEach(lang => {
      const cached = localStorage.getItem(getStorageKey(lang));
      if (cached) {
        try {
          translationCache[lang] = JSON.parse(cached);
          debugLog(`Loaded cached translations for ${lang} from localStorage`);
        } catch (e) {
          console.error(`Failed to parse cached translations for ${lang}`, e);
        }
      }
    });
  } catch (e) {
    console.error('Error initializing translation cache from localStorage', e);
  }
};

export function TranslationProvider({ 
  children, 
  initialLang = 'en' 
}: TranslationProviderProps) {
  const [translationsData, setTranslationsData] = useState<Record<string, any>>(defaultTranslations);
  const [language, setLanguageState] = useState(initialLang);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Only run client-side initialization after hydration
  useEffect(() => {
    setIsClient(true);
    initializeCache();
    if (translationCache[initialLang]) {
      setTranslationsData(translationCache[initialLang]);
    } else if (initialLang !== 'en') {
      setIsLoading(true);
    }
  }, [initialLang]);

  // Function to get translation for a specific key
  const getTranslation = (key: string, fallback?: string): string => {
    try {
      const keys = key.split('.');
      let value: any = translationsData;
      
      // For absolute critical keys that must be present, provide a hardcoded fallback
      // This ensures that even if translation loading fails, critical UI elements still display
      const criticalKeys: Record<string, string> = {
        'home.methods.describe.title': '描述您想要的图像',
        'home.methods.describe.description': '输入文字描述，我们的AI将创建匹配的涂色页',
        'home.methods.style.title': '选择您喜欢的风格',
        'home.methods.style.description': '从多种艺术风格中选择，定制您的涂色页外观',
        'home.methods.advanced.title': '高级设置',
        'home.methods.advanced.description': '调整细节参数，获得完全符合您需求的涂色页',
      };
      
      // Check for critical key first
      if (language === 'zh' && criticalKeys[key]) {
        return criticalKeys[key];
      }
      
      for (const k of keys) {
        if (!value) break;
        value = value[k];
      }
      
      if (value !== undefined && typeof value === 'string') {
        return value;
      }
      
      // If in development mode, log warnings for missing translations
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Translation Missing] Key "${key}" not found in "${language}" translations.`);
      }
      
      // Always use the provided fallback or the last part of the key
      const lastKey = key.split('.').pop() || '';
      return fallback || lastKey || key;
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return fallback || key.split('.').pop() || key;
    }
  };

  // Function to manually refresh translations
  const refreshTranslations = async (): Promise<void> => {
    setIsLoading(true);
    setLastError(null);
    
    try {
      // Force fetch fresh translations for the current language
      const cacheBuster = Date.now(); // Add timestamp to prevent caching
      debugLog(`Manually refreshing translations for ${language}`);
      
      const response = await fetch(`/api/i18n?lang=${language}&v=${cacheBuster}&force=true`);
      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if data contains required translations
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Received empty translations data');
      }
      
      // Check for specific expected keys to validate data integrity
      if (!data.common || !data.home) {
        throw new Error('Translation data missing critical sections');
      }
      
      // Update cache
      translationCache[language] = data;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(getStorageKey(language), JSON.stringify(data));
          debugLog(`Updated translations cache for ${language}`);
        } catch (e) {
          console.error(`Failed to save translations to localStorage for ${language}`, e);
        }
      }
      
      setTranslationsData(data);
      debugLog(`Successfully refreshed translations for ${language}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error refreshing translations';
      console.error('Error refreshing translations:', errorMessage);
      setLastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to set language and fetch translations
  const setLanguage = async (lang: string): Promise<void> => {
    if (lang === language) return;
    
    setIsLoading(true);
    setLastError(null);
    
    // If we have cached translations, use them immediately
    if (translationCache[lang]) {
      setTranslationsData(translationCache[lang]);
      setLanguageState(lang);
      setIsLoading(false);
      
      // Update cookie directly with js-cookie
      Cookies.set(LANGUAGE_COOKIE, lang, { expires: 365, path: '/' });
      
      // Also update localStorage for redundancy
      if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_COOKIE, lang);
      }
      
      debugLog(`Switched to language ${lang} using cached translations`);
      return;
    }
    
    try {
      // Fetch translations for the new language
      const cacheBuster = Date.now(); // Add timestamp to prevent caching
      debugLog(`Fetching translations for ${lang} with cache buster ${cacheBuster}`);
      
      const response = await fetch(`/api/i18n?lang=${lang}&v=${cacheBuster}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Additional validation to ensure we have valid translations
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Received empty translation data');
      }
      
      debugLog(`Received translations for ${lang}`, Object.keys(data));
      
      // Cache the translations
      translationCache[lang] = data;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(getStorageKey(lang), JSON.stringify(data));
        } catch (e) {
          console.error(`Failed to save translations to localStorage for ${lang}`, e);
        }
      }
      
      setTranslationsData(data);
      setLanguageState(lang);
      
      // Update cookie directly with js-cookie
      Cookies.set(LANGUAGE_COOKIE, lang, { expires: 365, path: '/' });
      
      // Also update localStorage for redundancy
      if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_COOKIE, lang);
      }
      
      debugLog(`Successfully switched to language ${lang}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching translations';
      console.error('Error setting language:', errorMessage);
      setLastError(errorMessage);
      
      // Fallback to English if loading the requested language fails
      if (lang !== 'en' && translationCache['en']) {
        setTranslationsData(translationCache['en']);
        setLanguageState('en');
        debugLog('Falling back to English translations due to error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load of translations
  useEffect(() => {
    // Skip fetching for English or already cached languages
    if (initialLang === 'en' || translationCache[initialLang]) {
      if (translationCache[initialLang]) {
        setTranslationsData(translationCache[initialLang]);
        debugLog(`Using cached translations for initial language ${initialLang}`);
      }
      setIsLoading(false);
      return;
    }
    
    const fetchInitialTranslations = async () => {
      setIsLoading(true);
      try {
        const cacheBuster = Date.now(); // Add timestamp to prevent caching
        debugLog(`Fetching initial translations for ${initialLang}`);
        
        const response = await fetch(`/api/i18n?lang=${initialLang}&v=${cacheBuster}`);
        if (response.ok) {
          const data = await response.json();
          
          // Additional validation
          if (!data || Object.keys(data).length === 0) {
            throw new Error('Received empty translation data');
          }
          
          // Cache the translations
          translationCache[initialLang] = data;
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(getStorageKey(initialLang), JSON.stringify(data));
            } catch (e) {
              console.error(`Failed to save translations to localStorage for ${initialLang}`, e);
            }
          }
          
          setTranslationsData(data);
          debugLog(`Successfully loaded initial translations for ${initialLang}`);
        } else {
          throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching initial translations';
        console.error('Error fetching initial translations:', errorMessage);
        setLastError(errorMessage);
        
        // Fallback to English if initial language load fails
        if (initialLang !== 'en') {
          setTranslationsData(defaultTranslations);
          setLanguageState('en');
          debugLog('Falling back to English translations due to initial load error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialTranslations();
  }, [initialLang]);

  // Preload all translations in the background for faster language switching
  useEffect(() => {
    // This effect will only run once on client side
    if (typeof window === 'undefined') return;
    
    const preloadAllTranslations = async () => {
      // Get the list of supported languages that aren't already cached
      const languagesToPreload = Object.keys(translations).filter(
        lang => lang !== 'en' && !translationCache[lang]
      );
      
      debugLog(`Starting background preload for languages: ${languagesToPreload.join(', ')}`);
      
      // Preload each language in sequence
      for (const lang of languagesToPreload) {
        if (!translationCache[lang]) {
          try {
            const cacheBuster = Date.now(); // Add timestamp to prevent caching
            const response = await fetch(`/api/i18n?lang=${lang}&v=${cacheBuster}`);
            if (response.ok) {
              const data = await response.json();
              
              // Validate data
              if (!data || Object.keys(data).length === 0) {
                throw new Error('Received empty translation data');
              }
              
              translationCache[lang] = data;
              
              // Save to localStorage
              try {
                localStorage.setItem(getStorageKey(lang), JSON.stringify(data));
              } catch (e) {
                console.error(`Failed to save translations to localStorage for ${lang}`, e);
              }
              
              debugLog(`Preloaded translations for ${lang}`);
            } else {
              throw new Error(`Failed to preload translations for ${lang}: ${response.status}`);
            }
          } catch (error) {
            console.error(`Error preloading translations for ${lang}:`, error);
          }
        }
      }
      
      debugLog('Completed background preloading of translations');
    };
    
    // Start preloading after a short delay to not compete with critical resources
    const timer = setTimeout(() => {
      preloadAllTranslations();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <TranslationContext.Provider
      value={{
        translations: translationsData,
        language,
        setLanguage,
        isLoading,
        getTranslation,
        refreshTranslations,
        lastError,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
} 
        language,
        setLanguage,
        isLoading,
        getTranslation,
        refreshTranslations,
        lastError,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
} 