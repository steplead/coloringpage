import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast'
import { TranslationProvider } from '@/lib/i18n/context'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales'
import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'
import { Navigation } from '@/components/Navigation'
import Loading from './loading'

// 注意: 临时禁用了修复脚本
// const FixTranslationsV10 = dynamic(() => import('@/app/debug/fix-translations-v10'), { ssr: false })

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang;
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

export default function LangLayout({
  params: { lang },
  children,
}: {
  params: { lang: string }
  children: React.ReactNode
}) {
  if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
    notFound()
  }

  return (
    <TranslationProvider initialLang={lang}>
      <Suspense fallback={<Loading />}>
        <Navigation currentLang={lang} />
        {children}
        <Toaster position="bottom-center" />
      </Suspense>
      {/* 临时禁用了翻译修复组件 */}
      {/* {lang === 'zh' && <FixTranslationsV10 />} */}
      <Analytics />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client="ca-pub-92597486097093773"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
    </TranslationProvider>
  )
} 