import { MetadataRoute } from 'next';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';
  
  // Create an array of sitemaps
  const sitemaps = [
    // Main sitemap
    `${baseUrl}/sitemap.xml`,
  ];
  
  // Add language-specific sitemaps
  SUPPORTED_LANGUAGES.forEach(lang => {
    sitemaps.push(`${baseUrl}/${lang.code}/sitemap.xml`);
  });
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
      ],
    },
    sitemap: sitemaps,
    host: baseUrl,
  };
} 