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

export function TranslationProvider({ 
  children, 
  initialLang = 'en' 
}: TranslationProviderProps) {
  const [translationsData, setTranslationsData] = useState<Record<string, any>>(defaultTranslations);
  const [language, setLanguageState] = useState(initialLang);
  const [isLoading, setIsLoading] = useState(false);

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
      
      return fallback || key.split('.').pop() || key;
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return fallback || key.split('.').pop() || key;
    }
  };

  // Function to set language and fetch translations
  const setLanguage = async (lang: string): Promise<void> => {
    if (lang === language) return;
    
    setIsLoading(true);
    try {
      // Fetch translations for the new language
      const response = await fetch(`/api/i18n?lang=${lang}`);
      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }
      
      const data = await response.json();
      setTranslationsData(data);
      setLanguageState(lang);
      
      // Update cookie
      await fetch('/api/i18n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lang }),
      });
    } catch (error) {
      console.error('Error setting language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load of translations
  useEffect(() => {
    const fetchInitialTranslations = async () => {
      if (initialLang === 'en') {
        setTranslationsData(defaultTranslations);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/i18n?lang=${initialLang}`);
        if (response.ok) {
          const data = await response.json();
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