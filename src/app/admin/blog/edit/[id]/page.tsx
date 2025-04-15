'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createSlug } from '@/utils/string';
import Image from 'next/image';

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    meta_description: '',
    featured_image_url: '',
    tags: '',
    is_published: true
  });

  // Fetch the blog post data when the component mounts
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error('Blog post not found');
        }

        setFormData({
          title: data.title || '',
          content: data.content || '',
          meta_description: data.meta_description || '',
          featured_image_url: data.featured_image_url || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          is_published: data.is_published
        });
      } catch (err: unknown) {
        console.error('Error fetching blog post:', err);
        setError(`Failed to load blog post: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      // Create a slug from the title
      const slug = createSlug(formData.title);
      
      // Parse tags into an array
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Update blog post object
      const blogPost = {
        title: formData.title,
        slug,
        content: formData.content,
        meta_description: formData.meta_description,
        featured_image_url: formData.featured_image_url || null,
        tags,
        is_published: formData.is_published,
        updated_at: new Date().toISOString()
      };

      // Save to Supabase
      const { error } = await supabase
        .from('blog_posts')
        .update(blogPost)
        .eq('id', params.id);

      if (error) {
        throw error;
      }

      setMessage('Blog post updated successfully!');
      
    } catch (err: unknown) {
      console.error('Error updating blog post:', err);
      setError(`Failed to update blog post: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Loading blog post...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Blog Post
          </h2>
        </div>
        <div className="flex mt-4 md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to List
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-6 p-4 rounded-md bg-green-50 text-green-800">
          {message}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
              Meta Description (for SEO)
            </label>
            <input
              type="text"
              name="meta_description"
              id="meta_description"
              required
              value={formData.meta_description}
              onChange={handleChange}
              maxLength={160}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            <p className="mt-1 text-sm text-gray-500">
              {160 - formData.meta_description.length} characters remaining (max 160)
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content (HTML supported)
            </label>
            <textarea
              name="content"
              id="content"
              required
              rows={15}
              value={formData.content}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="featured_image_url" className="block text-sm font-medium text-gray-700">
              Featured Image URL
            </label>
            <input
              type="url"
              name="featured_image_url"
              id="featured_image_url"
              value={formData.featured_image_url}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            {formData.featured_image_url && (
              <div className="mt-2">
                <Image 
                  src={formData.featured_image_url} 
                  alt="Featured image preview" 
                  width={128}
                  height={128}
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="coloring, educational, kids"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_published"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
              Published
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Update Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 