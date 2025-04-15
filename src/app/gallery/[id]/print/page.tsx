'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageRecord } from '@/lib/supabase';
import TranslatedText from '@/components/TranslatedText';
import Cookies from 'js-cookie';
import { ArrowLeftIcon, PrinterIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function PrintColoringPage({ params }: { params: { id: string } }) {
  const [image, setImage] = useState<ImageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchImage() {
      try {
        setLoading(true);
        console.log(`Fetching image details for print view, ID: ${params.id}`);
        
        // Fetch the image using the API instead of directly from supabase
        const response = await fetch(`/api/gallery/${params.id}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error ${response.status}:`, errorText);
          
          if (response.status === 404) {
            console.log('Image not found, redirecting to gallery');
            router.push('/gallery');
            return;
          }
          throw new Error(`Failed to fetch image details: ${response.status} - ${errorText || 'No error details'}`);
        }
        
        const data = await response.json();
        console.log('Received image data for printing:', data);
        
        if (!data.image) {
          throw new Error('Invalid API response: missing image data');
        }
        
        setImage(data.image);
        setError(null);
        
        // Auto-trigger print dialog after a short delay to allow image to load
        setTimeout(() => {
          window.focus();
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching image for print:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image details');
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">
            <TranslatedText path="print.loading" fallback="Loading coloring page..." />
          </p>
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
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            <TranslatedText path="print.errorTitle" fallback="Failed to load coloring page" />
          </h1>
          <p className="text-gray-600 mb-6">
            {error || <TranslatedText path="print.errorMessage" fallback="The coloring page you requested could not be found." />}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <TranslatedText path="nav.gallery" fallback="Browse Gallery" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <TranslatedText path="nav.home" fallback="Home" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Print Controls - only visible on screen, not in print */}
      <div className="print:hidden bg-blue-600 text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold truncate max-w-xs sm:max-w-md">
              {image.title || image.prompt.substring(0, 50)}
            </h1>
            <p className="text-sm text-blue-100">
              <TranslatedText path="print.readyToPrint" fallback="Ready to print. Use your browser's print function or click the button below." />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/gallery/${image.id}`}
              className="inline-flex items-center px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              <TranslatedText path="print.backToView" fallback="Back to View" />
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
            >
              <PrinterIcon className="h-4 w-4 mr-1" />
              <TranslatedText path="print.printButton" fallback="Print Page" />
            </button>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 print:p-0 print:max-w-none">
        {/* Title - only shows in print */}
        <div className="hidden print:block text-center mb-4">
          <h1 className="text-2xl font-bold text-black">{image.title || image.prompt.substring(0, 50)}</h1>
          <p className="text-sm text-gray-600">AI-generated coloring page from AI-ColoringPage.com</p>
        </div>
        
        {/* The actual printable image */}
        <div className="relative aspect-square w-full mb-4 print:mb-1 border border-gray-200 rounded-lg print:border-0 print:rounded-none bg-white shadow-md print:shadow-none">
          <Image
            src={image.image_url}
            alt={image.title || image.prompt}
            fill
            className="object-contain p-2"
            sizes="100vw"
            priority
            unoptimized={true}
            onError={(e) => {
              console.error('Error loading image:', image.image_url);
              if (e.target instanceof HTMLImageElement) {
                e.target.onerror = null; // Prevent infinite fallback loop
                e.target.src = '/placeholder-image.svg'; // Fallback to a placeholder image
              }
            }}
          />
        </div>
        
        {/* Print footer - only shows in print */}
        <div className="hidden print:block text-center mt-6 text-sm text-gray-500">
          <p>{new Date(image.created_at).toLocaleDateString()} | {image.category ? `Category: ${image.category}` : ''} | {image.style ? `Style: ${image.style}` : 'Standard'}</p>
          <p className="mt-1">&quot;{image.prompt}&quot;</p>
          <p className="mt-4">Find more coloring pages at AI-ColoringPage.com</p>
        </div>
        
        {/* Screen-only instructions */}
        <div className="print:hidden mt-10 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 py-3 px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-blue-500" />
              <TranslatedText path="print.instructionsTitle" fallback="Printing Instructions" />
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                <TranslatedText path="print.stepsTitle" fallback="Follow these steps for best results:" />
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                <li>
                  <TranslatedText 
                    path="print.step1" 
                    fallback="Click the 'Print Page' button above or use your browser's print function (usually Ctrl+P or Cmd+P)" 
                  />
                </li>
                <li>
                  <TranslatedText 
                    path="print.step2" 
                    fallback="In the print dialog that appears, make sure 'Fit to Page' is selected" 
                  />
                </li>
                <li>
                  <TranslatedText 
                    path="print.step3" 
                    fallback="For better results, disable headers and footers in your browser's print settings" 
                  />
                </li>
                <li>
                  <TranslatedText 
                    path="print.step4" 
                    fallback="Select 'Print Background Graphics' if that option is available" 
                  />
                </li>
              </ol>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    <TranslatedText path="print.paperTipsTitle" fallback="Paper Tips" />
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    <TranslatedText 
                      path="print.paperTips" 
                      fallback="For coloring, standard printer paper works well. For markers or watercolors, consider thicker paper (card stock or drawing paper)." 
                    />
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    <TranslatedText path="print.troubleshootingTitle" fallback="Having Trouble?" />
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    <TranslatedText 
                      path="print.troubleshooting" 
                      fallback="If the image appears cut off, try landscape orientation. If colors appear in preview, try printing in black & white mode." 
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              <TranslatedText path="print.morePages" fallback="Want more coloring pages?" />
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/create"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <TranslatedText path="gallery.createYourOwn" fallback="Create Your Own" />
              </Link>
              <Link
                href="/gallery"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <TranslatedText path="nav.gallery" fallback="Browse Gallery" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 