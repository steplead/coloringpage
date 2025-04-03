'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

interface LanguageSelectorProps {
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
  className?: string;
  dropdownPosition?: 'top' | 'bottom';
}

export default function LanguageSelector({ 
  currentLang = 'en', 
  onLanguageChange,
  className = '',
  dropdownPosition = 'bottom'
}: LanguageSelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLang);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setSelectedLang(currentLang);
  }, [currentLang]);

  // Get the current language info
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === selectedLang || isChanging) return;
    
    setIsChanging(true);
    
    try {
      const response = await fetch('/api/i18n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lang: languageCode }),
      });

      if (response.ok) {
        setSelectedLang(languageCode);
        
        // Call the onLanguageChange callback if provided
        if (onLanguageChange) {
          onLanguageChange(languageCode);
        }
        
        // Refresh the page to apply the new language
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        disabled={isChanging}
      >
        <span className="mr-2">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 z-10 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`flex w-full items-center px-4 py-2 text-sm ${
                  selectedLang === language.code
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                role="menuitem"
              >
                <span className="mr-3">{language.flag}</span>
                <span>{language.nativeName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 