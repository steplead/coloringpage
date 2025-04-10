'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface FormData {
  title: string;
  content: string;
  metaDescription: string;
  tags: string;
  featuredImageUrl: string;
  isPublished: boolean;
}

export default function CreateBlogPost() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    metaDescription: '',
    tags: '',
    featuredImageUrl: '',
    isPublished: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTopic, setGenerationTopic] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  useEffect(() => {
    const words = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    
    // Auto-generate meta description if empty
    if (!formData.metaDescription && formData.content) {
      const firstParagraph = formData.content.split('\n\n')[0].replace(/[#*_]/g, '');
      const description = firstParagraph.length > 160 
        ? firstParagraph.substring(0, 157) + '...' 
        : firstParagraph;
      setFormData(prev => ({ ...prev, metaDescription: description }));
    }
  }, [formData.content]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const slug = generateSlug(formData.title);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert([
          { 
            title: formData.title,
            slug,
            content: formData.content,
            meta_description: formData.metaDescription,
            featured_image_url: formData.featuredImageUrl,
            tags: tagsArray,
            is_published: formData.isPublished
          }
        ])
        .select();
      
      if (insertError) {
        throw insertError;
      }
      
      setMessage('Blog post created successfully!');
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating blog post:', err);
      setError('Failed to create blog post. ' + (err.message || ''));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGenerateContent = async () => {
    if (!generationTopic) {
      setError('Please enter a topic for generation');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: generationTopic }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setFormData({
        title: data.title || '',
        content: data.content || '',
        metaDescription: data.meta_description || '',
        tags: data.tags ? data.tags.join(', ') : '',
        featuredImageUrl: data.featured_image_url || '',
        isPublished: false
      });
      
      setMessage('Content generated successfully!');
    } catch (err: any) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. ' + (err.message || ''));
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <Link 
          href="/admin/blog"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
        >
          Back to Blog Management
        </Link>
      </div>
      
      {(message || error) && (
        <div className={`mb-6 p-4 rounded-md ${error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message || error}
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Generate Content from Topic</h3>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow">
              <label htmlFor="generationTopic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                type="text"
                id="generationTopic"
                value={generationTopic}
                onChange={(e) => setGenerationTopic(e.target.value)}
                placeholder="e.g., Benefits of coloring for children"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating || !generationTopic}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg">
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title * <span className="text-xs text-gray-500">(For SEO, aim for 50-60 characters)</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">{formData.title.length} characters</p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content * <span className="text-xs text-gray-500">(Supports Markdown)</span>
              </label>
              <button 
                type="button" 
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showPreview ? 'Edit Mode' : 'Preview'}
              </button>
            </div>
            
            {!showPreview ? (
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={15}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            ) : (
              <div className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm h-96 overflow-y-auto prose prose-sm max-w-none">
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">{wordCount} words</p>
          </div>
          
          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description <span className="text-xs text-gray-500">(For SEO, aim for 150-160 characters)</span>
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="A brief description for search engines (recommended 150-160 characters)"
            />
            <p className="mt-1 text-xs text-gray-500">{formData.metaDescription.length} characters</p>
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated) <span className="text-xs text-gray-500">(For SEO, 3-5 relevant tags)</span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., coloring, children, education"
            />
          </div>
          
          <div>
            <label htmlFor="featuredImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image URL <span className="text-xs text-gray-500">(Recommended size: 1200x630px)</span>
            </label>
            <input
              type="url"
              id="featuredImageUrl"
              name="featuredImageUrl"
              value={formData.featuredImageUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
            {formData.featuredImageUrl && (
              <div className="mt-2">
                <img 
                  src={formData.featuredImageUrl} 
                  alt="Featured image preview" 
                  className="h-40 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }} 
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
              Publish immediately
            </label>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 text-right rounded-b-lg">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Create Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
} 