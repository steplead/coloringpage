'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white min-h-[3em] md:min-h-[2.5em] lg:min-h-[2em] flex items-center justify-center md:justify-start">
              {t('home.title')}
            </h1>
            <p className="mt-4 md:mt-6 text-xl text-gray-600 dark:text-gray-300 min-h-[4em] md:min-h-[3em]">
              {t('home.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 min-w-[180px]"
              >
                {t('home.cta')}
              </Link>
              <Link
                href="/gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 md:py-4 md:text-lg md:px-10 min-w-[180px]"
              >
                {t('common.gallery')}
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t('home.pageCount')}
            </p>
          </div>
          <div className="mt-12 md:mt-0 md:w-1/2">
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src="/hero-image.png"
                alt="Coloring page examples"
                width={600}
                height={500}
                className="rounded-lg shadow-xl dark:shadow-indigo-500/10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t('common.create')} {t('common.gallery')} & {t('common.learnMore')}
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white min-h-[3em] sm:min-h-[2em] flex items-center">
                {t('common.create')}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">
                {t('create.promptLabel')}
              </p>
              <Link href="/create" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                {t('common.createNow')} →
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white min-h-[3em] sm:min-h-[2em] flex items-center">
                {t('common.gallery')}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">
                {t('gallery.description')}
              </p>
              <Link href="/gallery" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                {t('gallery.recentCreations')} →
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white min-h-[3em] sm:min-h-[2em] flex items-center">
                {t('common.blog')}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">
                {t('common.learnMore')}
              </p>
              <Link href="/blog" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                {t('common.learnMore')} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 