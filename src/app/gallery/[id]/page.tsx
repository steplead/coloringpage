import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

export default async function ColoringPageDetail({ params }: { params: { id: string } }) {
  const image = await getImageById(params.id);
  
  if (!image) {
    notFound();
  }
  
  const relatedImages = await getRelatedImages(params.id);

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