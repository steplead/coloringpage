import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AI Coloring Page Generator',
    template: '%s | AI Coloring Page Generator',
  },
  description: 'Create custom coloring pages in multiple styles with AI. Choose complexity levels, explore example ideas, and download high-quality printable coloring pages for kids and adults.',
  keywords: 'coloring pages, AI art, coloring book, custom coloring pages, kids activities, educational coloring, adult coloring, printable coloring pages',
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'AI Coloring Page Generator',
    title: 'AI Coloring Page Generator',
    description: 'Create custom coloring pages in multiple styles with AI. Choose complexity levels, explore example ideas, and download high-quality printable coloring pages.',
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
    title: 'AI Coloring Page Generator',
    description: 'Create custom coloring pages in multiple styles with AI. Choose complexity levels, explore example ideas, and download high-quality printable coloring pages.',
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
    canonical: 'https://your-domain.com',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
} 