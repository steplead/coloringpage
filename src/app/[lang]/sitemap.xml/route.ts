import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';

// Only include the languages we actually support with translations
const ACTIVE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
];

// Main routes without language prefix
const routes = [
  '/',
  '/create',
  '/gallery',
  '/blog',
  '/about',
];

// Check if we're in a build context and should skip sitemap generation
const shouldSkipSitemap = process.env.SKIP_SITEMAP === 'true';

export async function generateStaticParams() {
  // Only generate for active languages 
  return ACTIVE_LANGUAGES.map(lang => ({
    lang: lang.code
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  // During build time with SKIP_SITEMAP flag, return a simplified sitemap
  if (shouldSkipSitemap) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${BASE_URL}/${params.lang}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      </urlset>`,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    );
  }

  const { lang } = params;
  
  // Validate that this is a supported language
  if (!ACTIVE_LANGUAGES.some(l => l.code === lang)) {
    // Return 404 for unsupported languages
    return new Response('Not Found', { status: 404 });
  }
  
  // Create XML content
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
  
  const currentDate = new Date().toISOString();
  
  // Add routes for this specific language
  routes.forEach(route => {
    // For root path, just use language code
    const localizedPath = route === '/' 
      ? `/${lang}` 
      : `/${lang}${route}`;
    
    xml += `
  <url>
    <loc>${BASE_URL}${localizedPath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>`;
    
    // Add alternate language links for each route
    ACTIVE_LANGUAGES.forEach(language => {
      if (language.code !== lang) {
        const alternatePath = route === '/' 
          ? `/${language.code}` 
          : `/${language.code}${route}`;
          
        xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="${language.code}" 
      href="${BASE_URL}${alternatePath}" 
    />`;
      }
    });
    
    // Add default language reference
    xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${BASE_URL}${route}" 
    />
  </url>`;
  });
  
  try {
    // Fetch blog posts for sitemap
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(50);

    // Add blog post URLs to sitemap with this language prefix
    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach(post => {
        const lastMod = new Date(post.updated_at || post.created_at).toISOString();
        
        xml += `
  <url>
    <loc>${BASE_URL}/${lang}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>`;
        
        // Add alternate language links
        ACTIVE_LANGUAGES.forEach(language => {
          if (language.code !== lang) {
            xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="${language.code}" 
      href="${BASE_URL}/${language.code}/blog/${post.slug}" 
    />`;
          }
        });
        
        xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${BASE_URL}/blog/${post.slug}" 
    />
  </url>`;
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }
  
  try {
    // Fetch gallery images for sitemap
    const { data: galleryImages } = await supabase
      .from('images')
      .select('id, created_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50);

    // Add gallery images to sitemap with this language prefix
    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach(image => {
        const lastMod = new Date(image.created_at).toISOString();
        
        xml += `
  <url>
    <loc>${BASE_URL}/${lang}/gallery/${image.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;
        
        // Add alternate language links
        ACTIVE_LANGUAGES.forEach(language => {
          if (language.code !== lang) {
            xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="${language.code}" 
      href="${BASE_URL}/${language.code}/gallery/${image.id}" 
    />`;
          }
        });
        
        xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${BASE_URL}/gallery/${image.id}" 
    />
  </url>`;
      });
    }
  } catch (error) {
    console.error('Error fetching gallery images for sitemap:', error);
  }
  
  // Close XML structure
  xml += `
</urlset>`;
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 