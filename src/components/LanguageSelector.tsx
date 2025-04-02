'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, supportedLanguages, LanguageCode } from '@/lib/i18n';

type LanguageSelectorProps = {
  className?: string;
  dropdownClassName?: string;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '',
  dropdownClassName = '' 
}) => {
  const { lang, setLang, getSupportedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const languages = getSupportedLanguages();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Change language
  const changeLanguage = (code: LanguageCode) => {
    setLang(code);
    setIsOpen(false);
    
    // Update HTML lang attribute for SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
    }
  };
  
  return (
    <div 
      ref={dropdownRef}
      className={`language-selector relative ${className}`}
      aria-expanded={isOpen}
    >
      <button 
        onClick={toggleDropdown}
        className="flex items-center text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[40px] min-w-[80px] justify-center sm:justify-start"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Select language. Current: ${languages[lang].name}`}
      >
        <span className="mr-1 truncate max-w-[100px]">{languages[lang].nativeName}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} flex-shrink-0`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 py-1 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-[calc(100vh-100px)] overflow-y-auto ${dropdownClassName}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          {Object.entries(languages).map(([code, language]) => (
            <button
              key={code}
              onClick={() => changeLanguage(code as LanguageCode)}
              className={`block w-full text-left px-4 py-3 text-sm ${
                code === lang 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              role="menuitem"
            >
              {language.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 