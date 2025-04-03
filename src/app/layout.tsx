import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import React from 'react';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { detectLanguage } from '@/lib/i18n';
import { initializeStorage } from '@/lib/storage';

const inter = Inter({ subsets: ['latin'] });

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
    url: 'https://ai-coloringpage.com',
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
    canonical: 'https://ai-coloringpage.com',
    languages: {
      'en': 'https://ai-coloringpage.com',
      'zh': 'https://ai-coloringpage.com?lang=zh',
      'es': 'https://ai-coloringpage.com?lang=es',
      'fr': 'https://ai-coloringpage.com?lang=fr',
      'de': 'https://ai-coloringpage.com?lang=de',
      'ja': 'https://ai-coloringpage.com?lang=ja',
      'ko': 'https://ai-coloringpage.com?lang=ko',
      'ru': 'https://ai-coloringpage.com?lang=ru',
    },
  },
  metadataBase: new URL('https://ai-coloringpage.com'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// 初始化Supabase Storage
if (typeof window === 'undefined') {
  initializeStorage().catch(error => {
    console.error('Failed to initialize Supabase Storage:', error);
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the current language from headers (set by middleware)
  const headersList = headers();
  const currentLang = headersList.get('x-locale') || 'en';

  return (
    <html lang={currentLang} className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navigation currentLang={currentLang} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
} 