import React, { ReactNode } from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Layout wrapper for admin pages with navigation and authentication
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link href="/admin" className="block py-3 px-4 hover:bg-blue-700 transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/blog" className="block py-3 px-4 hover:bg-blue-700 transition">
                Blog Posts
              </Link>
            </li>
            <li>
              <Link href="/admin/blog/new" className="block py-3 px-4 hover:bg-blue-700 transition bg-blue-700">
                Create New Post
              </Link>
            </li>
            <li>
              <Link href="/admin/blog/auto" className="block py-3 px-4 hover:bg-blue-700 transition">
                Auto-Generation Settings
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="block py-3 px-4 hover:bg-blue-700 transition">
                SEO Analytics
              </Link>
            </li>
            <li className="mt-8 border-t border-blue-700 pt-4">
              <Link href="/" className="block py-3 px-4 hover:bg-blue-700 transition">
                Back to Website
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Content Management</h2>
            <div>
              <button className="text-gray-600 hover:text-gray-800 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="inline-flex items-center">
                <span className="text-gray-700 mr-2">Admin</span>
                <img
                  src="/images/avatar-placeholder.jpg"
                  alt="Admin"
                  className="h-8 w-8 rounded-full"
                />
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 