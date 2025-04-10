'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TranslatedText from '@/components/TranslatedText';
import Cookies from 'js-cookie';
import { ArrowLeftIcon, PencilSquareIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function GalleryNotFound() {
  const [currentLang, setCurrentLang] = useState('en');

  // Get language from cookie on client side
  useEffect(() => {
    const lang = Cookies.get('NEXT_LOCALE') || 'en';
    setCurrentLang(lang);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="relative h-40 w-40">
                <Image 
                  src="/404-coloring.svg" 
                  alt="404 illustration" 
                  fill 
                  className="object-contain"
                  onError={(e) => {
                    if (e.target instanceof HTMLImageElement) {
                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22200%22%20font-size%3D%2280%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Arial%22%20fill%3D%22%23d1d5db%22%3E404%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                    }
                  }}
                />
              </div>
            </div>
            
            <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
              <TranslatedText 
                translationKey="gallery.notFound.title" 
                fallback="Coloring Page Not Found"
              />
            </h1>
            
            <p className="text-center text-gray-600 mb-6">
              <TranslatedText 
                translationKey="gallery.notFound.message" 
                fallback="We couldn't find the coloring page you were looking for. It might have been removed or never existed."
              />
            </p>
            
            <div className="space-y-3">
              <Link
                href="/gallery"
                className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <TranslatedText 
                  translationKey="gallery.notFound.browseGallery" 
                  fallback="Browse Gallery"
                />
              </Link>
              
              <Link
                href="/create"
                className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <PencilSquareIcon className="h-4 w-4" />
                <TranslatedText 
                  translationKey="gallery.notFound.createNew" 
                  fallback="Create a New Coloring Page"
                />
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <h3 className="font-medium text-gray-900 mb-2">
                <TranslatedText 
                  translationKey="gallery.notFound.suggestions.title" 
                  fallback="Why am I seeing this page?"
                />
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <TranslatedText 
                    translationKey="gallery.notFound.suggestions.reason1" 
                    fallback="The coloring page may have been deleted"
                  />
                </li>
                <li>
                  <TranslatedText 
                    translationKey="gallery.notFound.suggestions.reason2" 
                    fallback="The URL might be incorrect or outdated"
                  />
                </li>
                <li>
                  <TranslatedText 
                    translationKey="gallery.notFound.suggestions.reason3" 
                    fallback="You might have followed a broken link"
                  />
                </li>
              </ul>
            </div>
            
            <div className="mt-4 flex justify-center">
              <Link 
                href="/"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                <TranslatedText 
                  translationKey="nav.home" 
                  fallback="Go to Home Page"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 