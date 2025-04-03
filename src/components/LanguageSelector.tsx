'use client';

import { useState, useEffect, useRef } from 'react';
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
  const selectorRef = useRef<HTMLDivElement>(null);

  // Update selected language when currentLang prop changes
  useEffect(() => {
    if (currentLang && currentLang !== selectedLang) {
      setSelectedLang(currentLang);
    }
  }, [currentLang, selectedLang]);

  // Get the current language info
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === selectedLang || isChanging) return;
    
    setIsChanging(true);
    setIsOpen(false);
    
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
      } else {
        console.error('Failed to change language: Server returned an error');
      }
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
    <div ref={selectorRef} className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm hidden sm:inline">{currentLanguage.nativeName}</span>
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-selector"
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`flex items-center px-4 py-3 text-sm w-full text-left hover:bg-gray-50 ${
                selectedLang === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
              role="menuitem"
            >
              <span className="text-lg mr-2">{language.flag}</span>
              <span>{language.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 