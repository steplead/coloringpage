import React from 'react';
import AdminLayout from '../../AdminLayout';

/**
 * Admin page for creating new SEO-optimized blog posts
 * This interface allows for customizing the post generation parameters
 */
export default function NewBlogPostPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Blog Post Generator</h2>
          <p className="text-gray-600 mb-6">
            Generate SEO-optimized blog posts using our template. All posts will include proper schema markup,
            heading structure, and keyword optimization.
          </p>
          
          {/* Blog Post Generator Form */}
          <form id="blogPostForm" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Post Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                    Post Title (50-60 characters)
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Mindfulness Coloring Pages: Reduce Stress and Boost Creativity"
                    required
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    <span id="titleCharCount">0</span>/60 characters
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="metaDescription">
                    Meta Description (120-155 characters)
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    rows={3}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief, compelling description with primary keyword and clear value proposition"
                    required
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    <span id="metaDescriptionCharCount">0</span>/155 characters
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="primaryKeyword">
                    Primary Keyword
                  </label>
                  <input
                    type="text"
                    id="primaryKeyword"
                    name="primaryKeyword"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., mindfulness coloring pages"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="secondaryKeywords">
                    Secondary Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    id="secondaryKeywords"
                    name="secondaryKeywords"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., stress relief, creativity, coloring techniques"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Coloring Techniques">Coloring Techniques</option>
                    <option value="Educational Content">Educational Content</option>
                    <option value="Art Therapy">Art Therapy</option>
                    <option value="Kids Activities">Kids Activities</option>
                    <option value="Adult Coloring">Adult Coloring</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tags">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., mindfulness, coloring pages, stress relief"
                  />
                </div>
              </div>
              
              {/* Additional Options */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contentLength">
                    Content Length
                  </label>
                  <select
                    id="contentLength"
                    name="contentLength"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard (1,500+ words)</option>
                    <option value="long">Long Form (2,500+ words)</option>
                    <option value="short">Concise (800+ words)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="targetAudience">
                    Target Audience
                  </label>
                  <select
                    id="targetAudience"
                    name="targetAudience"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="parents">Parents</option>
                    <option value="teachers">Teachers</option>
                    <option value="adults">Adult Colorists</option>
                    <option value="children">Children</option>
                    <option value="general">General Audience</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="authorName">
                    Author Name
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., AI Coloring Page Team"
                    defaultValue="AI Coloring Page Team"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Features
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="includeFAQ"
                        name="includeFAQ"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="includeFAQ" className="ml-2 text-sm text-gray-700">
                        Include FAQ Schema (improves search visibility)
                      </label>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="includeTableOfContents"
                        name="includeTableOfContents"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="includeTableOfContents" className="ml-2 text-sm text-gray-700">
                        Include Table of Contents (improves user experience)
                      </label>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="includeImages"
                        name="includeImages"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="includeImages" className="ml-2 text-sm text-gray-700">
                        Include Optimized Images with Alt Text
                      </label>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="includeRelatedPosts"
                        name="includeRelatedPosts"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="includeRelatedPosts" className="ml-2 text-sm text-gray-700">
                        Include Related Posts Section
                      </label>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="publishNow"
                        name="publishNow"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="publishNow" className="ml-2 text-sm text-gray-700">
                        Publish Immediately (otherwise saved as draft)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="publishDate">
                    Schedule Publish Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    id="publishDate"
                    name="publishDate"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="previewButton"
              >
                Preview Post
              </button>
              <div>
                <button
                  type="button"
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="saveAsDraftButton"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate & Publish
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* SEO Best Practices Reminder */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">SEO Best Practices Reminder</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
            <li>Title should include primary keyword near the beginning</li>
            <li>Meta description should be compelling and include primary keyword</li>
            <li>Use proper heading hierarchy (H1 → H2 → H3) with keywords</li>
            <li>Include primary keyword in first paragraph</li>
            <li>Add 2-3 relevant images with keyword-rich alt text</li>
            <li>Create comprehensive content (1,500+ words) with short paragraphs</li>
            <li>Include internal links to other relevant blog posts and pages</li>
            <li>Add a clear call-to-action directing users to create coloring pages</li>
          </ul>
        </div>
        
        {/* Generated Post Preview */}
        <div id="postPreview" className="mt-8 hidden">
          <h2 className="text-xl font-semibold mb-4">Post Preview</h2>
          <div className="bg-white shadow-md rounded-lg p-6 border">
            <div id="previewContent">
              {/* Preview content will be inserted here via JavaScript */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Client-side JavaScript for form interactions */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Add client-side functionality once the page loads
            document.addEventListener('DOMContentLoaded', function() {
              // Character counter for title
              const titleInput = document.getElementById('title');
              const titleCharCount = document.getElementById('titleCharCount');
              
              titleInput.addEventListener('input', function() {
                titleCharCount.textContent = titleInput.value.length;
                if (titleInput.value.length > 60) {
                  titleCharCount.classList.add('text-red-500');
                } else {
                  titleCharCount.classList.remove('text-red-500');
                }
              });
              
              // Character counter for meta description
              const metaDescInput = document.getElementById('metaDescription');
              const metaDescCharCount = document.getElementById('metaDescriptionCharCount');
              
              metaDescInput.addEventListener('input', function() {
                metaDescCharCount.textContent = metaDescInput.value.length;
                if (metaDescInput.value.length > 155) {
                  metaDescCharCount.classList.add('text-red-500');
                } else {
                  metaDescCharCount.classList.remove('text-red-500');
                }
              });
              
              // Form submission
              const form = document.getElementById('blogPostForm');
              form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Generating...';
                submitBtn.disabled = true;
                
                // In a real implementation, this would:
                // 1. Collect form data
                // 2. Submit to API endpoint
                // 3. Redirect to the published post or show preview
                
                try {
                  // Simulate API call delay
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  
                  // Success message
                  alert('Post generated and published successfully!');
                  
                  // Reset form or redirect
                  // window.location.href = '/admin/blog';
                } catch (error) {
                  console.error('Error generating post:', error);
                  alert('Failed to generate post. Please try again.');
                } finally {
                  // Restore button state
                  submitBtn.textContent = originalBtnText;
                  submitBtn.disabled = false;
                }
              });
              
              // Preview button functionality
              const previewBtn = document.getElementById('previewButton');
              const previewSection = document.getElementById('postPreview');
              const previewContent = document.getElementById('previewContent');
              
              previewBtn.addEventListener('click', function() {
                // In a real implementation, this would generate a preview based on form data
                
                // For demonstration, just show a sample preview
                previewSection.classList.remove('hidden');
                previewContent.innerHTML = '<div class="text-sm text-gray-500 p-4 text-center">Preview would be generated here based on form inputs</div>';
                
                // Scroll to preview
                previewSection.scrollIntoView({ behavior: 'smooth' });
              });
            });
          `
        }}
      />
    </AdminLayout>
  );
} 