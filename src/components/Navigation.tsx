'use client';

import React, { useState, useEffect } from 'react';
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
  const [displayLang, setDisplayLang] = useState(currentLang);
  const [isMounted, setIsMounted] = useState(false);

  // When component mounts, mark it as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // When currentLang changes, update the displayLang
  useEffect(() => {
    setDisplayLang(currentLang);
  }, [currentLang]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Helper function to get the correct localized URL path
  const getLocalizedHref = (path: string): string => {
    if (path === '/') {
      return `/${displayLang}`;
    }
    return `/${displayLang}${path}`;
  };

  // Basic navigation links without the language prefix
  const navLinks = [
    { name: 'nav.home', href: '/' },
    { name: 'nav.create', href: '/create' },
    { name: 'nav.gallery', href: '/gallery' },
    { name: 'nav.blog', href: '/blog' },
    { name: 'nav.about', href: '/about' },
  ];

  // If not mounted yet, return a simple loading state
  if (!isMounted) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
            <div className="hidden md:flex space-x-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* First Row: Logo and Menu Button */}
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link href={getLocalizedHref('/')} className="flex items-center flex-shrink-0 max-w-[60%]">
            <span className="text-base sm:text-lg md:text-xl font-bold text-blue-600 tracking-tight truncate">
              <TranslatedText translationKey="common.appName" fallback="Coloring AI" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            {navLinks.map((link) => {
              const localizedHref = getLocalizedHref(link.href);
              return (
                <Link
                  key={link.name}
                  href={localizedHref}
                  className={`px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors duration-200 ${
                    pathname === localizedHref || pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <TranslatedText translationKey={link.name} fallback={link.name.split('.')[1]} />
                </Link>
              );
            })}
            
            {/* Language Selector - Desktop */}
            <LanguageSelector 
              currentLang={displayLang}
              className="ml-2 hidden lg:flex"
            />
            
            <Link 
              href={getLocalizedHref('/create')} 
              className="ml-2 lg:ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors duration-200"
            >
              <TranslatedText translationKey="nav.createNow" fallback="Create Now" />
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
            <LanguageSelector 
              currentLang={displayLang}
              className="w-full" 
            />
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
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === localizedHref || pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <TranslatedText translationKey={link.name} fallback={link.name.split('.')[1]} />
                </Link>
              );
            })}
            <Link
              href={getLocalizedHref('/create')}
              className="block mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              <TranslatedText translationKey="nav.createNow" fallback="Create Now" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}