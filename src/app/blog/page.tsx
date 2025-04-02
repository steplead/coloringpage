import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { supabase } from '@/lib/supabase';
import { truncateText, stripHtml } from '@/utils/string';

// Define metadata for SEO
export const metadata = {
  title: 'Coloring Page Blog | Tips, Ideas & Activities',
  description: 'Discover creative coloring activities, educational benefits, and coloring tips for kids and adults.',
};

// Revalidate content every hour to ensure fresh content
export const revalidate = 3600; // seconds

// Define BlogPost type for TypeScript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  featured_image_url?: string;
  tags: string[];
  created_at: string;
}

/**
 * Get blog posts from Supabase
 */
async function getBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(12);
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (err) {
    console.error('Failed to fetch blog posts:', err);
    return [];
  }
}

/**
 * Main blog listing page component
 */
export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Coloring Page Blog"
        description="Discover creative coloring activities, educational benefits, and coloring tips for kids and adults."
      />
      
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <p className="mt-2 text-sm text-gray-600">
              Explore ideas, tips, and inspiration for coloring activities
            </p>
          </div>
          <Link 
            href="/create" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Coloring Page
          </Link>
        </div>

        {blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white overflow-hidden shadow-sm rounded-lg transition-transform hover:shadow-lg hover:-translate-y-1"
              >
                {post.featured_image_url && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.featured_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.meta_description || truncateText(stripHtml(post.content), 120)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more →
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Blog Posts Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Stay tuned for upcoming articles about coloring activities, benefits, and creative ideas!</p>
            <Link 
              href="/create" 
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create a Coloring Page
            </Link>
          </div>
        )}
      </section>
    </div>
  );
} 