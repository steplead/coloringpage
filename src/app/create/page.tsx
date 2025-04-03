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
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <TranslatedText translationKey="common.backToHome" fallback="Back to Home" lang={currentLang} />
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          <TranslatedText translationKey="create.title" fallback="Create Your Coloring Page" lang={currentLang} />
        </h1>
        <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
          <TranslatedText translationKey="create.subtitle" fallback="Choose a creation method below and let our AI generate a beautiful coloring page for you" lang={currentLang} />
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
            <TranslatedText translationKey="create.tabs.describe" fallback="Describe It" lang={currentLang} />
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-6 text-lg font-medium border-b-2 ${
              activeTab === 'photo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TranslatedText translationKey="create.tabs.photo" fallback="Convert Photo" lang={currentLang} />
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className={`py-3 px-6 text-lg font-medium border-b-2 ${
              activeTab === 'draw'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TranslatedText translationKey="create.tabs.draw" fallback="Draw & Enhance" lang={currentLang} />
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
              <TranslatedText translationKey="create.photo.title" fallback="Convert Photo to Coloring Page" lang={currentLang} />
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              <TranslatedText translationKey="create.photo.description" fallback="This feature is coming soon! Upload and convert your photos into coloring pages." lang={currentLang} />
            </p>
            <button
              onClick={() => setActiveTab('describe')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              <TranslatedText translationKey="create.photo.fallbackButton" fallback="Try Describe It Instead" lang={currentLang} />
            </button>
          </div>
        )}

        {activeTab === 'draw' && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              <TranslatedText translationKey="create.draw.title" fallback="Draw & Enhance" lang={currentLang} />
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              <TranslatedText translationKey="create.draw.description" fallback="Coming soon! Draw a basic sketch and let our AI enhance it into a beautiful coloring page." lang={currentLang} />
            </p>
            <button
              onClick={() => setActiveTab('describe')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              <TranslatedText translationKey="create.draw.fallbackButton" fallback="Try Describe It Instead" lang={currentLang} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 