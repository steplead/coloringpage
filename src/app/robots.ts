import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';

// Only include the languages we actually support with translations
const ACTIVE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
];

export default function robots(): MetadataRoute.Robots {
  // Create an array of language-specific sitemaps
  const languageSitemaps = ACTIVE_LANGUAGES.map(lang => 
    `${BASE_URL}/${lang.code}/sitemap.xml`
  );

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/'],
    },
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      ...languageSitemaps
    ],
  };
} 