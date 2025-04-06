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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();
  
  let sitemapEntries: MetadataRoute.Sitemap = [];
  
  // Add language-specific routes
  SUPPORTED_LANGUAGES.forEach(language => {
    routes.forEach(route => {
      // For root path, just use language code
      const localizedPath = route === '/' 
        ? `/${language.code}` 
        : `/${language.code}${route}`;
      
      sitemapEntries.push({
        url: `${BASE_URL}${localizedPath}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: route === '/' ? 1 : 0.8,
        // Add language information for better SEO
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LANGUAGES
              .filter(lang => lang.code !== language.code)
              .map(lang => [
                lang.code,
                `${BASE_URL}/${lang.code}${route === '/' ? '' : route}`
              ])
          )
        }
      });
    });
  });
  
  // Add default routes as well (without language prefix)
  routes.forEach(route => {
    sitemapEntries.push({
      url: `${BASE_URL}${route}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: route === '/' ? 1 : 0.8,
      // Add default route alternates
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LANGUAGES.map(lang => [
            lang.code,
            `${BASE_URL}/${lang.code}${route === '/' ? '' : route}`
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

  // Add blog post URLs to sitemap
  const blogRoutes = blogPosts
    ? blogPosts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        // Add language alternates for blog posts
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LANGUAGES.map(lang => [
              lang.code,
              `${BASE_URL}/${lang.code}/blog/${post.slug}`
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

  // Add gallery images to sitemap
  const galleryRoutes = galleryImages
    ? galleryImages.map((image) => ({
        url: `${BASE_URL}/gallery/${image.id}`,
        lastModified: new Date(image.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        // Add language alternates for gallery items
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LANGUAGES.map(lang => [
              lang.code,
              `${BASE_URL}/${lang.code}/gallery/${image.id}`
            ])
          )
        }
      }))
    : [];

  // Combine all routes
  return [...sitemapEntries, ...blogRoutes, ...galleryRoutes];
} 