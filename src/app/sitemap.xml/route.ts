import { NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

/**
 * Root-level sitemap generator
 */
export async function GET(request: Request) {
  try {
    // Create a sitemap with homepage URLs for each language
    const timestamp = new Date().toISOString();
    
    let urlEntries = '';
    
    // Add entry for the site root
    urlEntries += `
  <url>
    <loc>https://ai-coloringpage.com</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    // Add entry for each supported language
    for (const lang of SUPPORTED_LANGUAGES) {
      urlEntries += `
  <url>
    <loc>https://ai-coloringpage.com/${lang.code}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    }
    
    // Add common pages for each language
    const pages = ['/create', '/gallery', '/blog', '/about'];
    
    for (const lang of SUPPORTED_LANGUAGES) {
      for (const page of pages) {
        urlEntries += `
  <url>
    <loc>https://ai-coloringpage.com/${lang.code}${page}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

    // Return the XML with the proper content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, must-revalidate'
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

// Use static generation with revalidation
export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate once per day 