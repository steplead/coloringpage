'use client';

import React, { useState, useEffect } from 'react';
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
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
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
  };
  
  return (
    <div className={`language-selector relative ${className}`}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-1">{languages[lang].nativeName}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 mt-2 py-1 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${dropdownClassName}`}>
          {Object.entries(languages).map(([code, language]) => (
            <button
              key={code}
              onClick={() => changeLanguage(code as LanguageCode)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                code === lang 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
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