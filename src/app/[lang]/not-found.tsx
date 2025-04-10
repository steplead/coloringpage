'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import TranslatedText from '@/components/TranslatedText';

export default function LangNotFound() {
  // Get the current language from URL params using client component
  const params = useParams();
  const lang = params?.lang as string || 'en';

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">
          <TranslatedText 
            translationKey="error.notFound.title" 
            fallback="Page Not Found" 
          />
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          <TranslatedText 
            translationKey="error.notFound.message" 
            fallback="Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist." 
          />
        </p>
        <div className="space-y-4">
          <p className="text-gray-600">
            <TranslatedText 
              translationKey="error.notFound.helpfulLinks" 
              fallback="Here are some helpful links instead:" 
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/${lang}`} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
            >
              <TranslatedText 
                translationKey="error.notFound.returnHome" 
                fallback="Return Home" 
              />
            </Link>
            <Link 
              href={`/${lang}/create`} 
              className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-2 px-6 rounded-md transition duration-300 border border-blue-200"
            >
              <TranslatedText 
                translationKey="error.notFound.createPage" 
                fallback="Create a Coloring Page" 
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 