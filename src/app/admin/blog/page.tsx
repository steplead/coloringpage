'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Blog post type
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  featured_image_url?: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function BlogAdminPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setBlogPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. ' + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  // Delete blog post
  const deleteBlogPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setBlogPosts(blogPosts.filter(post => post.id !== id));
      setMessage('Blog post deleted successfully.');
    } catch (err: any) {
      console.error('Error deleting blog post:', err);
      setError('Failed to delete blog post. ' + (err.message || ''));
    }
  };

  // Toggle publish status
  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !currentStatus })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setBlogPosts(blogPosts.map(post => 
        post.id === id ? { ...post, is_published: !currentStatus } : post
      ));
      setMessage(`Blog post ${!currentStatus ? 'published' : 'unpublished'} successfully.`);
    } catch (err: any) {
      console.error('Error updating publish status:', err);
      setError('Failed to update publish status. ' + (err.message || ''));
    }
  };

  // Generate blog posts
  const generateBlogPosts = async () => {
    setIsGenerating(true);
    setMessage('');
    setError('');
    
    try {
      const response = await fetch('/api/blog/auto-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: generationCount, targetLength: 800 }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`Successfully generated ${data.generated} blog posts!`);
        fetchBlogPosts();
      } else {
        setError(`Failed to generate blog posts. ${data.error || ''}`);
      }
    } catch (err: any) {
      console.error('Error generating blog posts:', err);
      setError('Error generating blog posts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load blog posts on mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Blog Post Management
          </h2>
        </div>
      </div>

      {(message || error) && (
        <div className={`mb-6 p-4 rounded-md ${error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message || error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Generate New Blog Posts</h3>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div>
              <label htmlFor="postCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Posts to Generate
              </label>
              <select
                id="postCount"
                value={generationCount}
                onChange={(e) => setGenerationCount(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {[1, 2, 3, 5, 10].map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </div>
            <button
              onClick={generateBlogPosts}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Blog Posts'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-6 text-center">Loading blog posts...</div>
        ) : blogPosts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No blog posts found. Generate some posts to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {currentPosts.map((post) => (
              <li key={post.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className={`text-sm font-medium ${post.is_published ? 'text-green-600' : 'text-orange-600'} mr-2`}>
                        {post.is_published ? '● Published' : '○ Draft'}
                      </p>
                      <h3 className="text-sm font-medium text-blue-600 truncate">{post.title}</h3>
                    </div>
                    <div className="flex flex-shrink-0 space-x-2">
                      <a 
                        href={`/blog/${post.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View
                      </a>
                      <button
                        onClick={() => togglePublishStatus(post.id, post.is_published)}
                        className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                          post.is_published
                            ? 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        {post.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Created: {new Date(post.created_at).toLocaleDateString()}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Slug: {post.slug}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="flex flex-wrap gap-1">
                        {post.tags && post.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {blogPosts.length > postsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-md">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstPost + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastPost, blogPosts.length)}
                </span>{' '}
                of <span className="font-medium">{blogPosts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === page
                        ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 