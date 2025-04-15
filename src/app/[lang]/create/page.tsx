import React from 'react';
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
    // Ensure fallback is provided if key is missing, otherwise use the key itself
    const defaultFallback = fallback || key.split('.').pop() || key;
    return getTranslationSync(key, undefined, translations, defaultFallback);
  };
  
  // Helper function to get localized href
  const getLocalizedHref = (path: string): string => {
    return `/${lang}${path}`;
  };

  return (
    // Use the base dark background from globals.css
    <div className="min-h-screen">
      {/* Enhanced Page Header - Dark Theme & Gradient */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 py-20 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-l from-purple-600 to-pink-600 blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-indigo-300 text-sm font-medium border border-white/10">
            {t('create.tag', 'AI-Powered Generator')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {t('create.title', "Create Your AI Coloring Page")}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('create.subtitle', "Use the form below to describe your desired image and let our AI generate a unique coloring page for you.")}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Tips Section - Dark Theme Card */}
        <div className="card p-8 mb-10">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-indigo-900/50 p-3 flex-shrink-0 border border-indigo-700">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-2">{t('create.tips.title', 'Tips for Best Results')}</h2>
              <ul className="text-gray-400 space-y-2 list-disc pl-5 text-sm">
                <li>{t('create.tips.specificity', 'Be specific in your description (e.g., "A friendly dragon reading a book under an oak tree")')}</li>
                <li>{t('create.tips.style', 'Choose an appropriate style for your target audience - Simple for younger children, Complex for adults')}</li>
                <li>{t('create.tips.detail', 'For advanced mode, specify details like composition, line thickness, and complexity')}</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Generator Component Container - Dark Theme Card */}
        <div className="card p-0 overflow-hidden"> {/* Remove padding, let generator handle it */}
          {/* ImageGenerator will inherit text color, ensure its internal styles are dark-theme compatible */}
          <ImageGenerator /> 
        </div>
        
        {/* Example Gallery Section - Dark Theme Cards */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">
            {t('create.examples.title', 'Recently Created Coloring Pages')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-square bg-gray-700 animate-pulse flex items-center justify-center text-gray-500">
                  {/* Placeholder Icon */}
                  <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm text-gray-400">{t('create.examples.example', 'Example')} {num}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 