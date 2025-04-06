import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

import { Navigation } from '@/components/Navigation';
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

export const metadata: Metadata = {
  title: 'AI Coloring Page - Create & Color Beautiful Drawings',
  description: 'Create beautiful coloring pages with AI. Transform your ideas into stunning drawings ready to color. Perfect for all ages and artistic abilities.',
  keywords: 'AI coloring, coloring pages, AI drawing, coloring book, digital coloring, custom coloring pages',
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  themeColor: '#ffffff',
  colorScheme: 'light',
  applicationName: 'AI Coloring Page Generator',
  appleWebApp: {
    capable: true,
    title: 'AI Coloring Page Generator',
    statusBarStyle: 'default',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'AI Coloring Page Generator',
    title: 'AI Coloring Page Generator | Create Custom Coloring Pages',
    description: 'Create unique coloring pages with AI. Generate custom coloring pages from text descriptions. Perfect for kids, adults, and educational use.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Coloring Page Generator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Coloring Page Generator | Create Custom Coloring Pages',
    description: 'Create unique coloring pages with AI. Generate custom coloring pages from text descriptions. Perfect for kids, adults, and educational use.',
    images: ['/og-image.jpg'],
    creator: '@yourtwitter',
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
  verification: {
    google: 'your-google-site-verification',
  },
  alternates: {
    canonical: SITE_URL,
    languages: buildLanguageAlternates(),
  },
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Initialize Supabase Storage
if (typeof window === 'undefined') {
  initializeStorage().catch(error => {
    console.error('Failed to initialize Supabase Storage:', error);
  });
}

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
    <html lang={currentLang} className="scroll-smooth">
      <head>
        {/* Add hreflang tags for better SEO */}
        {SUPPORTED_LANGUAGES.map(lang => (
          <link 
            key={lang.code}
            rel="alternate" 
            hrefLang={lang.code} 
            href={`${SITE_URL}/${lang.code}`} 
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navigation currentLang={currentLang} />
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