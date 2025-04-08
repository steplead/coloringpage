'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './index';

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

// Cache translations to avoid repeated fetches
const translationCache: Record<string, Record<string, any>> = {
  en: defaultTranslations
};

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
      
      // Update cookie in background
      updateLanguageCookie(lang).catch(e => console.error('Error updating language cookie:', e));
      return;
    }
    
    try {
      // Fetch translations for the new language
      const response = await fetch(`/api/i18n?lang=${lang}`);
      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }
      
      const data = await response.json();
      
      // Cache the translations
      translationCache[lang] = data;
      
      setTranslationsData(data);
      setLanguageState(lang);
      
      // Update cookie
      await updateLanguageCookie(lang);
    } catch (error) {
      console.error('Error setting language:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to update the language cookie
  const updateLanguageCookie = async (lang: string) => {
    return fetch('/api/i18n', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lang }),
    });
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
        const response = await fetch(`/api/i18n?lang=${initialLang}`);
        if (response.ok) {
          const data = await response.json();
          // Cache the translations
          translationCache[initialLang] = data;
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