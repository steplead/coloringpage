'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { getImageById, getRelatedImages, ImageRecord } from '@/lib/supabase';

export const revalidate = 3600; // Revalidate this page every hour

// Generate dynamic metadata for SEO
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const image = await getImageById(params.id);
  
  if (!image) {
    return {
      title: 'Coloring Page Not Found',
      description: 'The requested coloring page was not found. Explore our gallery to find beautiful coloring pages.',
    };
  }
  
  return {
    title: image.title || `${image.prompt.substring(0, 50)} Coloring Page`,
    description: image.seo_description || `Free printable coloring page featuring ${image.prompt.substring(0, 100)}. Perfect for children and adults who enjoy coloring activities.`,
    openGraph: {
      title: image.title || `${image.prompt.substring(0, 50)} Coloring Page`,
      description: image.seo_description || `Free printable coloring page featuring ${image.prompt.substring(0, 100)}`,
      images: [image.image_url],
      type: 'article',
    },
    keywords: image.keywords || ['coloring page', 'printable', 'free coloring', image.style || 'standard'],
    alternates: {
      canonical: `https://ai-coloringpage.com/gallery/${params.id}`,
    },
  };
}

interface ColoringPageDetailProps {
  params: { 
    id: string 
  };
}

export default function ColoringPageDetail({ params }: ColoringPageDetailProps) {
  const [image, setImage] = useState<ImageRecord | null>(null);
  const [relatedImages, setRelatedImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching image details for ID: ${params.id}`);
        
        // Fetch the main image
        const response = await fetch(`/api/gallery/${params.id}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error ${response.status}:`, errorText);
          
          if (response.status === 404) {
            console.log('Image not found, redirecting to not-found page');
            router.push('/gallery/not-found');
            return;
          }
          throw new Error(`Failed to fetch image details: ${response.status} - ${errorText || 'No error details'}`);
        }
        
        const data = await response.json();
        console.log('Received image data:', data);
        
        if (!data.image) {
          throw new Error('Invalid API response: missing image data');
        }
        
        setImage(data.image);
        
        // Fetch related images
        console.log(`Fetching related images for ID: ${params.id}`);
        const relatedResponse = await fetch(`/api/gallery/${params.id}/related`);
        
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          console.log(`Found ${relatedData.images?.length || 0} related images`);
          setRelatedImages(relatedData.images || []);
        } else {
          console.warn(`Failed to fetch related images: ${relatedResponse.status}`);
          // Don't throw here - we can still show the main image without related images
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching image details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image details');
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Loading Coloring Page"
          description="Please wait while we load your coloring page..."
        />
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading coloring page details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Coloring Page Details"
          description="View and print this AI-generated coloring page."
        />
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Unable to Load Coloring Page</h2>
            <p className="text-gray-600 mb-6">We encountered an issue retrieving this coloring page. The image may have been removed or there's a temporary issue with our database.</p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/gallery" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Gallery
              </Link>
              <Link 
                href="/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create a Coloring Page
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
        title={image.title || image.prompt.substring(0, 50)}
        description={image.seo_description || image.prompt}
      />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative aspect-square w-full mb-6">
              <Image
                src={image.image_url}
                alt={image.alt_text || image.prompt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
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
            
            <div className="flex justify-between items-center">
              <Link 
                href={`/gallery/${params.id}/print`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Print This Page
              </Link>
              
              <Link 
                href="/create"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Your Own
              </Link>
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {image.title || image.prompt}
            </h1>
            
            {image.caption && (
              <p className="text-gray-600 mb-6">
                {image.caption}
              </p>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Style</dt>
                  <dd className="mt-1 text-sm text-gray-900">{image.style || 'Standard'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(image.created_at).toLocaleDateString()}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{image.prompt}</dd>
                </div>
              </dl>
            </div>
            
            {image.keywords && image.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {image.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">About This Coloring Page</h2>
              <p className="text-gray-600 mb-4">
                This coloring page was generated with AI based on the prompt: <span className="font-medium">{image.prompt}</span>
              </p>
              <p className="text-gray-600">
                You can print this page by clicking the "Print This Page" button, which will open a printer-friendly version.
              </p>
            </div>
          </div>
        </div>
        
        {relatedImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Coloring Pages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedImages.map((relatedImage) => (
                <Link 
                  key={relatedImage.id} 
                  href={`/gallery/${relatedImage.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedImage.image_url}
                        alt={relatedImage.alt_text || relatedImage.prompt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        onError={(e) => {
                          console.error('Error loading related image:', relatedImage.image_url);
                          if (e.target instanceof HTMLImageElement) {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.svg';
                          }
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {relatedImage.title || relatedImage.prompt.substring(0, 50)}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 