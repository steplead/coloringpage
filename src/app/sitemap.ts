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
  
  // Add default site root
  sitemapEntries.push({
    url: `${BASE_URL}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 1,
  });
  
  // Add routes for each language
  for (const language of SUPPORTED_LANGUAGES) {
    const lang = language.code;
    
    // Add language root
    sitemapEntries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    });
    
    // Add routes for this specific language (excluding root which was already added)
    for (const route of routes.filter(r => r !== '/')) {
      sitemapEntries.push({
        url: `${BASE_URL}/${lang}${route}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }
  
  try {
    // Fetch blog posts for sitemap
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(100);

    // Add blog post URLs to sitemap for each language
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        for (const language of SUPPORTED_LANGUAGES) {
          sitemapEntries.push({
            url: `${BASE_URL}/${language.code}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at || post.created_at).toISOString(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }

    // Fetch gallery images for sitemap
    const { data: galleryImages } = await supabase
      .from('images')
      .select('id, created_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(100);

    // Add gallery images to sitemap for each language
    if (galleryImages && galleryImages.length > 0) {
      for (const image of galleryImages) {
        for (const language of SUPPORTED_LANGUAGES) {
          sitemapEntries.push({
            url: `${BASE_URL}/${language.code}/gallery/${image.id}`,
            lastModified: new Date(image.created_at).toISOString(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error generating sitemap data:', error);
    // Continue with partial sitemap even if database queries fail
  }

  return sitemapEntries;
} 