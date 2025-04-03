import { redirect } from 'next/navigation';
import GalleryPage from '@/app/gallery/page';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export default function LanguageGalleryPage({ params }: { params: { lang: string } }) {
  // Validate the language parameter
  const { lang } = params;
  const isValidLanguage = SUPPORTED_LANGUAGES.some(l => l.code === lang);
  
  // If language is not supported, redirect to the default English page
  if (!isValidLanguage) {
    redirect('/en/gallery');
  }
  
  // Pass language parameter to the original page
  return <GalleryPage params={{ lang }} />;
} 