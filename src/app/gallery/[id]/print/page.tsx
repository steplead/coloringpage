'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase, ImageRecord } from '@/lib/supabase';

export default function PrintColoringPage({ params }: { params: { id: string } }) {
  const [image, setImage] = useState<ImageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .eq('id', params.id)
          .single();
          
        if (error) {
          console.error('Error fetching image:', error);
          setError('Failed to load image. Please try again later.');
        } else {
          setImage(data as ImageRecord);
        }
      } catch (err) {
        console.error('Exception fetching image:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading coloring page...</p>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Failed to load coloring page</h1>
          <p className="text-gray-600 mb-6">{error || 'The coloring page you requested could not be found.'}</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Gallery
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Print Controls - only visible on screen, not in print */}
      <div className="print:hidden bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{image.title || image.prompt.substring(0, 50)}</h1>
            <p className="text-sm text-blue-100">Ready to print. Use your browser's print function or click the button below.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/gallery/${image.id}`}
              className="px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
            >
              Back to View
            </Link>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
            >
              Print Page
            </button>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 print:p-0 print:max-w-none">
        {/* Title - only shows in print */}
        <div className="hidden print:block text-center mb-4">
          <h1 className="text-2xl font-bold text-black">{image.title || image.prompt.substring(0, 50)}</h1>
          <p className="text-sm text-gray-600">AI-generated coloring page from ColoringAI.com</p>
        </div>
        
        {/* The actual printable image */}
        <div className="relative aspect-square w-full mb-4 shadow-md print:shadow-none">
          <Image
            src={image.image_url}
            alt={image.title || image.prompt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
        
        {/* Print footer - only shows in print */}
        <div className="hidden print:block text-center mt-6 text-sm text-gray-500">
          <p>{new Date(image.created_at).toLocaleDateString()} | Style: {image.style || 'Standard'}</p>
          <p className="mt-1">Prompt: "{image.prompt}"</p>
          <p className="mt-4">Create your own coloring pages at ColoringAI.com</p>
        </div>
        
        {/* Screen-only instructions */}
        <div className="print:hidden mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Printing Instructions</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Click the "Print Page" button above or use your browser's print function (usually Ctrl+P or Cmd+P)</li>
            <li>For best results, select "Fit to Page" in your printer settings</li>
            <li>Disable headers and footers in your browser's print settings</li>
            <li>If available, select "Print Background Graphics" in your browser's print settings</li>
            <li>For coloring, any standard printer paper works well (8.5" x 11" or A4)</li>
          </ul>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-2">Want more coloring pages?</h3>
            <div className="flex gap-3">
              <Link
                href="/create"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Your Own
              </Link>
              <Link
                href="/gallery"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 