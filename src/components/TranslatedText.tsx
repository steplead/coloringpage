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
  
  // Determine if the fallback is a raw key part like "title" or "desc"
  const isGenericFallback = fallback === 'title' || fallback === 'desc';

  if (isLoading) {
    // If the fallback is just "title" or "desc", show a more meaningful loading indicator
    if (isGenericFallback) {
      // Use more meaningful loading indicators based on the context
      if (translationKey.includes('features')) {
        return translationKey.includes('title') ? 
          <span className="h-4 w-24 bg-gray-200 rounded animate-pulse inline-block"></span> :
          <span className="h-3 w-32 bg-gray-100 rounded animate-pulse inline-block"></span>;
      }
      
      // For other contexts, use different sizes
      return translationKey.includes('title') ? 
        <span className="h-4 w-20 bg-gray-200 rounded animate-pulse inline-block"></span> :
        <span className="h-3 w-28 bg-gray-100 rounded animate-pulse inline-block"></span>;
    }
    
    // For non-generic fallbacks, show the fallback with a pulse animation
    return <span className="animate-pulse">{fallback}</span>;
  }

  return <>{translatedText}</>;
}

// Export a function to clear the translation cache for backward compatibility
export function clearTranslationCache() {
  console.log('Translation cache cleared');
} 