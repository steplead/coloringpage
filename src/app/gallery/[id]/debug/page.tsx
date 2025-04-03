import React from 'react';
import { notFound } from 'next/navigation';
import { getImageById } from '@/lib/supabase';

export default async function GalleryDebugPage({ params }: { params: { id: string } }) {
  const image = await getImageById(params.id);
  
  if (!image) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Image Debug Information</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Image URL</h2>
          <p className="font-mono text-xs break-all bg-gray-100 p-4 rounded overflow-auto">{image.image_url}</p>
          <div className="mt-4">
            <a 
              href={image.image_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Open Image Directly
            </a>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Image Metadata</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{image.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(image.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{image.title || '(No title)'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Style</dt>
              <dd className="mt-1 text-sm text-gray-900">{image.style || '(No style)'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Is Public</dt>
              <dd className="mt-1 text-sm text-gray-900">{image.is_public ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{image.user_id || '(No user)'}</dd>
            </div>
          </dl>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Prompt</h2>
          <p className="font-mono text-sm bg-gray-100 p-4 rounded overflow-auto">{image.prompt}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Raw Data</h2>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(image, null, 2)}</pre>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Image Test</h2>
          <p className="text-sm text-gray-600 mb-2">Testing image loading with different methods:</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-1">Standard IMG Tag</h3>
              <img 
                src={image.image_url} 
                alt="Test with standard img tag" 
                className="max-w-full h-auto border border-gray-300 rounded"
                style={{ maxHeight: '200px' }} 
              />
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-1">IMG Tag with CORS Attributes</h3>
              <img 
                src={image.image_url} 
                alt="Test with CORS attributes" 
                crossOrigin="anonymous"
                className="max-w-full h-auto border border-gray-300 rounded"
                style={{ maxHeight: '200px' }} 
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex space-x-4">
          <a 
            href={`/gallery/${params.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Gallery Item
          </a>
          <a 
            href="/gallery"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Gallery
          </a>
        </div>
      </div>
    </div>
  );
} 