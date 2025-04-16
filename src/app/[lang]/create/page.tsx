import React from 'react';
import { redirect } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { ImageGenerator } from '@/components/ImageGenerator';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';
import Image from 'next/image';
import Link from 'next/link';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

const getLocalizedHref = (path: string, lang: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${normalizedPath}`;
};

export default async function CreatePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const isValidLanguage = SUPPORTED_LANGUAGES.some(l => l.code === lang);
  
  if (!isValidLanguage) {
    redirect('/en/create');
    return null;
  }

  const translations = await getTranslations(lang);
  const t = (key: string, fallback?: string): string => {
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  };

  const examplePages = [
    { id: 'example-dragon', titleKey: 'create.examples.dragon', image: '/examples/dragon.png' },
    { id: 'example-cat', titleKey: 'create.examples.cat', image: '/examples/cat-simple.png' },
    { id: 'example-rocket', titleKey: 'create.examples.rocket', image: '/examples/rocket.png' },
    { id: 'example-mandala', titleKey: 'create.examples.mandala', image: '/examples/mandala-complex.png' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-700 py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-12 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-12 right-1/4 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium">
            ✨ {t('create.header.tagline', 'Unleash Your Creativity')}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('create.title', "Create Your AI Coloring Page")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('create.subtitle', "Describe your idea, choose a style, and let our AI bring it to life as a unique coloring page!")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-12 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-blue-100 p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.31M8.25 19.5l.75-1.636M15.75 19.5l-.75-1.636M12 3.75l.75 1.636a.75.75 0 01-1.5 0L12 3.75z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('create.tips.title', 'Tips for Best Results')}</h2>
              <ul className="text-gray-600 space-y-2 list-disc pl-5">
                <li>{t('create.tips.specificity', 'Be specific: Instead of "cat", try "a fluffy cat sleeping on a stack of books".')}</li>
                <li>{t('create.tips.style', 'Mention style: Add terms like "simple cartoon style", "detailed fantasy art", "geometric pattern".')}</li>
                <li>{t('create.tips.negative', 'Use negative prompts (advanced): Add things to avoid, e.g., "--no color fill, text".')}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
           <ImageGenerator />
        </div>
        
        <div className="mt-16 sm:mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            {t('create.examples.title', 'Need Inspiration? See Examples')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {examplePages.map((example) => (
              <Link 
                key={example.id} 
                href={getLocalizedHref(`/gallery/${example.id}`, lang)}
                className="block group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
              >
                <div className="aspect-square relative bg-gray-50">
                  <Image
                    src={example.image}
                    alt={t(example.titleKey, 'Example coloring page')}
                    fill 
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm text-gray-700 font-medium truncate">
                    {t(example.titleKey, 'Example')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 