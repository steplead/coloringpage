'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-lg text-gray-600 mb-8">
          We're sorry, but something went wrong. Please try again or return home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Try Again
          </button>
          <Link 
            href="/" 
            className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-2 px-6 rounded-md transition duration-300 border border-blue-200"
          >
            Return Home
          </Link>
        </div>
        <div className="bg-gray-50 p-4 rounded-md text-left">
          <p className="text-sm text-gray-500 mb-2">Error details:</p>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded overflow-auto">
            {error.message || 'Unknown error'}
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 