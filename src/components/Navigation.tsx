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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-xl font-bold text-blue-600 tracking-tight">
              <TranslatedText translationKey="common.appName" fallback="Coloring AI" lang={currentLang} />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <TranslatedText translationKey={link.name} fallback={link.name.split('.')[1]} lang={currentLang} />
              </Link>
            ))}
            
            {/* Language Selector - Desktop */}
            <LanguageSelector currentLang={currentLang} className="ml-2" />
            
            <Link 
              href="/create" 
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <TranslatedText translationKey="nav.createNow" fallback="Create Now" lang={currentLang} />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Language Selector - Mobile */}
            <div className="w-8">
              <LanguageSelector currentLang={currentLang} className="!w-8" />
            </div>
            
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
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <TranslatedText translationKey={link.name} fallback={link.name.split('.')[1]} lang={currentLang} />
              </Link>
            ))}
            <Link
              href="/create"
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