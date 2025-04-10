import React from 'react';
import AdminLayout from '../../AdminLayout';

/**
 * Admin page for regenerating existing blog posts with our SEO template
 * This allows updating old posts to the new format
 */
export default function RegenerateBlogPostsPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Regenerate Blog Posts</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">SEO Template Regeneration</h2>
          <p className="text-gray-600 mb-6">
            Update existing blog posts to use our new SEO-optimized template format.
            This will improve search visibility and reader engagement while preserving the original content.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">
              This process will restructure your blog posts with proper heading hierarchy, 
              schema markup, and SEO best practices. The core content will be preserved, but
              new sections may be added for better structure.
            </p>
          </div>
          
          {/* Blog Post List for Regeneration */}
          <div id="postList" className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" id="postsTableBody">
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading blog posts...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              id="regenerateAllBtn"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Regenerate All Posts
            </button>
          </div>
        </div>
        
        {/* Regeneration Results */}
        <div id="resultsSection" className="bg-white shadow-md rounded-lg p-6 hidden">
          <h2 className="text-xl font-semibold mb-4">Regeneration Results</h2>
          <div id="resultsContent" className="border p-4 rounded max-h-96 overflow-y-auto">
            {/* Results will be populated here via JavaScript */}
          </div>
        </div>
      </div>
      
      {/* Client-side JavaScript */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Add client-side functionality once the page loads
            document.addEventListener('DOMContentLoaded', function() {
              // Fetch blog posts
              fetchBlogPosts();
              
              // Set up event handlers
              document.getElementById('regenerateAllBtn').addEventListener('click', regenerateAllPosts);
              
              // Add row event handlers for individual post regeneration
              document.addEventListener('click', function(e) {
                if (e.target && e.target.classList.contains('regenerate-post-btn')) {
                  const slug = e.target.getAttribute('data-slug');
                  regeneratePost(slug);
                }
              });
            });
            
            // Fetch all blog posts
            async function fetchBlogPosts() {
              try {
                const tableBody = document.getElementById('postsTableBody');
                tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">Loading blog posts...</td></tr>';
                
                // In a real implementation, this would fetch from the API
                // For demo, we'll simulate some blog posts
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const mockPosts = [
                  { 
                    id: 1, 
                    title: 'Mandala Coloring Pages - Fun & Educational Activities',
                    slug: 'mandala-coloring-pages-fun-educational-activities',
                    created_at: '2023-04-10T12:00:00Z',
                    format: 'Legacy'
                  },
                  { 
                    id: 2, 
                    title: 'Animal Coloring Pages for Kids',
                    slug: 'animal-coloring-pages-for-kids',
                    created_at: '2023-05-15T14:30:00Z',
                    format: 'Legacy'
                  },
                  { 
                    id: 3, 
                    title: 'Holiday Coloring Pages - Christmas Edition',
                    slug: 'holiday-coloring-pages-christmas-edition',
                    created_at: '2023-12-01T09:15:00Z',
                    format: 'SEO Template'
                  }
                ];
                
                // Render posts
                if (mockPosts.length > 0) {
                  tableBody.innerHTML = '';
                  mockPosts.forEach(post => {
                    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                    
                    const formatBadge = post.format === 'SEO Template' 
                      ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">SEO Template</span>'
                      : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Legacy</span>';
                    
                    tableBody.innerHTML += \`
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          \${post.title}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          \${formattedDate}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          \${formatBadge}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            class="regenerate-post-btn text-indigo-600 hover:text-indigo-900 \${post.format === 'SEO Template' ? 'opacity-50 cursor-not-allowed' : ''}"
                            data-slug="\${post.slug}"
                            \${post.format === 'SEO Template' ? 'disabled' : ''}
                          >
                            \${post.format === 'SEO Template' ? 'Already Optimized' : 'Regenerate'}
                          </button>
                        </td>
                      </tr>
                    \`;
                  });
                } else {
                  tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No blog posts found</td></tr>';
                }
              } catch (error) {
                console.error('Error fetching blog posts:', error);
                const tableBody = document.getElementById('postsTableBody');
                tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">Error loading blog posts</td></tr>';
              }
            }
            
            // Regenerate a single post
            async function regeneratePost(slug) {
              try {
                showResults();
                addResultMessage(\`Regenerating post: \${slug}...\`);
                
                // In a real implementation, this would call the API
                // For demo, we'll simulate an API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate success
                addResultMessage(\`✅ Successfully regenerated: \${slug}\`);
                
                // Refresh the list
                setTimeout(fetchBlogPosts, 1000);
              } catch (error) {
                console.error('Error regenerating post:', error);
                addResultMessage(\`❌ Error regenerating \${slug}: \${error.message}\`);
              }
            }
            
            // Regenerate all posts
            async function regenerateAllPosts() {
              try {
                showResults();
                addResultMessage('Starting regeneration of all legacy posts...');
                
                // Get all buttons for legacy posts
                const buttons = document.querySelectorAll('.regenerate-post-btn:not([disabled])');
                
                if (buttons.length === 0) {
                  addResultMessage('No legacy posts to regenerate.');
                  return;
                }
                
                // Process each post sequentially
                for (const button of buttons) {
                  const slug = button.getAttribute('data-slug');
                  await regeneratePost(slug);
                }
                
                addResultMessage('✅ All posts have been regenerated successfully!');
              } catch (error) {
                console.error('Error regenerating all posts:', error);
                addResultMessage(\`❌ Error during bulk regeneration: \${error.message}\`);
              }
            }
            
            // Show results section
            function showResults() {
              const resultsSection = document.getElementById('resultsSection');
              resultsSection.classList.remove('hidden');
              const resultsContent = document.getElementById('resultsContent');
              resultsContent.innerHTML = '';
            }
            
            // Add a message to the results
            function addResultMessage(message) {
              const resultsContent = document.getElementById('resultsContent');
              const messageEl = document.createElement('div');
              messageEl.className = 'py-2 border-b border-gray-200';
              messageEl.innerHTML = message;
              resultsContent.appendChild(messageEl);
              // Scroll to bottom
              resultsContent.scrollTop = resultsContent.scrollHeight;
            }
          `
        }}
      />
    </AdminLayout>
  );
} 