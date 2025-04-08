import type { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { Suspense } from 'react';
import Loading from './loading';
import { TranslationProvider } from '@/lib/i18n/context';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  // Get the current language
  const lang = params.lang;
  
  // Find language details
  const languageInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang);
  const languageName = languageInfo?.name || 'English';
  
  return {
    title: {
      template: '%s | AI Coloring Page Generator',
      default: `AI Coloring Page Generator - ${languageName}`,
    },
    description: `Create beautiful coloring pages with AI. Available in ${languageName}.`,
    alternates: {
      canonical: `https://ai-coloringpage.com/${lang}`,
      languages: {
        'x-default': 'https://ai-coloringpage.com',
      },
    },
  };
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export default function LanguageLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Validate the language parameter
  const { lang } = params;
  const isValidLanguage = SUPPORTED_LANGUAGES.some(l => l.code === lang);
  
  // If language is not supported, redirect to the default English page
  if (!isValidLanguage) {
    redirect('/en');
  }
  
  return (
    <TranslationProvider initialLang={lang}>
      <Suspense fallback={<Loading />}>
        <Navigation currentLang={lang} />
        {children}
      </Suspense>
    </TranslationProvider>
  );
} 