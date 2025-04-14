import { supabase } from '@/lib/supabase';

// Types for blog posts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  featured_image_url?: string;
  related_coloring_page_id?: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  seo_data?: {
    keywords?: string[];
    primaryKeyword?: string;
    canonicalUrl?: string;
    structuredData?: any;
    faqSchema?: any[];
  };
}

/**
 * Get blog post by slug from Supabase
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    
    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
    
    return data as BlogPost;
  } catch (err) {
    console.error('Exception fetching blog post:', err);
    return null;
  }
}

/**
 * Get related blog posts based on tags
 */
export async function getRelatedBlogPosts(currentPostId: string, tags: string[]): Promise<BlogPost[]> {
  try {
    // Select posts that have at least one matching tag but are not the current post
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .neq('id', currentPostId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
    
    // Sort by tag relevance (number of matching tags)
    return (data as BlogPost[]).sort((a, b) => {
      const aMatchCount = a.tags.filter((tag: string) => tags.includes(tag)).length;
      const bMatchCount = b.tags.filter((tag: string) => tags.includes(tag)).length;
      return bMatchCount - aMatchCount;
    });
  } catch (err) {
    console.error('Exception fetching related posts:', err);
    return [];
  }
}

/**
 * Get recent blog posts
 */
export async function getRecentBlogPosts(limit = 6): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent posts:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (err) {
    console.error('Exception fetching recent posts:', err);
    return [];
  }
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string, limit = 12): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .contains('tags', [tag])
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching posts by tag:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (err) {
    console.error('Exception fetching posts by tag:', err);
    return [];
  }
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(query: string, limit = 10): Promise<BlogPost[]> {
  try {
    // Use Supabase full text search if available
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,meta_description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error searching blog posts:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (err) {
    console.error('Exception searching blog posts:', err);
    return [];
  }
} 