import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { initializeStorage } from '@/lib/storage';

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
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
  colorScheme: 'light',
};

// Initialize Supabase Storage
if (typeof window === 'undefined') {
  initializeStorage().catch(error => {
    console.error('Failed to initialize Supabase Storage:', error);
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
} 