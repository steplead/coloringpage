import { NextRequest, NextResponse } from 'next/server';
import sitemap from '../sitemap';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

/**
 * Generates a sitemap.xml for a specific language
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
    
    const sitemapData = await sitemap({ params: { lang } });
    
    // Manually generate the XML
    const xml = generateSitemapXml(sitemapData);
    
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

// Helper function to generate sitemap XML
function generateSitemapXml(sitemapData: any[]) {
  const entries = sitemapData.map(entry => {
    const alternates = entry.alternates?.languages 
      ? Object.entries(entry.alternates.languages)
          .map(([lang, url]) => 
            `<xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`)
          .join('\n    ')
      : '';
    
    return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency || 'daily'}</changefreq>
    <priority>${entry.priority || 0.7}</priority>
    ${alternates}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>`;
}

export const dynamic = 'force-dynamic';

// Generate static params for all supported languages
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
} 