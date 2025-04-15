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
      <PageHeader
        title={<h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">{t('create.title', "Create Your AI Coloring Page")}</h1>}
        description={
          <span className="text-sm sm:text-base break-words">
            {t('create.subtitle', "Use the form below to describe your desired image and let our AI generate a unique coloring page for you.")}
          </span>
        }
      />

      <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <ImageGenerator />
      </div>
    </div>
  );
} 