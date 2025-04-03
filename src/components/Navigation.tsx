'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector from './LanguageSelector';
import TranslatedText from './TranslatedText';

interface NavigationProps {
  currentLang?: string;
}

export function Navigation({ currentLang = 'en' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Helper function to get the correct localized URL path
  const getLocalizedHref = (path: string): string => {
    if (path === '/') {
      return `/${currentLang}`;
    }
    return `/${currentLang}${path}`;
  };

  // Basic navigation links without the language prefix
  const navLinks = [
    { name: 'nav.home', href: '/' },
    { name: 'nav.create', href: '/create' },
    { name: 'nav.gallery', href: '/gallery' },
    { name: 'nav.blog', href: '/blog' },
    { name: 'nav.about', href: '/about' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* First Row: Logo and Menu Button */}
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link href={getLocalizedHref('/')} className="flex items-center flex-shrink-0">
            <span className="text-xl font-bold text-blue-600 tracking-tight">
              <TranslatedText translationKey="common.appName" fallback="Coloring AI" lang={currentLang} />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => {
              const localizedHref = getLocalizedHref(link.href);
              return (
                <Link
                  key={link.name}
                  href={localizedHref}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === localizedHref || pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <TranslatedText translationKey={link.name} fallback={link.name.split('.')[1]} lang={currentLang} />
                </Link>
              );
            })}
            
            {/* Language Selector - Desktop */}
            <LanguageSelector currentLang={currentLang} className="ml-2" />
            
            <Link 
              href={getLocalizedHref('/create')} 
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <TranslatedText translationKey="nav.createNow" fallback="Create Now" lang={currentLang} />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleMenu}
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Second Row: Language Selector (Mobile Only) */}
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 py-2">
            <LanguageSelector currentLang={currentLang} className="w-full" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg bg-white">
            {navLinks.map((link) => {
              const localizedHref = getLocalizedHref(link.href);
              return (
                <Link
                  key={link.name}
                  href={localizedHref}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === localizedHref || pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <TranslatedText translationKey={link.name} fallback={link.name.split('.')[1]} lang={currentLang} />
                </Link>
              );
            })}
            <Link
              href={getLocalizedHref('/create')}
              className="block mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <TranslatedText translationKey="nav.createNow" fallback="Create Now" lang={currentLang} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 