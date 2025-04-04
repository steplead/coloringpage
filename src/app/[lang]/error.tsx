'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import TranslatedText from '@/components/TranslatedText';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const lang = params.lang as string || 'en';

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-50 p-6">
          <div className="flex items-center justify-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            <TranslatedText 
              translationKey="errors.appError.title" 
              fallback="Something went wrong" 
              lang={lang} 
            />
          </h1>
          
          <p className="text-gray-600 mb-6">
            <TranslatedText 
              translationKey="errors.appError.message" 
              fallback="We're sorry, but we encountered an error while processing your request." 
              lang={lang} 
            />
          </p>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <TranslatedText 
                translationKey="errors.tryAgain" 
                fallback="Try Again" 
                lang={lang}
              />
            </button>
            
            <Link
              href={`/${lang}`}
              className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <TranslatedText 
                translationKey="common.backToHome" 
                fallback="Return to Home" 
                lang={lang}
              />
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-left overflow-auto max-h-60">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Error details:</h3>
              <pre className="text-xs text-red-800 whitespace-pre-wrap">
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 