import { MetadataRoute } from 'next';
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

export default async function sitemap({ params }: { params: { lang: string } }): Promise<MetadataRoute.Sitemap> {
  const { lang } = params;
  const currentDate = new Date().toISOString();
  
  let sitemapEntries: MetadataRoute.Sitemap = [];
  
  // Validate that this is a supported language
  if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
    // Return empty sitemap for unsupported languages
    return [];
  }
  
  // Add routes for this specific language
  routes.forEach(route => {
    // For root path, just use language code
    const localizedPath = route === '/' 
      ? `/${lang}` 
      : `/${lang}${route}`;
    
    sitemapEntries.push({
      url: `${BASE_URL}${localizedPath}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: route === '/' ? 1 : 0.8,
      // Add language alternates for SEO
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LANGUAGES
            .filter(l => l.code !== lang)
            .map(l => [
              l.code,
              `${BASE_URL}/${l.code}${route === '/' ? '' : route}`
            ])
        )
      }
    });
  });
  
  // Fetch blog posts for sitemap
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(100);

  // Add blog post URLs to sitemap with this language prefix
  const blogRoutes = blogPosts
    ? blogPosts.map((post) => ({
        url: `${BASE_URL}/${lang}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        // Add language alternates for blog posts
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LANGUAGES
              .filter(l => l.code !== lang)
              .map(l => [
                l.code,
                `${BASE_URL}/${l.code}/blog/${post.slug}`
              ])
          )
        }
      }))
    : [];

  // Fetch gallery images for sitemap
  const { data: galleryImages } = await supabase
    .from('images')
    .select('id, created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(100);

  // Add gallery images to sitemap with this language prefix
  const galleryRoutes = galleryImages
    ? galleryImages.map((image) => ({
        url: `${BASE_URL}/${lang}/gallery/${image.id}`,
        lastModified: new Date(image.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        // Add language alternates for gallery items
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LANGUAGES
              .filter(l => l.code !== lang)
              .map(l => [
                l.code,
                `${BASE_URL}/${l.code}/gallery/${image.id}`
              ])
          )
        }
      }))
    : [];

  // Combine all routes for this language
  return [...sitemapEntries, ...blogRoutes, ...galleryRoutes];
}

// Generate static params for all supported languages
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
} 