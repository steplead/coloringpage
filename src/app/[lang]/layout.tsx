import type { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { Suspense } from 'react';
import Loading from './loading';
import { TranslationProvider } from '@/lib/i18n/context';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import dynamic from 'next/dynamic';

// 动态导入修复翻译的组件，确保它们只在客户端运行
const FixTranslations = dynamic(
  () => import('../debug/fix-translations'),
  { ssr: false }
);

const FixTranslationsV2 = dynamic(
  () => import('../debug/fix-translations-v2'),
  { ssr: false }
);

const FixTranslationsV3 = dynamic(
  () => import('../debug/fix-translations-v3'),
  { ssr: false }
);

const FixTranslationsV4 = dynamic(
  () => import('../debug/fix-translations-v4'),
  { ssr: false }
);

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
        {/* 添加修复翻译的组件，只在中文页面生效 - 主要使用V4版本 */}
        {lang === 'zh' && (
          <>
            <FixTranslationsV4 />
          </>
        )}
      </Suspense>
    </TranslationProvider>
  );
} 