'use client';

import { useTranslation } from '@/lib/i18n/context';

interface TranslatedTextProps {
  translationKey: string;
  fallback?: string;
  lang?: string;
}

export default function TranslatedText({ 
  translationKey, 
  fallback = translationKey.split('.').pop() || translationKey,
  lang
}: TranslatedTextProps) {
  const { getTranslation, isLoading, language } = useTranslation();
  
  // Use the provided lang or the global language from context
  const activeLang = lang || language;
  
  // Get translation from context
  const translatedText = getTranslation(translationKey, fallback);
  
  // Always show the translation text or fallback, even during loading
  return <>{translatedText}</>;
}

// Export a function to clear the translation cache for backward compatibility
export function clearTranslationCache() {
  console.log('Translation cache cleared');
} 