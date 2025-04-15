'use client';

import React, { useEffect, useState } from 'react';

// Dashboard statistics component
function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
          <span className="text-blue-600 text-xl">{icon}</span>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Quick action card component
function ActionCard({ title, description, buttonText, onClick }: { 
  title: string; 
  description: string; 
  buttonText: string; 
  onClick: () => void;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <button
        onClick={onClick}
        className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBlogPosts: '...',
    totalImages: '...',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Auto-generation settings
  const [autoPostCount, setAutoPostCount] = useState(1);
  const [autoPostLength, setAutoPostLength] = useState(800);
  const [autoBlogEnabled, setAutoBlogEnabled] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch blog post count
        const blogResponse = await fetch('/api/admin/stats/blog');
        const blogData = await blogResponse.json();
        
        // Fetch images count
        const imagesResponse = await fetch('/api/admin/stats/images');
        const imagesData = await imagesResponse.json();
        
        setStats({
          totalBlogPosts: String(blogData.count || 0),
          totalImages: String(imagesData.count || 0),
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set fallback data if API isn't implemented yet
        setStats({
          totalBlogPosts: 'N/A',
          totalImages: 'N/A',
        });
      }
    };
    
    // Fetch current auto-generation settings
    const fetchSettings = async () => {
      try {
        // Try localStorage first
        const localSettings = localStorage.getItem('blog_settings');
        if (localSettings) {
          const parsed = JSON.parse(localSettings);
          setAutoPostCount(parsed.postCount || 1);
          setAutoPostLength(parsed.postLength || 800);
          setAutoBlogEnabled(parsed.autoBlogEnabled !== undefined ? parsed.autoBlogEnabled : true);
        }
        
        // Then try API
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        
        if (response.ok && data.settings) {
          const serverSettings = data.settings;
          setAutoPostCount(serverSettings.postCount || 1);
          setAutoPostLength(serverSettings.postLength || 800);
          setAutoBlogEnabled(serverSettings.autoBlogEnabled !== undefined ? serverSettings.autoBlogEnabled : true);
          
          // Update localStorage
          localStorage.setItem('blog_settings', JSON.stringify(serverSettings));
        } else if (!localSettings) {
           // If API fails and no localStorage, use defaults
           setAutoBlogEnabled(true); // Default to enabled
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Keep defaults or localStorage values if API fails
        if (!localStorage.getItem('blog_settings')) {
           setAutoBlogEnabled(true); // Default to enabled if everything fails
        }
      }
    };
    
    fetchStats();
    fetchSettings();
  }, []);

  // Generate blog posts
  const handleGenerateBlogPosts = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/blog/auto-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 1, targetLength: 2000 }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`Successfully generated ${data.generated} blog posts! Failed: ${data.failed}. Check logs for details.`);
        // Update stats after generation
        const blogResponse = await fetch('/api/admin/stats/blog');
        const blogData = await blogResponse.json();
        setStats(prev => ({
          ...prev,
          totalBlogPosts: String(blogData.count || parseInt(prev.totalBlogPosts as string) + data.generated),
        }));
      } else {
        setMessage(`Failed to generate blog posts. ${data.error || ''}`);
      }
    } catch (error) {
      console.error('Error generating blog posts:', error);
      setMessage('Error generating blog posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save auto-generation settings
  const saveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsMessage('');
    
    try {
      const settings = {
        postCount: autoPostCount,
        postLength: autoPostLength,
        autoBlogEnabled: autoBlogEnabled
      };
      // Save to localStorage first
      localStorage.setItem('blog_settings', JSON.stringify(settings));
      
      // Save to API
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSettingsMessage('Settings saved successfully!');
      } else {
        setSettingsMessage('Settings saved locally. Server sync failed: ' + (data.error || response.statusText));
      }
    } catch (error: unknown) {
      console.error('Error saving settings:', error);
      setSettingsMessage('Settings saved locally. Could not connect to server: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSavingSettings(false);
      // Optionally clear the message after a few seconds
      setTimeout(() => setSettingsMessage(''), 5000);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Blog Posts" value={stats.totalBlogPosts} icon="📝" />
        <StatCard title="Total Coloring Pages" value={stats.totalImages} icon="🖼️" />
      </div>

      <h3 className="mt-10 text-lg font-medium leading-6 text-gray-900 mb-5">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          title="Generate Blog Post"
          description="Manually generate a single blog post using the auto-generation logic."
          buttonText={isLoading ? 'Generating...' : 'Generate Post'}
          onClick={handleGenerateBlogPosts}
        />
        <ActionCard
          title="Manage Blog Posts"
          description="View, edit, or delete existing blog posts."
          buttonText="Manage Posts"
          onClick={() => window.location.href = '/admin/blog'}
        />
        <ActionCard
          title="View Website"
          description="Go to the public-facing website."
          buttonText="View Site"
          onClick={() => window.location.href = '/'}
        />
      </div>
      
      {/* Auto-generation Settings */}
      <h3 className="mt-10 text-lg font-medium leading-6 text-gray-900 mb-5">Automatic Blog Generation Settings</h3>
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="p-6">
          {settingsMessage && (
            <div className={`mb-6 p-4 rounded-md ${settingsMessage.includes('Error') || settingsMessage.includes('Failed') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {settingsMessage}
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-6">
            Configure how many blog posts should be automatically generated each day via the scheduled job.
          </p>
          
          <div className="flex items-center mb-6">
            <input
              id="autoBlogEnabled"
              name="autoBlogEnabled"
              type="checkbox"
              checked={autoBlogEnabled}
              onChange={(e) => setAutoBlogEnabled(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoBlogEnabled" className="ml-2 block text-sm font-medium text-gray-700">
              Enable Automatic Daily Posting
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="postCount" className="block text-sm font-medium text-gray-700">
                Daily Post Count
              </label>
              <select
                id="postCount"
                name="postCount"
                value={autoPostCount}
                onChange={(e) => setAutoPostCount(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{`${n} post${n > 1 ? 's' : ''} per day`}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="postLength" className="block text-sm font-medium text-gray-700">
                Target Post Length (words)
              </label>
              <select
                id="postLength"
                name="postLength"
                value={autoPostLength}
                onChange={(e) => setAutoPostLength(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {[800, 1000, 1500, 2000].map(len => (
                  <option key={len} value={len}>{`~${len} words`}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={isSavingSettings}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 