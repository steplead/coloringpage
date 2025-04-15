'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { getImageById, getRelatedImages, ImageRecord } from '@/lib/supabase';
import { ArrowLeftIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold leading-tight text-gray-500 animate-pulse">Loading Coloring Page...</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{loadingTranslations ? 'Loading interface...' : 'Loading image data...'}</p>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title={<h1>{t('gallery.detail.error.title', "Error Loading Coloring Page")}</h1>}
          description={t('gallery.detail.error.description', "We couldn't find the coloring page you're looking for.")}
        />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              {t('gallery.detail.error.message', "Coloring Page Not Found")}
            </h2>
            <p className="text-gray-600 mb-6">
              {error || t('gallery.detail.error.notFound', "The coloring page you requested could not be found or is no longer available.")}
            </p>
            <div className="flex justify-center space-x-4">
              <Link href={getLocalizedHref('/gallery')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                {t('gallery.backToGallery', "Back to Gallery")}
              </Link>
              <Link href={getLocalizedHref('/create')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {t('gallery.createAColoringPage', "Create a Coloring Page")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pageTitle = image.title || image.prompt.substring(0, 60);
  const imageAltText = image.alt_text || image.title || t('gallery.detail.imageAltFallback', `AI coloring page: ${image.prompt.substring(0, 50)}`);
  const dateCreated = image.created_at ? new Date(image.created_at).toLocaleDateString(lang) : '';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/${lang}/gallery/${params.id}`;
  const shareTitle = t('gallery.detail.shareTitle', `Check out this coloring page: ${pageTitle}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={<h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">{pageTitle}</h1>}
        description={t('gallery.detail.pageDescription', `AI-generated coloring page. Created on ${dateCreated}`)}
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href={getLocalizedHref('/')} className="text-gray-500 hover:text-gray-700">
                {t('nav.home', "Home")}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              <Link href={getLocalizedHref('/gallery')} className="ml-2 text-gray-500 hover:text-gray-700">
                {t('nav.gallery', "Gallery")}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              <span className="ml-2 text-gray-500 font-medium truncate max-w-xs" aria-current="page">
                {pageTitle.length > 40 ? pageTitle.substring(0, 40) + '...' : pageTitle}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section aria-labelledby="coloring-image-heading" className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h2 id="coloring-image-heading" className="sr-only">Coloring Image and Actions</h2>
              <div className="relative aspect-square w-full mb-6 bg-white border rounded-md overflow-hidden">
                <Image
                  src={image.image_url}
                  alt={imageAltText}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  unoptimized={true}
                  onError={(e) => {
                    console.error('Error loading image:', image.image_url);
                    if (e.target instanceof HTMLImageElement) {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.svg';
                    }
                  }}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {t('gallery.detail.downloadOptions', "Download & Print")}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={handleDownload} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                    {t('gallery.detail.downloadButton', "Download PNG")}
                  </button>
                  {image?.image_url && (
                    <PDFDownload 
                      imageUrl={image.image_url} 
                      title={pageTitle}
                    />
                  )}
                  <Link href={getLocalizedHref(`/gallery/${params.id}/print`)} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PrinterIcon className="mr-2 h-4 w-4" />
                    {t('gallery.detail.printButton', "Print This Page")}
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0"><svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      {t('gallery.detail.printingTips', "Printing Tips")}
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {t('gallery.detail.printInstructions', "For best results, click the Print button above and select 'Fit to Page' or adjust scale in your printer settings.")}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {t('gallery.detail.share', "Share this Page")}
                </h3>
                <SocialShareButtons 
                  url={shareUrl} 
                  title={shareTitle} 
                  imageUrl={image.image_url}
                />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <section aria-labelledby="details-heading" className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 id="details-heading" className="text-xl font-semibold text-gray-800 mb-4">
                {t('gallery.detail.detailsTitle', "Image Details")}
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">{t('gallery.detail.createdDate', "Created:")}</dt>
                  <dd className="text-gray-900">{dateCreated}</dd>
                </div>
                {image.style && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">{t('gallery.detail.style', "Style:")}</dt>
                    <dd className="text-gray-900 capitalize">{image.style}</dd>
                  </div>
                )}
                 {image.category && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">{t('gallery.detail.category', "Category:")}</dt>
                    <dd className="text-gray-900 capitalize">{image.category}</dd>
                  </div>
                )}
                {image.prompt && (
                  <div>
                    <dt className="text-gray-500 mb-1">{t('gallery.detail.prompt', "Original Prompt:")}</dt>
                    <dd className="text-gray-700 bg-gray-50 p-3 rounded text-xs break-words">{image.prompt}</dd>
                  </div>
                )}
              </dl>
            </section>

            {relatedImages.length > 0 && (
              <section aria-labelledby="related-heading" className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 id="related-heading" className="text-xl font-semibold text-gray-800 mb-4">
                  {t('gallery.detail.relatedTitle', "Related Coloring Pages")}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {relatedImages.map((related) => {
                    const relatedAlt = related.title || related.prompt?.substring(0, 40) || 'Related coloring page';
                    return (
                      <Link key={related.id} href={getLocalizedHref(`/gallery/${related.id}`)} className="group block border rounded-md overflow-hidden hover:shadow-sm">
                        <div className="relative aspect-square w-full bg-gray-100">
                          <Image 
                            src={related.image_url} 
                            alt={relatedAlt}
                            fill 
                            className="object-cover group-hover:opacity-80 transition-opacity"
                            sizes="(max-width: 768px) 50vw, 15vw"
                            loading="lazy"
                            unoptimized={true}
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            <section aria-labelledby="create-cta-heading" className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <h2 id="create-cta-heading" className="text-lg font-semibold text-gray-800 mb-3">
                {t('gallery.detail.createCta.title', "Want something different?")}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {t('gallery.detail.createCta.text', "Generate your own unique coloring page now!")}
              </p>
              <Link href={getLocalizedHref('/create')} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
                {t('gallery.detail.createCta.button', "Create New Page")}
              </Link>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
} 