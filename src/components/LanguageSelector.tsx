'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { clearTranslationCache } from './TranslatedText';
import { useTranslation } from '@/lib/i18n/context';

interface LanguageSelectorProps {
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
  className?: string;
  dropdownPosition?: 'top' | 'bottom';
}

export default function LanguageSelector({ 
  currentLang,
  onLanguageChange,
  className = '',
  dropdownPosition = 'bottom'
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const { language: contextLang, setLanguage } = useTranslation();
  
  // Use the language from props or context
  const selectedLang = currentLang || contextLang;

  // Get the current language info
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  // Helper to get path without language prefix
  const getPathWithoutLocale = (path: string): string => {
    // If the path is just '/' return it
    if (path === '/') return '';
    
    // Split path into segments
    const segments = path.split('/');
    
    // Check if the first segment is a language code
    if (segments.length > 1) {
      const potentialLocale = segments[1];
      if (SUPPORTED_LANGUAGES.some(lang => lang.code === potentialLocale)) {
        // Remove the language segment
        segments.splice(1, 1);
        return segments.join('/') || '/';
      }
    }
    
    return path;
  };

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === selectedLang || isChanging) return;
    
    setIsChanging(true);
    setIsOpen(false);
    
    try {
      console.log('Changing language to:', languageCode);
      
      // Update translations in the context
      await setLanguage(languageCode);
      
      // Call the onLanguageChange callback if provided
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      }
      
      // Build the new URL with the updated language code
      const pathWithoutLocale = getPathWithoutLocale(pathname);
      const newPath = `/${languageCode}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
      
      // Use the router to navigate to the new URL
      router.push(newPath);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!(target as Element).closest('.language-selector')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={selectorRef} className={`relative language-selector ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
        disabled={isChanging}
      >
        <div className="flex items-center space-x-2">
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
        </div>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} right-0 w-full bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-selector"
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`flex items-center px-3 py-1.5 text-sm w-full text-left hover:bg-gray-50 ${
                selectedLang === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
              role="menuitem"
              disabled={isChanging}
            >
              <span className="text-base mr-2">{language.flag}</span>
              <span>{language.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 