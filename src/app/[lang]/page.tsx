'use client';

import { redirect } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { PageHeader } from '@/components/PageHeader';
import TranslatedText from '@/components/TranslatedText';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export default function HomePage({ params }: { params: { lang: string } }) {
  // Validate the language parameter
  const { lang } = params;
  const isValidLanguage = SUPPORTED_LANGUAGES.some(l => l.code === lang);
  
  // If language is not supported, redirect to the default English page
  if (!isValidLanguage) {
    redirect('/en');
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PageHeader
        title={<TranslatedText translationKey="home.title" fallback="Welcome to AI Coloring Page" />}
        description={<TranslatedText translationKey="home.description" fallback="Create beautiful coloring pages with AI" />}
      />
      
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href={`/${lang}/create`}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            <TranslatedText translationKey="home.create.title" fallback="Create" />
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            <TranslatedText translationKey="home.create.description" fallback="Create your own coloring page" />
          </p>
        </a>

        <a
          href={`/${lang}/gallery`}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            <TranslatedText translationKey="home.gallery.title" fallback="Gallery" />
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            <TranslatedText translationKey="home.gallery.description" fallback="Browse coloring pages" />
          </p>
        </a>

        <a
          href={`/${lang}/guide`}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            <TranslatedText translationKey="home.guide.title" fallback="Guide" />
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            <TranslatedText translationKey="home.guide.description" fallback="Learn how to use" />
          </p>
        </a>

        <a
          href={`/${lang}/about`}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            <TranslatedText translationKey="home.about.title" fallback="About" />
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            <TranslatedText translationKey="home.about.description" fallback="About this project" />
          </p>
        </a>
      </div>
    </main>
  );
} 