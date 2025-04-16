'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getImageById, getRelatedImages, ImageRecord } from '@/lib/supabase';
import { ArrowLeftIcon, ArrowDownTrayIcon, PrinterIcon, ShareIcon } from '@heroicons/react/24/outline';
import SocialShareButtons from '@/components/SocialShareButtons';
import PDFDownload from '@/components/PDFDownload';
import { useTranslation } from '@/lib/i18n/context';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';

interface ColoringPageDetailProps {
  params: { 
    id: string;
    lang?: string;
  };
}

export default function ColoringPageDetail({ params }: ColoringPageDetailProps) {
  const { locale: lang } = useTranslation();
  const [image, setImage] = useState<ImageRecord | null>(null);
  const [relatedImages, setRelatedImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTranslations, setLoadingTranslations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translations, setTranslations] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTranslations = async () => {
      if (!lang) return;
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
    loadTranslations();
  }, [lang]);

  useEffect(() => {
    async function loadImageData() {
      setLoading(true);
      setError(null);
      try {
        const imageData = await getImageById(params.id);
        if (imageData) {
          setImage(imageData);
          const related = await getRelatedImages(params.id, 4);
          setRelatedImages(related);
        } else {
          console.log('Image not found, redirecting...');
          router.push(lang ? `/${lang}/gallery/not-found` : '/en/gallery/not-found');
          return;
        }
      } catch (err) {
        console.error('Error fetching image details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image details');
      } finally {
        setLoading(false);
      }
    }
    loadImageData();
  }, [params.id, router, lang]);

  const handleDownload = useCallback(async () => {
    if (!image?.image_url) return;
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const safeTitle = (image.title || image.prompt || 'coloring-page')
          .replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `${safeTitle.substring(0, 30)}-${params.id.substring(0, 8)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading image:', err);
      alert(t('gallery.detail.downloadError', 'Failed to download image. Please try again later.'));
    }
  }, [image, params.id]);

  const getLocalizedHref = useCallback((path: string): string => {
    return `/${lang}${path}`;
  }, [lang]);

  const t = useCallback((key: string, fallback?: string): string => {
    if (loadingTranslations || !translations) {
      return fallback || key.split('.').pop() || key;
    }
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  }, [translations, loadingTranslations]);

  if (loadingTranslations || loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-md animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="flex space-x-4 pt-4">
                <div className="h-10 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg border border-gray-200">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              {t('gallery.detail.error.message', "Coloring Page Not Found")}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error || t('gallery.detail.error.notFound', "The requested page couldn't be found or is unavailable.")}
            </p>
          </div>
          <div className="flex justify-center space-x-4">
             <Link 
              href={getLocalizedHref('/gallery')}
              className="inline-flex items-center px-5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
               {t('gallery.backToGallery', "Back to Gallery")}
            </Link>
             <Link 
              href={getLocalizedHref('/create')}
              className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
               {t('gallery.createAColoringPage', "Create New Page")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pageTitle = image.title || image.prompt || t('gallery.detail.defaultTitle', 'Coloring Page');
  const imageAltText = image.alt_text || image.title || t('gallery.detail.imageAltFallback', `AI coloring page: ${image.prompt?.substring(0, 50)}`);
  const dateCreated = image.created_at ? new Date(image.created_at).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/${lang}/gallery/${params.id}`;
  const shareTitle = t('gallery.detail.shareTitle', `Check out this coloring page: ${pageTitle}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href={getLocalizedHref('/')} className="text-gray-500 hover:text-indigo-600 transition-colors">
                <svg className="h-5 w-5 flex-shrink-0 mr-1 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                {t('nav.home', "Home")}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              <Link href={getLocalizedHref('/gallery')} className="ml-2 text-gray-500 hover:text-indigo-600 transition-colors">
                {t('nav.gallery', "Gallery")}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              <span className="ml-2 text-gray-700 font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                {pageTitle.length > 30 ? pageTitle.substring(0, 30) + '...' : pageTitle}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="relative aspect-square w-full bg-gray-100 border border-gray-200 rounded-xl overflow-hidden group">
              <Image
                src={image.image_url}
                alt={imageAltText}
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
                unoptimized={false}
                onError={(e) => {
                  console.error('Error loading image:', image.image_url);
                  if (e.target instanceof HTMLImageElement) {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.svg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-zoom-in">
                  <svg className="w-10 h-10 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{pageTitle}</h1>
              {dateCreated && (
                <p className="text-sm text-gray-500 mb-5">
                  {t('gallery.detail.createdOn', 'Created on')}: {dateCreated}
                </p>
              )}
              
              {image.prompt && (
                 <div className="mb-6">
                   <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                     {t('gallery.detail.promptTitle', 'Original Prompt')}
                   </h3>
                   <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                     {image.prompt}
                   </p>
                 </div>
               )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t('gallery.detail.downloadOptions', "Download & Print")}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleDownload} 
                    className="flex-1 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                    {t('gallery.detail.downloadButton', "Download PNG")}
                  </button>
                  {image?.image_url && (
                    <div className="flex-1">
                      <PDFDownload 
                        imageUrl={image.image_url} 
                        title={pageTitle}
                      />
                    </div>
                  )}
                </div>
                 <Link 
                   href={getLocalizedHref(`/gallery/${params.id}/print`)} 
                   className="w-full inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                 >
                   <PrinterIcon className="-ml-1 mr-2 h-5 w-5" />
                   {t('gallery.detail.printButton', "Print This Page")}
                 </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                 <ShareIcon className="h-5 w-5 mr-2 text-indigo-500"/>
                 {t('gallery.detail.share', "Share this Page")}
              </h3>
              <SocialShareButtons 
                url={shareUrl} 
                title={shareTitle} 
                imageUrl={image.image_url}
              />
            </div>
          </div>
        </div>

        {relatedImages.length > 0 && (
          <section aria-labelledby="related-images-heading" className="mt-16 pt-10 border-t border-gray-200">
            <h2 id="related-images-heading" className="text-2xl font-bold text-gray-800 mb-8">
              {t('gallery.detail.relatedTitle', "You Might Also Like")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
              {relatedImages.map((related) => (
                 <Link 
                   key={related.id} 
                   href={getLocalizedHref(`/gallery/${related.id}`)} 
                   className="block group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                 >
                   <div className="aspect-square relative">
                     <Image
                       src={related.image_url || '/placeholder.png'}
                       alt={related.prompt || t('gallery.imageAltFallback', 'AI Generated Coloring Page')}
                       fill
                       sizes="(max-width: 768px) 50vw, 25vw"
                       className="object-cover transition-transform duration-300 group-hover:scale-105"
                       loading="lazy"
                       onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                     />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                   </div>
                   <div className="p-3 text-center">
                     <p className="text-xs text-gray-500 truncate" title={related.prompt || ''}>
                       {related.prompt ? (related.prompt.length > 40 ? related.prompt.substring(0, 40) + '...' : related.prompt) : ''}
                     </p>
                   </div>
                 </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 