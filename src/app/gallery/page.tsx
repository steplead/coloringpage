'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ImageRecord } from '@/lib/supabase';
import TranslatedText from '@/components/TranslatedText';
import Cookies from 'js-cookie';

export default function GalleryPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [style, setStyle] = useState<string | undefined>(undefined);
  const [currentLang, setCurrentLang] = useState('en');
  
  // Get language from cookie on client side
  useEffect(() => {
    const lang = Cookies.get('NEXT_LOCALE') || 'en';
    setCurrentLang(lang);
  }, []);

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

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mr-2">
              <TranslatedText translationKey="gallery.filters.category" fallback="Category:" lang={currentLang} />
            </label>
            <select
              id="category-filter"
              value={category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
            <label htmlFor="style-filter" className="block text-sm font-medium text-gray-700 mr-2">
              <TranslatedText translationKey="gallery.filters.style" fallback="Style:" lang={currentLang} />
            </label>
            <select
              id="style-filter"
              value={style || ''}
              onChange={(e) => handleFilterChange('style', e.target.value || undefined)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value=""><TranslatedText translationKey="gallery.filters.allStyles" fallback="All Styles" lang={currentLang} /></option>
              <option value="cartoon"><TranslatedText translationKey="create.styleOptions.cartoon" fallback="Cartoon" lang={currentLang} /></option>
              <option value="realistic"><TranslatedText translationKey="create.styleOptions.realistic" fallback="Realistic" lang={currentLang} /></option>
              <option value="manga"><TranslatedText translationKey="gallery.styles.manga" fallback="Manga" lang={currentLang} /></option>
              <option value="abstract"><TranslatedText translationKey="gallery.styles.abstract" fallback="Abstract" lang={currentLang} /></option>
            </select>
          </div>
          
          {(category || style) && (
            <button
              onClick={() => {
                setCategory(undefined);
                setStyle(undefined);
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <TranslatedText translationKey="gallery.filters.clearFilters" fallback="Clear Filters" lang={currentLang} />
              <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {images.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              <TranslatedText translationKey="gallery.noImages.title" fallback="No Coloring Pages Found" lang={currentLang} />
            </h2>
            <p className="text-gray-600 mb-6">
              <TranslatedText translationKey="gallery.noImages.message" fallback="We couldn't find any coloring pages matching your current filters." lang={currentLang} />
            </p>
            <button
              onClick={() => {
                setCategory(undefined);
                setStyle(undefined);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <TranslatedText translationKey="gallery.filters.clearFilters" fallback="Clear Filters" lang={currentLang} />
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <Link 
                  key={image.id} 
                  href={`/gallery/${image.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || image.prompt}
                        fill
                        className="object-cover"
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
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {image.title || image.prompt.substring(0, 50)}
                      </h3>
                      {image.style && (
                        <p className="mt-1 text-xs text-gray-500">{image.style}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">
                    <TranslatedText translationKey="gallery.pagination.previous" fallback="Previous" lang={currentLang} />
                  </span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">
                    <TranslatedText translationKey="gallery.pagination.next" fallback="Next" lang={currentLang} />
                  </span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 