import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast'
import { TranslationProvider } from '@/lib/i18n/context'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Navigation } from '@/components/Navigation'
import Loading from './loading'

// 动态导入调试组件
// 注意: V9是最新版修复程序，使用了更高级的DOM API拦截
const FixTranslationsV9 = dynamic(() => import('@/app/debug/fix-translations-v9'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

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

export default function RootLayout({
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
    <html 
      lang={lang}
      className={inter.className}
      suppressHydrationWarning={true}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn(inter.className, 'bg-gray-50')}>
        <TranslationProvider initialLang={lang}>
          <Suspense fallback={<Loading />}>
            <Navigation currentLang={lang} />
            {children}
            <Toaster position="bottom-center" />
          </Suspense>
          {/* 翻译修复组件，仅在中文页面加载 */}
          {lang === 'zh' && <FixTranslationsV9 />}
        </TranslationProvider>
        <Analytics />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-92597486097093773"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
} 