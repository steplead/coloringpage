import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

import { Footer } from '@/components/Footer';
import { initializeStorage } from '@/lib/storage';
import LanguageDetectionBanner from '@/components/LanguageDetectionBanner';

const inter = Inter({ subsets: ['latin'] });

// Base URL
const SITE_URL = 'https://ai-coloringpage.com';

// Helper to build language alternates for SEO
function buildLanguageAlternates() {
  const alternates: Record<string, string> = {};
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    alternates[lang.code] = `${SITE_URL}/${lang.code}`;
  });
  
  return alternates;
}

// Metadata generation function
export async function generateMetadata({ params }: { params: { lang?: string } }): Promise<Metadata> {
  const currentLang = params?.lang || 'en';
  
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'AI Coloring Page Generator | Free Printable Pages',
      template: '%s | AI Coloring Page Generator',
    },
    description: 'Generate unique, beautiful coloring pages from text prompts or images using AI. Free, printable, and perfect for all ages.',
    keywords: ['AI coloring page', 'coloring page generator', 'free printable coloring pages', 'custom coloring pages', 'text to coloring page', 'image to coloring page', 'AI art', 'coloring for kids', 'adult coloring'],
    manifest: '/manifest.webmanifest',
    alternates: {
      canonical: `/${currentLang}`,
      languages: buildLanguageAlternates(),
    },
    openGraph: {
      title: 'AI Coloring Page Generator | Free Printable Pages',
      description: 'Create personalized coloring pages instantly with AI. Free and easy to use!',
      url: SITE_URL,
      siteName: 'AI Coloring Page Generator',
      images: [
        {
          url: `${SITE_URL}/og-image.png`, 
          width: 1200,
          height: 630,
          alt: 'AI Coloring Page Generator',
        },
      ],
      locale: currentLang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Coloring Page Generator | Free Printable Pages',
      description: 'Generate unique coloring pages with AI. Free, printable, and fun!',
      images: [`${SITE_URL}/twitter-image.png`],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
      other: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/favicon-16x16.png',
        },
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Initialize Supabase Storage
// Removed call to initializeStorage() here as it was causing console errors
// and is unnecessary since bucket existence is verified manually.

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  // Extract the lang parameter from the URL path segments
  // This requires looking at the request path since we're in the root layout
  const pathname = headers().get('x-pathname') || '';
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Check if the first segment is a valid language code
  let currentLang = 'en'; // Default language
  if (pathSegments.length > 0) {
    const potentialLang = pathSegments[0];
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === potentialLang)) {
      currentLang = potentialLang;
    }
  }

  return (
    <html lang={currentLang} className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <LanguageDetectionBanner />
        </div>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
  colorScheme: 'light',
}; 