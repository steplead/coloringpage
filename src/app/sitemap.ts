import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { URL } from 'url';

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
  
  // Generate language-specific routes first
  const languageRoutes = SUPPORTED_LANGUAGES.flatMap(language => 
    routes.map(route => {
      const localizedPath = route === '/' ? `/${language.code}` : `/${language.code}${route}`;
      const mainUrl = new URL(localizedPath, BASE_URL).toString();

      return {
        url: mainUrl,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: route === '/' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LANGUAGES
              .filter(lang => lang.code !== language.code)
              .map(lang => {
                const altPath = route === '/' ? `/${lang.code}` : `/${lang.code}${route}`;
                return [lang.code, new URL(altPath, BASE_URL).toString()];
              })
          )
        }
      };
    })
  );
  
  // Generate default routes (without language prefix)
  const defaultRoutes = routes.map(route => {
    const defaultUrl = new URL(route, BASE_URL).toString();
    return {
      url: defaultUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: route === '/' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LANGUAGES.map(lang => {
            const altPath = route === '/' ? `/${lang.code}` : `/${lang.code}${route}`;
            return [lang.code, new URL(altPath, BASE_URL).toString()];
          })
        )
      }
    };
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
    ? blogPosts.map((post) => {
        const postUrl = new URL(`/blog/${post.slug}`, BASE_URL).toString();
        return {
          url: postUrl,
          lastModified: new Date(post.updated_at || post.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              SUPPORTED_LANGUAGES.map(lang => [
                lang.code,
                new URL(`/${lang.code}/blog/${post.slug}`, BASE_URL).toString()
              ])
            )
          }
        };
      })
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
    ? galleryImages.map((image) => {
        const imageUrl = new URL(`/gallery/${image.id}`, BASE_URL).toString();
        return {
          url: imageUrl,
          lastModified: new Date(image.created_at),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              SUPPORTED_LANGUAGES.map(lang => [
                lang.code,
                new URL(`/${lang.code}/gallery/${image.id}`, BASE_URL).toString()
              ])
            )
          }
        };
      })
    : [];

  // Combine all routes
  return [...languageRoutes, ...defaultRoutes, ...blogRoutes, ...galleryRoutes];
} 