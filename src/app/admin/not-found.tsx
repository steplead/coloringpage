import React from 'react';
import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-8">
          <span className="text-6xl md:text-8xl text-gray-300">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Admin Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The admin interface might still be deploying. Please try refreshing in a few minutes.
        </p>
        <p className="text-gray-600 mb-8">
          If this error persists, try accessing the specific admin pages directly:
        </p>
        <ul className="mb-8 text-blue-600 flex flex-col space-y-2">
          <li>
            <Link href="/admin/dashboard" className="hover:underline">
              Admin Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/blog" className="hover:underline">
              Blog Management
            </Link>
          </li>
        </ul>
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 