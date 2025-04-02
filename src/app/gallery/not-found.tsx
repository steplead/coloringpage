import React from 'react';
import Link from 'next/link';

export default function GalleryNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-6xl md:text-8xl text-gray-300">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Coloring Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the coloring page you were looking for. It might have been removed or never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Gallery
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Page
          </Link>
        </div>
      </div>
    </div>
  );
} 