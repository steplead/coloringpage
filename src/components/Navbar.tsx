'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import LanguageSelector from './LanguageSelector';

// Function to determine if a link is active
const isLinkActive = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
};

export default function Navbar({ currentLang = 'en' }: { currentLang?: string }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="AI Coloring Page Logo" width={40} height={40} className="mr-2" />
            <span className="text-lg font-bold text-gray-800 dark:text-white">AI Coloring</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive(pathname, '/') && pathname === '/'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Home
            </Link>
            <Link
              href="/create"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive(pathname, '/create')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Create
            </Link>
            <Link
              href="/gallery"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive(pathname, '/gallery')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Gallery
            </Link>
            <Link
              href="/blog"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive(pathname, '/blog')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive(pathname, '/about')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              About
            </Link>
            
            {/* Language Selector */}
            <LanguageSelector currentLang={currentLang} className="ml-2" />
            
            <Link
              href="/create"
              className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
            >
              Create Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector currentLang={currentLang} />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isLinkActive(pathname, '/') && pathname === '/'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                }`}
              >
                Home
              </Link>
              <Link
                href="/create"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isLinkActive(pathname, '/create')
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                }`}
              >
                Create
              </Link>
              <Link
                href="/gallery"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isLinkActive(pathname, '/gallery')
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                }`}
              >
                Gallery
              </Link>
              <Link
                href="/blog"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isLinkActive(pathname, '/blog')
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isLinkActive(pathname, '/about')
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                }`}
              >
                About
              </Link>
              <Link
                href="/create"
                className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 