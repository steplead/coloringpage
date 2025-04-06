import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';

// Main routes without language prefix
const routes = [
  '/',
  '/create',
  '/gallery',
  '/blog',
  '/about',
];

export async function GET(
  request: Request,
  { params }: { params: { lang: string } }
) {
  const { lang } = params;
  
  // Validate that this is a supported language
  if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
    // Return 404 for unsupported languages
    return new NextResponse('Language not supported', { status: 404 });
  }
  
  try {
    const timestamp = new Date().toISOString();
    let urlEntries = '';
    
    // Add routes for this specific language
    routes.forEach(route => {
      // For root path, just use language code
      const localizedPath = route === '/' 
        ? `/${lang}` 
        : `/${lang}${route}`;
      
      // Add alternate language references
      let alternateLanguages = '';
      SUPPORTED_LANGUAGES
        .filter(l => l.code !== lang)
        .forEach(l => {
          const alternatePath = route === '/' 
            ? `/${l.code}` 
            : `/${l.code}${route}`;
          
          alternateLanguages += `
      <xhtml:link 
        rel="alternate" 
        hreflang="${l.code}" 
        href="${BASE_URL}${alternatePath}" />`;
        });
      
      urlEntries += `
  <url>
    <loc>${BASE_URL}${localizedPath}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>${alternateLanguages}
    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${BASE_URL}${route}" />
  </url>`;
    });
    
    // Fetch blog posts for sitemap
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(100);

    // Add blog post URLs to sitemap with this language prefix
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const localizedPath = `/${lang}/blog/${post.slug}`;
        const lastMod = new Date(post.updated_at || post.created_at).toISOString();
        
        // Add alternate language references
        let alternateLanguages = '';
        SUPPORTED_LANGUAGES
          .filter(l => l.code !== lang)
          .forEach(l => {
            alternateLanguages += `
      <xhtml:link 
        rel="alternate" 
        hreflang="${l.code}" 
        href="${BASE_URL}/${l.code}/blog/${post.slug}" />`;
          });
        
        urlEntries += `
  <url>
    <loc>${BASE_URL}${localizedPath}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${alternateLanguages}
    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${BASE_URL}/blog/${post.slug}" />
  </url>`;
      }
    }

    // Fetch gallery images for sitemap
    const { data: galleryImages } = await supabase
      .from('images')
      .select('id, created_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(100);

    // Add gallery images to sitemap with this language prefix
    if (galleryImages && galleryImages.length > 0) {
      for (const image of galleryImages) {
        const localizedPath = `/${lang}/gallery/${image.id}`;
        const lastMod = new Date(image.created_at).toISOString();
        
        // Add alternate language references
        let alternateLanguages = '';
        SUPPORTED_LANGUAGES
          .filter(l => l.code !== lang)
          .forEach(l => {
            alternateLanguages += `
      <xhtml:link 
        rel="alternate" 
        hreflang="${l.code}" 
        href="${BASE_URL}/${l.code}/gallery/${image.id}" />`;
          });
        
        urlEntries += `
  <url>
    <loc>${BASE_URL}${localizedPath}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${alternateLanguages}
    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${BASE_URL}/gallery/${image.id}" />
  </url>`;
      }
    }
    
    // Build the complete sitemap XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

    // Return the XML with the proper content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, must-revalidate'
      },
    });
  } catch (error) {
    console.error('Error generating language sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
} 