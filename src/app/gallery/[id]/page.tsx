'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { getImageById, getRelatedImages, ImageRecord } from '@/lib/supabase';
import TranslatedText from '@/components/TranslatedText';
import { ArrowLeftIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import SocialShareButtons from '@/components/SocialShareButtons';
import PDFDownload from '@/components/PDFDownload';

interface ColoringPageDetailProps {
  params: { 
    id: string;
    lang?: string;
  };
}

export default function ColoringPageDetail({ params }: ColoringPageDetailProps) {
  const [image, setImage] = useState<ImageRecord | null>(null);
  const [relatedImages, setRelatedImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadImageData() {
      setLoading(true);
      try {
        const imageData = await getImageById(params.id);
        if (imageData) {
          setImage(imageData);
          const related = await getRelatedImages(params.id);
          setRelatedImages(related);
        } else {
          console.log('Image not found, redirecting to not-found page');
          router.push('/gallery/not-found');
          return;
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching image details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image details');
      } finally {
        setLoading(false);
      }
    }

    loadImageData();
  }, [params.id, router]);

  const handleDownload = async () => {
    if (!image?.image_url) return;
    
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `coloring-page-${params.id}.png`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading image:', err);
      alert('Failed to download image. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title={<TranslatedText path="gallery.detail.loading.title" fallback="Loading Coloring Page" />}
          description={<TranslatedText path="gallery.detail.loading.description" fallback="Please wait while we retrieve the coloring page details..." />}
        />
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">
              <TranslatedText path="common.loading" fallback="Loading..." />
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title={<TranslatedText path="gallery.detail.error.title" fallback="Error Loading Coloring Page" />}
          description={<TranslatedText path="gallery.detail.error.description" fallback="We couldn't find the coloring page you're looking for." />}
        />
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              <TranslatedText path="gallery.detail.error.message" fallback="Coloring Page Not Found" />
            </h2>
            <p className="text-gray-600 mb-6">
              {error || <TranslatedText path="gallery.detail.error.notFound" fallback="The coloring page you requested could not be found or is no longer available." />}
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/gallery" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                <TranslatedText path="gallery.backToGallery" fallback="Back to Gallery" />
              </Link>
              <Link 
                href="/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <TranslatedText path="gallery.createAColoringPage" fallback="Create a Coloring Page" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const title = image.title || image.prompt.substring(0, 50);
  const description = image.alt_text || image.prompt;
  const dateCreated = image.created_at ? new Date(image.created_at).toLocaleDateString() : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={title}
        description={description}
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <TranslatedText path="nav.home" fallback="Home" />
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/gallery" className="ml-2 text-gray-500 hover:text-gray-700">
                <TranslatedText path="nav.gallery" fallback="Gallery" />
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-500 font-medium truncate max-w-xs">
                {title.length > 30 ? title.substring(0, 30) + '...' : title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content - Left Side (Image) */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="relative aspect-square w-full mb-6 bg-white">
                <Image
                  src={image.image_url}
                  alt={description}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  unoptimized={true}
                  onError={(e) => {
                    // Handle image loading error by showing a placeholder
                    console.error('Error loading image:', image.image_url);
                    if (e.target instanceof HTMLImageElement) {
                      e.target.onerror = null; // Prevent infinite fallback loop
                      e.target.src = '/placeholder-image.svg'; // Fallback to a placeholder image
                    }
                  }}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  <TranslatedText path="gallery.detail.downloadOptions" fallback="Download Options" />
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                    <TranslatedText path="gallery.detail.downloadButton" fallback="Download PNG" />
                  </button>
                  
                  {image?.image_url && (
                    <PDFDownload 
                      imageUrl={image.image_url} 
                      title={title}
                    />
                  )}
                  
                  <Link 
                    href="/gallery/[id]/print"
                    as={`/gallery/${params.id}/print`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PrinterIcon className="mr-2 h-4 w-4" />
                    <TranslatedText path="gallery.detail.printButton" fallback="Print This Page" />
                  </Link>
                </div>
              </div>

              {/* Printing Tips Box */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      <TranslatedText path="gallery.detail.printingTips" fallback="Printing Tips" />
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      <TranslatedText path="gallery.detail.printInstructions" fallback="For best results, click the Print button above and select 'Fit to Page' in your printer settings." />
                    </p>
                  </div>
                </div>
              </div>

              {/* Social sharing buttons */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <TranslatedText path="gallery.detail.shareTitle" fallback="Share with friends and family" />
                </h3>
                {image && (
                  <SocialShareButtons 
                    url={typeof window !== 'undefined' ? window.location.href : `https://ai-coloringpage.com/gallery/${params.id}`}
                    title={title}
                    imageUrl={image.image_url}
                    description={description}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Right Side - Coloring Page Details */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <TranslatedText path="gallery.detail.aboutThisPage" fallback="About This Coloring Page" />
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    <TranslatedText path="gallery.detail.description" fallback="Description" />
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">{description}</p>
                </div>
                
                {image.style && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      <TranslatedText path="gallery.detail.style" fallback="Style" />
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {image.style.charAt(0).toUpperCase() + image.style.slice(1)}
                    </p>
                  </div>
                )}
                
                {image.category && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      <TranslatedText path="gallery.detail.category" fallback="Category" />
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    <TranslatedText path="gallery.detail.created" fallback="Created On" />
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">{dateCreated}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    <TranslatedText path="gallery.detail.suitableFor" fallback="Best For" />
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {image.style === 'simple' ? 
                      <TranslatedText path="gallery.detail.suitableForYoungChildren" fallback="Young children (ages 2-5)" /> :
                     image.style === 'complex' ?
                      <TranslatedText path="gallery.detail.suitableForOlderChildren" fallback="Older children and adults" /> :
                      <TranslatedText path="gallery.detail.suitableForAllAges" fallback="All ages" />
                    }
                  </p>
                </div>
              </div>

              {/* Call to action */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link 
                  href="/create"
                  className="block w-full bg-blue-600 py-3 px-4 rounded-md shadow-sm text-white text-center font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <TranslatedText path="gallery.detail.createYourOwnButton" fallback="Create Your Own Coloring Page" />
                </Link>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  <TranslatedText path="gallery.detail.createYourOwnPrompt" fallback="It's free and takes just seconds!" />
                </p>
              </div>
            </div>
            
            {/* Coloring Tips Box */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                <TranslatedText path="gallery.detail.coloringTips" fallback="Coloring Tips" />
              </h2>
              
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <svg className="h-4 w-4 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <TranslatedText path="gallery.detail.tip1" fallback="Print on thicker paper for best results with markers or paints" />
                </li>
                <li className="flex items-start">
                  <svg className="h-4 w-4 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <TranslatedText path="gallery.detail.tip2" fallback="Color lightest areas first, then work towards darker areas" />
                </li>
                <li className="flex items-start">
                  <svg className="h-4 w-4 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <TranslatedText path="gallery.detail.tip3" fallback="Try using complementary colors for a vibrant effect" />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Coloring Pages */}
        {relatedImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <TranslatedText path="gallery.detail.similarPages" fallback="You Might Also Like" />
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedImages.slice(0, 4).map((relatedImage) => (
                <Link 
                  key={relatedImage.id} 
                  href={`/gallery/${relatedImage.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
                    <div className="relative aspect-square w-full bg-gray-100">
                      <Image
                        src={relatedImage.image_url}
                        alt={relatedImage.alt_text || relatedImage.prompt}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized={true}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {relatedImage.title || relatedImage.prompt.substring(0, 50)}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/gallery"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <TranslatedText path="gallery.viewMore" fallback="Browse More Coloring Pages" />
                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 