'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

export default function LanguageDetectionBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we've shown the banner before
    const hasSeenBanner = localStorage.getItem('hasSeenLanguageBanner');
    
    if (hasSeenBanner) {
      return;
    }
    
    // Check if user is not on a language-specific URL (first visit)
    const isFirstVisit = !window.location.pathname.match(/^\/[a-z]{2}(\/|$)/);
    
    if (!isFirstVisit) {
      // Mark as seen if they're already on a language URL
      localStorage.setItem('hasSeenLanguageBanner', 'true');
      return;
    }
    
    // Get browser language
    const browserLang = navigator.language.split('-')[0];
    
    // Check if browser language is supported and not English (default)
    const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === browserLang);
    
    if (isSupported && browserLang !== 'en') {
      setDetectedLanguage(browserLang);
      setShowBanner(true);
    } else {
      // Mark as seen if language is not supported or is English
      localStorage.setItem('hasSeenLanguageBanner', 'true');
    }
  }, []);

  const handleAccept = () => {
    // Save preference and hide banner
    localStorage.setItem('hasSeenLanguageBanner', 'true');
    setShowBanner(false);
    
    // Redirect to the detected language version
    if (detectedLanguage) {
      const path = window.location.pathname === '/' ? '' : window.location.pathname;
      router.push(`/${detectedLanguage}${path}`);
    }
  };

  const handleDecline = () => {
    // Save preference and hide banner
    localStorage.setItem('hasSeenLanguageBanner', 'true');
    setShowBanner(false);
  };

  if (!showBanner || !detectedLanguage) {
    return null;
  }

  // Get language name for display
  const languageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === detectedLanguage);

  return (
    <div className="bg-blue-50 border-t border-b border-blue-100 py-3 px-4 fixed bottom-0 left-0 right-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          <span className="text-xl mr-2">{languageInfo?.flag}</span>
          <p className="text-blue-800">
            We detected your language is {languageInfo?.name}. Would you like to switch?
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Yes, switch to {languageInfo?.nativeName}
          </button>
          <button
            onClick={handleDecline}
            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            No, stay in English
          </button>
        </div>
      </div>
    </div>
  );
} 