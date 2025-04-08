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

// 动态导入调试和修复组件
const FixTranslationsV7 = dynamic(() => import('@/app/debug/fix-translations-v7'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Coloring Page Generator',
  description: 'Create coloring pages with AI',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string }
}) {
  // 如果语言不受支持，返回默认元数据
  if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
    return metadata
  }

  return {
    title: {
      default: lang === 'zh' ? 'AI涂色页生成器' : 'AI Coloring Page Generator',
      template: '%s | ' + (lang === 'zh' ? 'AI涂色页生成器' : 'AI Coloring Page Generator'),
    },
    description:
      lang === 'zh'
        ? '使用人工智能创建独特的涂色页，适合儿童和成人'
        : 'Create unique coloring pages with artificial intelligence, perfect for kids and adults',
    openGraph: {
      title: lang === 'zh' ? 'AI涂色页生成器' : 'AI Coloring Page Generator',
      description:
        lang === 'zh'
          ? '使用人工智能创建独特的涂色页，适合儿童和成人'
          : 'Create unique coloring pages with artificial intelligence, perfect for kids and adults',
    },
  }
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang: lang.code }))
}

// 中间件检查语言是否支持
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
    <html lang={lang}>
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
          {/* 修复中文翻译 - 注意: 当前最新版本为 V7，替代之前所有版本 */}
          {lang === 'zh' && <FixTranslationsV7 />}
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