import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

/**
 * Temporary simplified version of the sitemap.xml route
 * Returns a basic XML structure instead of the full sitemap
 */
export async function GET(
  request: NextRequest,
  context: { params: { lang: string } }
) {
  try {
    if (!context || !context.params || !context.params.lang) {
      return new NextResponse('Language parameter is missing', { status: 400 });
    }

    const lang = context.params.lang;
    
    // Validate language
    const isValidLanguage = SUPPORTED_LANGUAGES.some(l => l.code === lang);
    if (!isValidLanguage) {
      return new NextResponse('Invalid language', { status: 400 });
    }
    
    // Return a simplified sitemap for now
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://ai-coloringpage.com/${lang}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    // Return the XML with the proper content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

// Generate static params for all supported languages
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
} 