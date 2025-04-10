'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Root page component - serves as a fallback in case middleware doesn't redirect
 * Will redirect to the appropriate language path based on browser preferences
 */
export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Get user's preferred language from browser
    const userLanguage = navigator.language.split('-')[0];
    
    // List of supported languages
    const supportedLanguages = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru'];
    
    // Check if user's language is supported
    const targetLang = supportedLanguages.includes(userLanguage) 
      ? userLanguage 
      : 'en'; // Default to English if not supported
    
    // Redirect to language-specific path
    router.replace(`/${targetLang}`);
  }, [router]);
  
  // Show a minimal loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
} 