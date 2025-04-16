'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ImageRecord } from '@/lib/supabase';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/i18n/context';

// Helper function to truncate prompt text
const truncatePrompt = (prompt: string, maxLength: number = 50): string => {
  if (!prompt) return '';
  return prompt.length > maxLength 
    ? `${prompt.substring(0, maxLength)}...` 
    : prompt;
};

export default function GalleryPage() {
  const { locale: lang } = useTranslation();
  
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTranslations, setLoadingTranslations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(16); // Increased limit for better grid display
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [style, setStyle] = useState<string | undefined>(undefined);
  const [translations, setTranslations] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1); // State for total pages

  // Fetch translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setLoadingTranslations(true);
      try {
        const fetchedTranslations = await getTranslations(lang);
        setTranslations(fetchedTranslations);
      } catch (err) {
        console.error("Failed to load translations:", err);
      } finally {
        setLoadingTranslations(false);
      }
    };
    if (lang) {
      loadTranslations();
    }
  }, [lang]);

  // Fetch images when page, filters, or language changes
  useEffect(() => {
    if (loadingTranslations || !lang) return;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (category) params.append('category', category);
        if (style) params.append('style', style);
        
        const response = await fetch(`/api/gallery?${params.toString()}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch gallery images: ${response.status} - ${errorText || 'Unknown error'}`);
        }
        
        const data = await response.json();
        setImages(data.images || []);
        setTotalPages(data.totalPages || 1); // Set total pages from API response
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
        setImages([]); // Clear images on error
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page, limit, category, style, lang, loadingTranslations]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleFilterChange = (filterType: 'category' | 'style', value: string | undefined) => {
    if (filterType === 'category') {
      setCategory(value);
    } else {
      setStyle(value);
    }
    setPage(1);
  };

  const getLocalizedHref = useCallback((path: string): string => {
    return `/${lang}${path}`;
  }, [lang]);

  const t = useCallback((key: string, fallback?: string): string => {
    if (loadingTranslations || !translations) {
      return fallback || key.split('.').pop() || key;
    }
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  }, [translations, loadingTranslations]);

  // --- Enhanced Loading State --- 
  if (loadingTranslations || (loading && images.length === 0 && page === 1)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Placeholder */}
        <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="h-10 bg-white/20 rounded-lg w-3/4 mx-auto animate-pulse mb-4"></div>
            <div className="h-6 bg-white/20 rounded-lg w-1/2 mx-auto animate-pulse"></div>
          </div>
        </div>
        {/* Grid Placeholder */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-xl shadow-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // --- Enhanced Error State --- 
  if (!loading && error && images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 py-20 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('gallery.errors.title', "Unable to Load Gallery")}
          </h1>
          <p className="text-red-100">
            {t('gallery.errors.message', "We encountered an issue retrieving the coloring pages.")}
          </p>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100 max-w-lg mx-auto w-full -mt-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-gray-600 mb-6 px-4">
              {error} - {t('gallery.errors.tryAgain', 'Please try refreshing the page or create a new image.')}
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t('gallery.refreshButton', "Refresh Page")}
              </button>
              <Link 
                href={getLocalizedHref('/create')}
                className="px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t('gallery.createButton', "Create a Coloring Page")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Content Render --- 
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Enhanced Header */}
      <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 py-20 px-4 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute -top-12 right-1/4 w-80 h-80 rounded-full bg-white blur-3xl"></div>
           <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-purple-300 blur-3xl"></div>
         </div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
             {t('gallery.title', "Coloring Page Gallery")}
           </h1>
           <p className="text-xl text-purple-100 max-w-3xl mx-auto">
             {t('gallery.subtitle', "Browse, download, and print from our vast collection of AI-generated coloring pages.")}
           </p>
           <Link 
             href={getLocalizedHref('/create')}
             className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 shadow-md"
           >
             <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
             </svg>
             {t('gallery.createYourOwnButton', "Create Your Own")}
           </Link>
         </div>
       </div>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* --- Filters Section --- */}
        <section aria-labelledby="filters-heading" className="mb-10 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 id="filters-heading" className="sr-only">{t('gallery.filters.title', "Filters")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                {t('gallery.filters.category', "Category")}
              </label>
              <select 
                id="category-filter" 
                value={category || ''} 
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)} 
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm"
              >
                 <option value="">{t('gallery.filters.allCategories', "All Categories")}</option>
                 <option value="animals">{t('create.categories.animals', "Animals")}</option>
                 <option value="fantasy">{t('create.categories.fantasy', "Fantasy")}</option>
                 <option value="nature">{t('create.categories.nature', "Nature")}</option>
                 <option value="holidays">{t('create.categories.holidays', "Holidays")}</option>
                 <option value="characters">{t('create.categories.characters', "Characters")}</option>
                 {/* Add more categories as needed */}
              </select>
            </div>
            {/* Style Filter */}
            <div>
              <label htmlFor="style-filter" className="block text-sm font-medium text-gray-700 mb-1">
                {t('gallery.filters.style', "Style")}
              </label>
              <select 
                id="style-filter" 
                value={style || ''} 
                onChange={(e) => handleFilterChange('style', e.target.value || undefined)} 
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm"
              >
                 <option value="">{t('gallery.filters.allStyles', "All Styles")}</option>
                 <option value="cartoon">{t('create.styleOptions.cartoon', "Cartoon")}</option>
                 <option value="realistic">{t('create.styleOptions.realistic', "Realistic")}</option>
                 <option value="manga">{t('gallery.styles.manga', "Manga")}</option>
                 <option value="abstract">{t('gallery.styles.abstract', "Abstract")}</option>
                 {/* Add more styles as needed */}
              </select>
            </div>
            {/* Clear Filters Button */}
            {(category || style) && (
              <div className="md:text-right">
                <button 
                  onClick={() => { setCategory(undefined); setStyle(undefined); setPage(1); }}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  {t('gallery.filters.clear', "Clear Filters")}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* --- Image Grid --- */}
        {loading && images.length > 0 && (
          <div className="text-center py-8">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
             <p className="mt-2 text-sm text-gray-600">{t('gallery.loadingMore', "Loading more pages...")}</p>
           </div>
        )}
        
        {!loading && images.length === 0 && (page > 1 || category || style) && (
           <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
             <h2 className="text-xl font-bold text-gray-700 mb-2">
               {t('gallery.noResults.title', "No Matching Pages Found")}
             </h2>
             <p className="text-gray-600">
               {t('gallery.noResults.message', "Try adjusting your filters or create a new coloring page.")}
             </p>
           </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {images.map((image) => (
            <Link 
              key={image.id} 
              href={getLocalizedHref(`/gallery/${image.id}`)} 
              className="block group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
            >
              <div className="aspect-square relative">
                <Image
                  src={image.image_url || '/placeholder.png'} // Add a placeholder
                  alt={image.prompt || t('gallery.imageAltFallback', 'AI Generated Coloring Page')}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/placeholder.png'; }} // Handle broken images
                />
                {/* Optional: Add overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.084.24-.17.476-.26.705M2.458 12C3.732 16.057 7.523 19 12 19c4.478 0 8.268-2.943 9.542-7 .084-.24.17-.476.26-.705M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
              </div>
              {/* Optional: Add prompt below image */}
              <div className="p-3 text-center">
                <p className="text-xs text-gray-500 truncate" title={image.prompt || ''}>
                  {truncatePrompt(image.prompt || '', 40)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
            <div className="-mt-px w-0 flex-1 flex">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                {t('gallery.pagination.previous', "Previous")}
              </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Simple pagination - consider adding ellipsis for many pages
                if (totalPages <= 7 || 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= page - 1 && pageNum <= page + 1) ||
                    (page < 4 && pageNum <= 4) || 
                    (page > totalPages - 3 && pageNum >= totalPages - 3)) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium ${
                        page === pageNum
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span key={`ellipsis-${pageNum}`} className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <div className="-mt-px w-0 flex-1 flex justify-end">
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                {t('gallery.pagination.next', "Next")}
                <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}