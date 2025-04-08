import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { redirect } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { ImageGenerator } from '@/components/ImageGenerator';
import TranslatedText from '@/components/TranslatedText';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export default function CreatePage({ params }: { params: { lang: string } }) {
  // Validate the language parameter
  const { lang } = params;
  const isValidLanguage = SUPPORTED_LANGUAGES.some(l => l.code === lang);
  
  // If language is not supported, redirect to the default English page
  if (!isValidLanguage) {
    redirect('/en/create');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={<TranslatedText translationKey="create.title" fallback="Create Your Coloring Page" lang={lang} />}
        description={
          <span className="text-sm sm:text-base break-words">
            <TranslatedText 
              translationKey="create.subtitle" 
              fallback="Choose a creation method below and let our AI generate a beautiful coloring page for you" 
              lang={lang}
            />
          </span>
        }
      />

      <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <ImageGenerator currentLang={lang} />
      </div>
    </div>
  );
} 