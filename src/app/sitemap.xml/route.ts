import { NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

/**
 * Root-level sitemap generator
 */
export async function GET() {
  // Create a sitemap with homepage URLs for each language
  const timestamp = new Date().toISOString();
  
  let urlEntries = '';
  
  // Add entry for each supported language
  for (const lang of SUPPORTED_LANGUAGES) {
    urlEntries += `
  <url>
    <loc>https://ai-coloringpage.com/${lang.code}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
  }
  
  // Add root URL
  urlEntries += `
  <url>
    <loc>https://ai-coloringpage.com</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

  // Return the XML with the proper content type
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

// Use static generation with revalidation
export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate once per day 