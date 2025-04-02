import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// Types for blog posts
interface BlogPost {
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
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: `${post.title} | Coloring Page Blog`,
    description: post.meta_description || `Learn about ${post.title} and explore related coloring activities.`,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      images: post.featured_image_url ? [post.featured_image_url] : []
    }
  };
}

// Revalidate content every hour
export const revalidate = 3600; // seconds

// Get blog post by slug from Supabase
async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
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

// Get related blog posts based on tags
async function getRelatedBlogPosts(currentPostId: string, tags: string[]): Promise<BlogPost[]> {
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

// Interface for coloring page data
interface ColoringPage {
  id: string;
  image_url: string;
  title?: string;
  prompt: string;
}

// Get coloring page by ID
async function getColoringPageById(id: string): Promise<ColoringPage | null> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching coloring page:', error);
      return null;
    }
    
    return data as ColoringPage;
  } catch (err) {
    console.error('Exception fetching coloring page:', err);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = await getRelatedBlogPosts(post.id, post.tags || []);
  const relatedColoringPage = post.related_coloring_page_id 
    ? await getColoringPageById(post.related_coloring_page_id) 
    : null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Image */}
      <div className="relative">
        {post.featured_image_url ? (
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ) : (
          <div className="bg-blue-700 w-full h-48 md:h-64"></div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {post.title}
            </h1>
            <p className="text-white text-lg md:text-xl opacity-90 drop-shadow-md max-w-3xl mx-auto">
              {post.meta_description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <article className="max-w-4xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          {/* Post Metadata */}
          <div className="mb-8 pb-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags && post.tags.map((tag: string) => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <time className="text-gray-500 text-sm">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          
          {/* Post Content */}
          <div 
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Related Coloring Page */}
          {relatedColoringPage && (
            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Try This Coloring Page
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative w-full sm:w-1/3 h-48">
                  <Image
                    src={relatedColoringPage.image_url}
                    alt={relatedColoringPage.title || relatedColoringPage.prompt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">
                    {relatedColoringPage.title || relatedColoringPage.prompt}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Download and print this coloring page to enjoy the creative activity described in this article.
                  </p>
                  <div className="flex gap-3">
                    <Link 
                      href={`/gallery/${relatedColoringPage.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Coloring Page
                    </Link>
                    <Link
                      href={`/gallery/${relatedColoringPage.id}/print`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Print
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: BlogPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="relative h-40 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                    <Image
                      src={relatedPost.featured_image_url || '/images/placeholder-blog.jpg'}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                    {relatedPost.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
} 