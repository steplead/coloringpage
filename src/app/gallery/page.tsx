'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ImageRecord } from '@/lib/supabase';
import TranslatedText from '@/components/TranslatedText';
import Cookies from 'js-cookie';

// Helper function to truncate prompt text
const truncatePrompt = (prompt: string, maxLength: number = 50): string => {
  if (!prompt) return '';
  return prompt.length > maxLength 
    ? `${prompt.substring(0, maxLength)}...` 
    : prompt;
};

export default function GalleryPage({ params }: { params?: { lang?: string } }) {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [style, setStyle] = useState<string | undefined>(undefined);
  const [currentLang, setCurrentLang] = useState(params?.lang || 'en');
  
  // Get language from cookie on client side if not provided via params
  useEffect(() => {
    if (!params?.lang) {
      const lang = Cookies.get('NEXT_LOCALE') || 'en';
      setCurrentLang(lang);
    }
  }, [params?.lang]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        
        // Build query string with filters
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (category) params.append('category', category);
        if (style) params.append('style', style);
        
        console.log(`Fetching gallery images with params: ${params.toString()}`);
        const response = await fetch(`/api/gallery?${params.toString()}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error ${response.status}:`, errorText);
          throw new Error(`Failed to fetch gallery images: ${response.status} - ${errorText || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log(`Received ${data.images?.length || 0} images from API`);
        setImages(data.images || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page, limit, category, style]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (filterType: 'category' | 'style', value: string | undefined) => {
    if (filterType === 'category') {
      setCategory(value);
    } else {
      setStyle(value);
    }
    setPage(1); // Reset to page 1 when filters change
  };

  if (loading && images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title={<TranslatedText translationKey="gallery.title" fallback="Coloring Page Gallery" lang={currentLang} />}
          description={<TranslatedText translationKey="gallery.subtitle" fallback="Browse our collection of AI-generated coloring pages." lang={currentLang} />}
        />
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">
              <TranslatedText translationKey="common.loading" fallback="Loading coloring pages..." lang={currentLang} />
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title={<TranslatedText translationKey="gallery.title" fallback="Coloring Page Gallery" lang={currentLang} />}
          description={<TranslatedText translationKey="gallery.subtitle" fallback="Browse our collection of AI-generated coloring pages." lang={currentLang} />}
        />
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              <TranslatedText translationKey="gallery.errors.title" fallback="Unable to Load Gallery" lang={currentLang} />
            </h2>
            <p className="text-gray-600 mb-6">
              <TranslatedText translationKey="gallery.errors.message" fallback="We encountered an issue retrieving our coloring pages collection. Please try again later." lang={currentLang} />
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <TranslatedText translationKey="gallery.refreshButton" fallback="Refresh Page" lang={currentLang} />
              </button>
              <Link 
                href="/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <TranslatedText translationKey="gallery.createButton" fallback="Create a Coloring Page" lang={currentLang} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={<TranslatedText translationKey="gallery.title" fallback="Coloring Page Gallery" lang={currentLang} />}
        description={<TranslatedText translationKey="gallery.subtitle" fallback="Browse our collection of AI-generated coloring pages." lang={currentLang} />}
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Introduction Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <TranslatedText translationKey="gallery.introText" fallback="Browse our collection of AI-generated coloring pages. Click on any image to view, print or download." lang={currentLang} />
              </p>
            </div>
          </div>
        </div>

        {/* Create Your Own Button */}
        <div className="mb-8 text-center">
          <Link 
            href="/create" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md"
          >
            <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <TranslatedText translationKey="gallery.createYourOwnButton" fallback="Create Your Own Coloring Page" lang={currentLang} />
          </Link>
          <p className="mt-2 text-sm text-gray-500">
            <TranslatedText translationKey="gallery.createPrompt" fallback="Don't see what you're looking for? Create your own personalized coloring page!" lang={currentLang} />
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            <TranslatedText translationKey="gallery.filters.title" fallback="Find the Perfect Coloring Page" lang={currentLang} />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText translationKey="gallery.filters.category" fallback="Category:" lang={currentLang} />
              </label>
              <select
                id="category-filter"
                value={category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value=""><TranslatedText translationKey="gallery.filters.allCategories" fallback="All Categories" lang={currentLang} /></option>
                <option value="animals"><TranslatedText translationKey="create.categories.animals" fallback="Animals" lang={currentLang} /></option>
                <option value="fantasy"><TranslatedText translationKey="create.categories.fantasy" fallback="Fantasy" lang={currentLang} /></option>
                <option value="nature"><TranslatedText translationKey="create.categories.nature" fallback="Nature" lang={currentLang} /></option>
                <option value="holidays"><TranslatedText translationKey="create.categories.holidays" fallback="Holidays" lang={currentLang} /></option>
                <option value="characters"><TranslatedText translationKey="create.categories.characters" fallback="Characters" lang={currentLang} /></option>
              </select>
            </div>
            
            <div>
              <label htmlFor="style-filter" className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText translationKey="gallery.filters.style" fallback="Style:" lang={currentLang} />
              </label>
              <select
                id="style-filter"
                value={style || ''}
                onChange={(e) => handleFilterChange('style', e.target.value || undefined)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value=""><TranslatedText translationKey="gallery.filters.allStyles" fallback="All Styles" lang={currentLang} /></option>
                <option value="cartoon"><TranslatedText translationKey="create.styleOptions.cartoon" fallback="Cartoon" lang={currentLang} /></option>
                <option value="realistic"><TranslatedText translationKey="create.styleOptions.realistic" fallback="Realistic" lang={currentLang} /></option>
                <option value="manga"><TranslatedText translationKey="gallery.styles.manga" fallback="Manga" lang={currentLang} /></option>
                <option value="abstract"><TranslatedText translationKey="gallery.styles.abstract" fallback="Abstract" lang={currentLang} /></option>
              </select>
            </div>
          </div>
          
          {(category || style) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <TranslatedText 
                  translationKey="gallery.filters.activeFilters" 
                  fallback="Active filters:" 
                  lang={currentLang} 
                />
                {category && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {category}
                  </span>
                )}
                {style && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {style}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setCategory(undefined);
                  setStyle(undefined);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <TranslatedText translationKey="gallery.filters.clearFilters" fallback="Clear Filters" lang={currentLang} />
                <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {images.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              <TranslatedText translationKey="gallery.noImages.title" fallback="No Coloring Pages Found" lang={currentLang} />
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              <TranslatedText translationKey="gallery.noImages.message" fallback="We couldn't find any coloring pages matching your current filters. Try different filters or create your own!" lang={currentLang} />
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  setCategory(undefined);
                  setStyle(undefined);
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <TranslatedText translationKey="gallery.filters.clearFilters" fallback="Clear Filters" lang={currentLang} />
              </button>
              
              <Link
                href="/create"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <TranslatedText translationKey="gallery.createYourOwn" fallback="Create Your Own" lang={currentLang} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {category || style ? (
                <TranslatedText translationKey="gallery.filteredResults" fallback="Filtered Results" lang={currentLang} />
              ) : (
                <TranslatedText translationKey="gallery.allColoringPages" fallback="All Coloring Pages" lang={currentLang} />
              )}
              <span className="text-sm font-normal text-gray-500 ml-2">({images.length} pages)</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <Link 
                  key={image.id} 
                  href={`/gallery/${image.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
                    <div className="relative aspect-square w-full bg-gray-100">
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || image.prompt}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {image.title || truncatePrompt(image.prompt)}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {new Date(image.created_at).toLocaleDateString()}
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {image.style || 'Standard'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500 flex items-center">
                        <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <TranslatedText translationKey="gallery.clickToView" fallback="Click to view" lang={currentLang} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    <TranslatedText
                      translationKey="gallery.pagination.showing"
                      fallback="Showing"
                      lang={currentLang}
                    />{' '}
                    <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
                    <TranslatedText translationKey="gallery.pagination.to" fallback="to" lang={currentLang} />{' '}
                    <span className="font-medium">{Math.min(page * limit, (page - 1) * limit + images.length)}</span>{' '}
                    <TranslatedText translationKey="gallery.pagination.of" fallback="of" lang={currentLang} />{' '}
                    <span className="font-medium">{images.length}</span>{' '}
                    <TranslatedText translationKey="gallery.pagination.results" fallback="results" lang={currentLang} />
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}`}
                    >
                      <span className="sr-only"><TranslatedText translationKey="gallery.pagination.previous" fallback="Previous" lang={currentLang} /></span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Show page numbers or a subset for large collections */}
                    <button
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600"
                    >
                      {page}
                    </button>
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={images.length < limit}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${images.length < limit ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}`}
                    >
                      <span className="sr-only"><TranslatedText translationKey="gallery.pagination.next" fallback="Next" lang={currentLang} /></span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 