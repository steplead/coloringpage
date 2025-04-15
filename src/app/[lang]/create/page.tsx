import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { redirect } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { ImageGenerator } from '@/components/ImageGenerator';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export default async function CreatePage({ params }: { params: { lang: string } }) {
  // Validate the language parameter
  const { lang } = params;
  const isValidLanguage = SUPPORTED_LANGUAGES.some(l => l.code === lang);
  
  if (!isValidLanguage) {
    redirect('/en/create');
    return null;
  }

  // Fetch translations server-side
  const translations = await getTranslations(lang);
  const t = (key: string, fallback?: string): string => {
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Page Header with Visual Elements */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-20 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-12 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-12 right-1/4 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium">
            Powered by AI
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('create.title', "Create Your AI Coloring Page")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('create.subtitle', "Use the form below to describe your desired image and let our AI generate a unique coloring page for you.")}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Additional helper text */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-10">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-blue-100 p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('create.tips.title', 'Tips for Best Results')}</h2>
              <ul className="text-gray-600 space-y-2 list-disc pl-5">
                <li>{t('create.tips.specificity', 'Be specific in your description (e.g., "A friendly dragon reading a book under an oak tree")')}</li>
                <li>{t('create.tips.style', 'Choose an appropriate style for your target audience - Simple for younger children, Complex for adults')}</li>
                <li>{t('create.tips.detail', 'For advanced mode, specify details like composition, line thickness, and complexity')}</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Generator Component */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
          <div className="p-1">
            <ImageGenerator />
          </div>
        </div>
        
        {/* Example gallery cards at the bottom */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            {t('create.examples.title', 'Recently Created Coloring Pages')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
                  <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm text-gray-600">{t('create.examples.example', 'Example')} {num}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 