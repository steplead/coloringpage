'use client';

import { useEffect, useState } from 'react';
import { getTranslation } from '@/lib/i18n';

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
    // Function to fetch translations from the API
    const fetchTranslation = async () => {
      try {
        // If language is provided as a prop, use it
        if (propLang) {
          setCurrentLang(propLang);
          return;
        }
        
        // Otherwise try to get the language from the HTML lang attribute
        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
          setCurrentLang(htmlLang);
        }
      } catch (error) {
        console.error('Error fetching translation:', error);
      }
    };
    
    fetchTranslation();
  }, [propLang]);
  
  useEffect(() => {
    // If we're running client-side
    if (typeof window !== 'undefined') {
      // Fetch the translation for this specific key
      const fetchSpecificTranslation = async () => {
        try {
          // Fetch the translation for the current key
          const response = await fetch(`/api/i18n?lang=${currentLang}`);
          if (response.ok) {
            const data = await response.json();
            // Split the key by dots to navigate the translations object
            const keyParts = translationKey.split('.');
            let value = data.translations;
            
            // Navigate through the object
            for (const part of keyParts) {
              if (!value || typeof value !== 'object') {
                value = undefined;
                break;
              }
              value = value[part];
            }
            
            if (value && typeof value === 'string') {
              setTranslated(value);
            } else if (fallback) {
              setTranslated(fallback);
            }
          }
        } catch (error) {
          console.error('Error fetching specific translation:', error);
          if (fallback) {
            setTranslated(fallback);
          }
        }
      };
      
      fetchSpecificTranslation();
    }
  }, [translationKey, currentLang, fallback]);
  
  return <Component className={className}>{translated}</Component>;
} 