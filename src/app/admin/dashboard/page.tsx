'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
          totalBlogPosts: '3',
          totalImages: '5',
        });
      }
    };
    
    fetchStats();
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
        body: JSON.stringify({ count: 1, targetLength: 800 }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`Successfully generated ${data.generated} blog posts!`);
        // Update stats after generation
        const newTotal = parseInt(stats.totalBlogPosts as string) + data.generated;
        setStats({
          ...stats,
          totalBlogPosts: String(newTotal),
        });
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
          description="Automatically generate a new blog post about coloring pages using AI."
          buttonText={isLoading ? 'Generating...' : 'Generate Post'}
          onClick={handleGenerateBlogPosts}
        />
        <ActionCard
          title="Manage Blog Posts"
          description="View, edit, or delete existing blog posts in the blog management interface."
          buttonText="Manage Posts"
          onClick={() => window.location.href = '/admin/blog'}
        />
        <ActionCard
          title="View Website"
          description="Go to the public-facing website to see your changes."
          buttonText="View Site"
          onClick={() => window.location.href = '/'}
        />
      </div>
    </div>
  );
} 