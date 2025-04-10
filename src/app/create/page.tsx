'use client';

import { ImageGenerator } from '@/components/ImageGenerator';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import TranslatedText from '@/components/TranslatedText';
import Cookies from 'js-cookie';

export default function CreatePage({ params }: { params?: { lang?: string } }) {
  const [activeTab, setActiveTab] = useState<'describe' | 'photo' | 'draw'>('describe');
  const [currentLang, setCurrentLang] = useState(params?.lang || 'en');
  
  // Get language from cookie on client side if not provided in params
  useEffect(() => {
    if (!params?.lang) {
      const lang = Cookies.get('NEXT_LOCALE') || 'en';
      setCurrentLang(lang);
    }
  }, [params?.lang]);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-start mb-4">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <TranslatedText path="common.backToHome" fallback="Back to Home" />
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          <TranslatedText path="create.title" fallback="Create Your Coloring Page" />
        </h1>
        <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
          <TranslatedText path="create.subtitle" fallback="Choose a creation method below and let our AI generate a beautiful coloring page for you" />
        </p>
      </div>

      {/* Creation Method Tabs */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('describe')}
            className={`py-3 px-6 text-lg font-medium border-b-2 ${
              activeTab === 'describe'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TranslatedText path="create.tabs.describe" fallback="Describe It" />
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-6 text-lg font-medium border-b-2 ${
              activeTab === 'photo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TranslatedText path="create.tabs.photo" fallback="Convert Photo" />
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className={`py-3 px-6 text-lg font-medium border-b-2 ${
              activeTab === 'draw'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TranslatedText path="create.tabs.draw" fallback="Draw & Enhance" />
          </button>
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="mb-12">
        {activeTab === 'describe' && (
          <ImageGenerator currentLang={currentLang} />
        )}

        {activeTab === 'photo' && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              <TranslatedText path="create.photo.title" fallback="Convert Photo to Coloring Page" />
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              <TranslatedText path="create.photo.description" fallback="This feature is coming soon! Upload and convert your photos into coloring pages." />
            </p>
            <button
              onClick={() => setActiveTab('describe')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              <TranslatedText path="create.photo.fallbackButton" fallback="Try Describe It Instead" />
            </button>
          </div>
        )}

        {activeTab === 'draw' && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              <TranslatedText path="create.draw.title" fallback="Draw & Enhance" />
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              <TranslatedText path="create.draw.description" fallback="Coming soon! Draw a basic sketch and let our AI enhance it into a beautiful coloring page." />
            </p>
            <button
              onClick={() => setActiveTab('describe')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              <TranslatedText path="create.draw.fallbackButton" fallback="Try Describe It Instead" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 