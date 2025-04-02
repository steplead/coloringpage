import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { getImageById, getRelatedImages, ImageRecord } from '@/lib/supabase';

export const revalidate = 3600; // Revalidate this page every hour

export async function generateMetadata({ params }: { params: { id: string } }) {
  const image = await getImageById(params.id);
  
  if (!image) {
    return {
      title: 'Image Not Found',
    };
  }

  return {
    title: `${image.title || 'Coloring Page'} | AI Coloring Page`,
    description: image.prompt,
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
        description={image.prompt}
      />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative aspect-square w-full mb-6">
              <Image
                src={image.image_url}
                alt={image.title || image.prompt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/gallery/${image.id}/print`}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Coloring Page
              </Link>
              <a
                href={image.image_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Image
              </a>
              <button
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('Link copied to clipboard!');
                }}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Image Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="mt-1 text-md text-gray-900">{image.title || 'Untitled'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Style</h3>
                  <p className="mt-1 text-md text-gray-900">{image.style || 'Standard'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Created</h3>
                  <p className="mt-1 text-md text-gray-900">{new Date(image.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Prompt Used</h3>
                  <p className="mt-1 text-md text-gray-900">{image.prompt}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Your Own</h2>
              <p className="text-gray-600 mb-4">
                Inspired by this coloring page? Create your own custom coloring page in just a few seconds!
              </p>
              <Link
                href={`/create?prompt=${encodeURIComponent(image.prompt)}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Creating
              </Link>
            </div>
          </div>
        </div>

        {relatedImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">More Coloring Pages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedImages.map((relatedImage) => (
                <ColoringPagePreview key={relatedImage.id} image={relatedImage} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColoringPagePreview({ image }: { image: ImageRecord }) {
  return (
    <Link 
      href={`/gallery/${image.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full">
        <Image
          src={image.image_url}
          alt={image.title || image.prompt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-md font-medium text-gray-900 truncate">
          {image.title || image.prompt.substring(0, 50)}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{image.style || 'Standard'}</p>
      </div>
    </Link>
  );
} 