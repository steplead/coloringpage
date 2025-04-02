import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';

  // Fetch blog posts for sitemap
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at')
    .eq('is_published', true);

  // Fetch gallery images (limit to recent/popular ones)
  const { data: galleryImages } = await supabase
    .from('images')
    .select('id, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(100);

  // Static routes with their update frequency and priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Add blog post URLs to sitemap
  const blogRoutes = blogPosts
    ? blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    : [];

  // Add gallery image URLs to sitemap
  const galleryRoutes = galleryImages
    ? galleryImages.map((image) => ({
        url: `${baseUrl}/gallery/${image.id}`,
        lastModified: new Date(image.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    : [];

  // Combine all routes
  return [...staticRoutes, ...blogRoutes, ...galleryRoutes];
} 