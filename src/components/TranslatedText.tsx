'use client';

import { useEffect, useState } from 'react';

// Cache for storing translations to avoid unnecessary API calls
const translationCache: Record<string, any> = {};

interface TranslatedTextProps {
  translationKey: string;
  fallback?: string;
  lang?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Component that renders text in the current language using the translation system
 * 
 * @param translationKey - The dot-notation key for the translation (e.g., 'common.button.save')
 * @param fallback - Optional fallback text if translation is not found
 * @param lang - Optional language code override
 * @param className - Optional CSS class
 * @param as - Optional HTML element to render as (default: span)
 */
export default function TranslatedText({
  translationKey,
  fallback,
  lang: propLang,
  className = '',
  as: Component = 'span',
}: TranslatedTextProps) {
  const [currentLang, setCurrentLang] = useState(propLang || 'en');
  const [translated, setTranslated] = useState<string>(fallback || translationKey);
  
  useEffect(() => {
    // Get the most accurate language value
    const htmlLang = typeof document !== 'undefined' ? document.documentElement.lang : null;
    const effectiveLang = propLang || htmlLang || currentLang;
    
    // Update state if needed
    if (effectiveLang !== currentLang) {
      setCurrentLang(effectiveLang);
    }
    
    const fetchTranslation = async () => {
      try {
        // Check if we already have this language's translations in cache
        if (!translationCache[effectiveLang]) {
          // If not, fetch them
          const response = await fetch(`/api/i18n?lang=${effectiveLang}`);
          if (response.ok) {
            const data = await response.json();
            translationCache[effectiveLang] = data.translations;
          } else {
            console.error('Failed to fetch translations');
            return;
          }
        }
        
        // Now get the specific translation from cache
        const keyParts = translationKey.split('.');
        let value: any = translationCache[effectiveLang];
        
        for (const part of keyParts) {
          if (!value || typeof value !== 'object') {
            value = undefined;
            break;
          }
          value = value[part];
        }
        
        // Set the translated text
        if (value && typeof value === 'string') {
          setTranslated(value);
        } else if (fallback) {
          setTranslated(fallback);
        } else {
          // If not found in the target language and we have no fallback,
          // use the last part of the key as fallback
          const lastKeyPart = keyParts[keyParts.length - 1];
          setTranslated(lastKeyPart);
        }
      } catch (error) {
        console.error('Error fetching translation:', error);
        if (fallback) {
          setTranslated(fallback);
        }
      }
    };
    
    fetchTranslation();
  }, [translationKey, propLang, fallback, currentLang]);
  
  return <Component className={className}>{translated}</Component>;
} 