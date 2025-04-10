import { redirect } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import type { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  const language = SUPPORTED_LANGUAGES.find(l => l.code === lang);
  const languageName = language?.name || 'English';
  
  return {
    title: `AI Coloring Page Generator - ${languageName}`,
    description: `Create beautiful coloring pages with AI in ${languageName}.`,
  };
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export default function LanguageHomePage({ params }: { params: { lang: string } }) {
  // Validate the language parameter
  const { lang } = params;
  const isValidLanguage = SUPPORTED_LANGUAGES.some(l => l.code === lang);
  
  // If language is not supported, redirect to the default English page
  if (!isValidLanguage) {
    redirect('/en');
  }
  
  // Return the HomeContent component with the language parameter
  return <HomeContent currentLang={lang} />;
} 