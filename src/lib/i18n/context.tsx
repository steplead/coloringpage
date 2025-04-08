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
}

const TranslationContext = createContext<TranslationContextType>({
  translations: defaultTranslations,
  language: 'en',
  setLanguage: async () => {},
  isLoading: false,
  getTranslation: () => '',
});

export function useTranslation() {
  return useContext(TranslationContext);
}

interface TranslationProviderProps {
  children: ReactNode;
  initialLang?: string;
}

// Version flag to detect updates to translation files
const TRANSLATION_VERSION = '1.1';

// Cache translations to avoid repeated fetches - add version suffix to localStorage key
const getStorageKey = (lang: string) => `translations_${lang}_v${TRANSLATION_VERSION}`;

// Initialize translation cache with English as default
const translationCache: Record<string, Record<string, any>> = {
  en: defaultTranslations
};

// Try to load cached translations from localStorage
if (typeof window !== 'undefined') {
  try {
    // Clear any old version translations from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('translations_') && !key.includes(`_v${TRANSLATION_VERSION}`)) {
        localStorage.removeItem(key);
      }
    });
    
    // Load cached translations that match current version
    Object.keys(translations).forEach(lang => {
      const cached = localStorage.getItem(getStorageKey(lang));
      if (cached) {
        try {
          translationCache[lang] = JSON.parse(cached);
          console.log(`Loaded cached translations for ${lang} from localStorage`);
        } catch (e) {
          console.error(`Failed to parse cached translations for ${lang}`, e);
        }
      }
    });
  } catch (e) {
    console.error('Error initializing translation cache from localStorage', e);
  }
}

export function TranslationProvider({ 
  children, 
  initialLang = 'en' 
}: TranslationProviderProps) {
  const [translationsData, setTranslationsData] = useState<Record<string, any>>(
    translationCache[initialLang] || defaultTranslations
  );
  const [language, setLanguageState] = useState(initialLang);
  const [isLoading, setIsLoading] = useState<boolean>(initialLang !== 'en' && !translationCache[initialLang]);

  // Function to get translation for a specific key
  const getTranslation = (key: string, fallback?: string): string => {
    try {
      const keys = key.split('.');
      let value: any = translationsData;
      
      for (const k of keys) {
        if (!value) break;
        value = value[k];
      }
      
      if (value !== undefined && typeof value === 'string') {
        return value;
      }
      
      // If the fallback is just the last part of the key (like "title" or "desc"),
      // try to provide a better fallback
      const lastKey = key.split('.').pop() || '';
      if (fallback === lastKey && (lastKey === 'title' || lastKey === 'desc')) {
        // For features section, give more meaningful defaults
        if (key.includes('features')) {
          if (lastKey === 'title') return 'Loading...';
          if (lastKey === 'desc') return 'Please wait...';
        }
      }
      
      return fallback || lastKey || key;
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return fallback || key.split('.').pop() || key;
    }
  };

  // Function to set language and fetch translations
  const setLanguage = async (lang: string): Promise<void> => {
    if (lang === language) return;
    
    setIsLoading(true);
    
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
      
      return;
    }
    
    try {
      // Fetch translations for the new language
      const cacheBuster = Date.now(); // Add timestamp to prevent caching
      const response = await fetch(`/api/i18n?lang=${lang}&v=${cacheBuster}`);
      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }
      
      const data = await response.json();
      
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
      
    } catch (error) {
      console.error('Error setting language:', error);
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
      }
      setIsLoading(false);
      return;
    }
    
    const fetchInitialTranslations = async () => {
      setIsLoading(true);
      try {
        const cacheBuster = Date.now(); // Add timestamp to prevent caching
        const response = await fetch(`/api/i18n?lang=${initialLang}&v=${cacheBuster}`);
        if (response.ok) {
          const data = await response.json();
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
        }
      } catch (error) {
        console.error('Error fetching initial translations:', error);
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
      
      // Preload each language in sequence
      for (const lang of languagesToPreload) {
        if (!translationCache[lang]) {
          try {
            const cacheBuster = Date.now(); // Add timestamp to prevent caching
            const response = await fetch(`/api/i18n?lang=${lang}&v=${cacheBuster}`);
            if (response.ok) {
              const data = await response.json();
              translationCache[lang] = data;
              
              // Save to localStorage
              try {
                localStorage.setItem(getStorageKey(lang), JSON.stringify(data));
              } catch (e) {
                console.error(`Failed to save translations to localStorage for ${lang}`, e);
              }
              
              console.log(`Preloaded translations for ${lang}`);
            }
          } catch (error) {
            console.error(`Error preloading translations for ${lang}:`, error);
          }
        }
      }
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
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
} 