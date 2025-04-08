import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TranslationProvider } from '@/lib/i18n/context';
import { Navigation } from '@/components/Navigation';
import Loading from './loading';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import "../globals.css";
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

// 动态导入修复翻译的组件，确保它们只在客户端运行
const FixTranslationsV5 = dynamic(
  () => import('../debug/fix-translations-v5'),
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

// Validate language middleware
export function middleware(request: Request) {
  const pathname = new URL(request.url).pathname;
  const pathSegments = pathname.split('/');
  const lang = pathSegments[1];

  // Check if the language is valid
  if (lang && !SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
    redirect('/en');
  }
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
  
  if (!isValidLanguage) {
    redirect('/en');
  }
  
  return (
    <html lang={lang} className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-50`}>
        <TranslationProvider initialLang={lang}>
          <Suspense fallback={<Loading />}>
            <Navigation currentLang={lang} />
            {children}
            <Toaster position="top-center" toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            {/* 添加修复翻译的组件，只在中文页面生效 - 主要使用V5版本 */}
            {lang === 'zh' && (
              <>
                <FixTranslationsV5 />
              </>
            )}
          </Suspense>
        </TranslationProvider>
        <Analytics />
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
} 