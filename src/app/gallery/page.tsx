'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ImageRecord } from '@/lib/supabase';
import { PageHeader } from '@/components/PageHeader';
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
  // Use the hook to get the current language locale
  const { locale: lang } = useTranslation(); 
  
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTranslations, setLoadingTranslations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12); 
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [style, setStyle] = useState<string | undefined>(undefined);
  const [translations, setTranslations] = useState<any>(null);

  // Fetch translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setLoadingTranslations(true);
      try {
        const fetchedTranslations = await getTranslations(lang);
        setTranslations(fetchedTranslations);
      } catch (err) {
        console.error("Failed to load translations:", err);
        // Handle translation loading error if needed
      } finally {
        setLoadingTranslations(false);
      }
    };
    if (lang) { // Ensure lang is available
      loadTranslations();
    }
  }, [lang]);

  // Fetch images when page, filters, or language changes
  useEffect(() => {
    // Don't fetch images until translations are loaded and lang is set
    if (loadingTranslations || !lang) return; 

    const fetchImages = async () => {
      setLoading(true); // Set loading true when fetching images
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
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page, limit, category, style, lang, loadingTranslations]); // Add lang and loadingTranslations dependency

  // ---- Define handlers inside the component ----
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleFilterChange = (filterType: 'category' | 'style', value: string | undefined) => {
    if (filterType === 'category') {
      setCategory(value);
    } else {
      setStyle(value);
    }
    setPage(1); // Reset to page 1 when filters change
  };
  // ----------------------------------------------

  // Helper function to get localized href
  const getLocalizedHref = useCallback((path: string): string => {
    return `/${lang}${path}`;
  }, [lang]);

  // Safe translation helper using fetched translations
  const t = useCallback((key: string, fallback?: string): string => {
    if (loadingTranslations || !translations) {
      // Return fallback immediately if translations aren't ready
      return fallback || key.split('.').pop() || key;
    }
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  }, [translations, loadingTranslations]);

  // Initial Loading state (before translations load)
  if (loadingTranslations) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Coloring Page Gallery</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading translations...</p> 
        </div>
      </div>
    );
  }

  // Error state (only show if loading is finished and error exists)
  if (!loading && error && images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
         <PageHeader
           title={<h1>{t('gallery.title', "Coloring Page Gallery")}</h1>} // Ensure H1
           description={t('gallery.subtitle', "Browse our collection of AI-generated coloring pages.")}
         />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              {t('gallery.errors.title', "Unable to Load Gallery")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('gallery.errors.message', "We encountered an issue retrieving the coloring pages. Please try refreshing.")}
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('gallery.refreshButton', "Refresh Page")}
              </button>
              <Link 
                href={getLocalizedHref('/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('gallery.createButton', "Create a Coloring Page")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main content render
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={<h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">{t('gallery.title', "Coloring Page Gallery")}</h1>}
        description={t('gallery.subtitle', "Browse our collection of AI-generated coloring pages. Click to view, print, or download.")}
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Introduction & Create Button */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-8">
           <div className="flex">
             <div className="flex-shrink-0">
               <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
             </div>
             <div className="ml-3">
               <p className="text-sm text-blue-800">
                 {t('gallery.introText', "Browse our collection of AI-generated coloring pages. Click on any image to view, print or download.")}
               </p>
             </div>
           </div>
         </div>
         <div className="mb-8 text-center">
           <Link 
             href={getLocalizedHref('/create')}
             className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md"
           >
             <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
             {t('gallery.createYourOwnButton', "Create Your Own Coloring Page")}
           </Link>
           <p className="mt-2 text-sm text-gray-500">
             {t('gallery.createPrompt', "Don't see what you're looking for? Create your own personalized coloring page!")}
           </p>
         </div>

        {/* Filters Section - Use H2 */}
        <section aria-labelledby="filters-heading" className="mb-8 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 id="filters-heading" className="text-xl font-semibold text-gray-900 mb-4">
            {t('gallery.filters.title', "Find the Perfect Coloring Page")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                {t('gallery.filters.category', "Category:")}
              </label>
              <select id="category-filter" value={category || ''} onChange={(e) => handleFilterChange('category', e.target.value || undefined)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                 <option value="">{t('gallery.filters.allCategories', "All Categories")}</option>
                 <option value="animals">{t('create.categories.animals', "Animals")}</option>
                 <option value="fantasy">{t('create.categories.fantasy', "Fantasy")}</option>
                 <option value="nature">{t('create.categories.nature', "Nature")}</option>
                 <option value="holidays">{t('create.categories.holidays', "Holidays")}</option>
                 <option value="characters">{t('create.categories.characters', "Characters")}</option>
              </select>
            </div>
            {/* Style Filter */}
            <div>
              <label htmlFor="style-filter" className="block text-sm font-medium text-gray-700 mb-1">
                {t('gallery.filters.style', "Style:")}
              </label>
              <select id="style-filter" value={style || ''} onChange={(e) => handleFilterChange('style', e.target.value || undefined)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                 <option value="">{t('gallery.filters.allStyles', "All Styles")}</option>
                 <option value="cartoon">{t('create.styleOptions.cartoon', "Cartoon")}</option>
                 <option value="realistic">{t('create.styleOptions.realistic', "Realistic")}</option>
                 <option value="manga">{t('gallery.styles.manga', "Manga")}</option>
                 <option value="abstract">{t('gallery.styles.abstract', "Abstract")}</option>
              </select>
            </div>
          </div>
          {/* Active Filters Display */}
          {(category || style) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                 {t('gallery.filters.activeFilters', "Active filters:")}
                 {category && (
                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                     {t(`create.categories.${category}`, category)}
                   </span>
                 )}
                 {style && (
                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                     {t(`create.styleOptions.${style}`, style)}
                   </span>
                 )}
              </div>
              <button onClick={() => { handleFilterChange('category', undefined); handleFilterChange('style', undefined); }} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                {t('gallery.filters.clearFilters', "Clear Filters")}
                <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>
          )}
        </section>

        {/* Image Grid Section - Use section for semantics */} 
        <section aria-labelledby="image-grid-heading">
            {/* Conditional heading for filtered results */}
            {(category || style) && !loading && images.length > 0 && (
              <h2 id="image-grid-heading" className="text-2xl font-semibold text-gray-800 mb-6">
                  {t('gallery.filteredResultsTitle', 'Filtered Coloring Pages')} 
                  ({t('gallery.resultsCount', `${images.length} results`)})
              </h2>
            )}
             {/* Screen reader heading for the main grid */} 
            <h2 id="image-grid-heading" className="sr-only">
              {t('gallery.gridHeading.sr', 'Coloring Page Results Grid')}
            </h2>
            
            {/* Loading state specific to image grid */}
            {loading && (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">{t('common.loading', "Loading images...")}</p>
              </div>
            )}
            
            {/* Grid display */} 
            {!loading && images.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {images.map((image) => {
                    // Prepare alt text: Use title if available, otherwise generate from prompt
                    const altText = image.title 
                      ? t('gallery.imageAltWithTitle', `Coloring page of ${image.title}`) 
                      : t('gallery.imageAltWithPrompt', `Coloring page based on prompt: ${truncatePrompt(image.prompt || '')}`);
                    
                    return (
                      <div key={image.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                        <Link href={getLocalizedHref(`/gallery/${image.id}`)} className="block aspect-square w-full overflow-hidden">
                          <Image
                            src={image.image_url} // Use Supabase URL
                            alt={altText} // Use generated descriptive alt text
                            width={500} // Adjust based on grid size
                            height={500}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            loading="lazy" // Lazy load grid images
                            unoptimized={true} // Consider removing if image optimization is set up
                          />
                        </Link>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <h3 className="text-sm font-medium text-white truncate">
                             {image.title || truncatePrompt(image.prompt || '', 30)} 
                           </h3>
                        </div>
                        {/* Add a subtle link overlay for better accessibility */}
                        <Link href={getLocalizedHref(`/gallery/${image.id}`)} className="absolute inset-0" aria-label={`View details for ${altText}`}></Link>
                      </div>
                    );
                  })}
                </div>
                {/* Pagination Controls */} 
                 <div className="mt-12 flex justify-center items-center space-x-4">
                   <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                     {t('common.previous', 'Previous')}
                   </button>
                   <span className="text-sm text-gray-700">
                     {t('common.page', 'Page')} {page}
                   </span>
                   <button onClick={() => handlePageChange(page + 1)} disabled={images.length < limit} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                     {t('common.next', 'Next')}
                   </button>
                 </div>
              </>
            )}
            
            {/* No results state */}
            {!loading && images.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h2 className="text-xl font-bold text-gray-700 mb-2">
                  {t('gallery.noResults.title', "No Coloring Pages Found")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t('gallery.noResults.message', "Try adjusting your filters or create your own amazing coloring page!")}
                </p>
                <Link href={getLocalizedHref('/create')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {t('gallery.createButton', "Create a Coloring Page")}
                </Link>
              </div>
            )}
        </section>

      </div>
    </div>
  );
}