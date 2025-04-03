'use client';

import { useState, useEffect } from 'react';

interface TranslatedTextProps {
  translationKey: string;
  fallback?: string;
  lang?: string;
}

// Cache for translations
const translationCache = new Map<string, string>();

export default function TranslatedText({ 
  translationKey, 
  fallback = translationKey.split('.').pop() || translationKey,
  lang = 'en'
}: TranslatedTextProps) {
  const [translatedText, setTranslatedText] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslation = async () => {
      // Check cache first
      const cacheKey = `${lang}:${translationKey}`;
      if (translationCache.has(cacheKey)) {
        setTranslatedText(translationCache.get(cacheKey) || fallback);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/i18n?lang=${lang}`);
        if (!response.ok) {
          throw new Error('Failed to fetch translations');
        }
        const data = await response.json();
        const translation = translationKey.split('.').reduce((obj, key) => obj?.[key], data);
        
        if (translation) {
          translationCache.set(cacheKey, translation);
          setTranslatedText(translation);
        } else {
          setTranslatedText(fallback);
        }
      } catch (error) {
        console.error('Error fetching translation:', error);
        setTranslatedText(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, [translationKey, lang, fallback]);

  if (isLoading) {
    return <span className="animate-pulse">{fallback}</span>;
  }

  return <>{translatedText}</>;
} 