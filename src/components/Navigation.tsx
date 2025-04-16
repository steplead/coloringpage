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
  const [isScrolled, setIsScrolled] = useState(false);

  // When component mounts, mark it as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track scroll position for potential header style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Header background based on scroll state
  const headerBgClass = isScrolled 
    ? 'bg-white/95 backdrop-blur-sm shadow-md' 
    : 'bg-white';

  // Loading state remains simple
  if (!isMounted) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50 w-full h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">
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
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${headerBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Slightly larger and bolder */}
          <Link href={getLocalizedHref('/')} className="flex items-center flex-shrink-0 mr-4">
            {/* Simple text logo, can be replaced with an SVG/Image logo later */}
            <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
              <TranslatedText translationKey="common.appNameShort" fallback="ColorAI" />
            </span>
          </Link>

          {/* Desktop Navigation - Increased spacing, refined hover effects */}
          <nav className="hidden md:flex md:items-center md:space-x-3 lg:space-x-6 flex-grow justify-center">
            {navLinks.map((link) => {
              const localizedHref = getLocalizedHref(link.href);
              const isActive = pathname === localizedHref || pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={localizedHref}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <TranslatedText translationKey={link.name} fallback={link.name.split('.')[1]} />
                </Link>
              );
            })}
          </nav>

          {/* Right side items: Language Selector and Create Button */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector 
              currentLang={displayLang}
              className="hidden lg:flex"
            />
            {/* Enhanced Create Button */}
            <Link 
              href={getLocalizedHref('/create')} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <TranslatedText translationKey="nav.createNow" fallback="Create Now" />
            </Link>
          </div>

          {/* Mobile Menu Button and Language Selector */}
          <div className="flex md:hidden items-center">
             <LanguageSelector 
               currentLang={displayLang}
               className="mr-2 scale-90 origin-right" // Adjust styling for mobile
             />
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={toggleMenu}
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon changes based on state */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Improved styling */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-40">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => {
              const localizedHref = getLocalizedHref(link.href);
              const isActive = pathname === localizedHref || pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={localizedHref}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <TranslatedText translationKey={link.name} fallback={link.name.split('.')[1]} />
                </Link>
              );
            })}
            {/* Mobile Create Button */}
            <Link
              href={getLocalizedHref('/create')}
              className="block w-full mt-4 text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
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