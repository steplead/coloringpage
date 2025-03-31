import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coloring Page Gallery - AI Coloring Page Generator',
  description: 'Browse our collection of AI-generated black outline coloring pages',
};

export default function GalleryPage() {
  // 示例画廊项目
  const galleryItems = [
    { id: 1, title: 'Magic Castle', category: 'Fantasy' },
    { id: 2, title: 'Friendly Dragon', category: 'Fantasy' },
    { id: 3, title: 'Underwater Adventure', category: 'Nature' },
    { id: 4, title: 'Forest Animals', category: 'Animals' },
    { id: 5, title: 'Space Explorer', category: 'Space' },
    { id: 6, title: 'Dinosaur World', category: 'Prehistoric' },
    { id: 7, title: 'Fairy Garden', category: 'Fantasy' },
    { id: 8, title: 'Jungle Safari', category: 'Animals' },
    { id: 9, title: 'Medieval Knight', category: 'Historical' },
  ];

  // 分类列表
  const categories = ['All', 'Fantasy', 'Nature', 'Animals', 'Space', 'Prehistoric', 'Historical'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Coloring Page Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our collection of AI-generated coloring pages or create your own custom design.
          </p>
        </div>

        {/* 分类导航 */}
        <div className="mb-10 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 画廊网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative bg-gray-50 p-4">
                <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-lg">
                  <h3 className="text-lg text-gray-500 font-medium">{item.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 创建自定义页面的CTA */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Want to create your own coloring page?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use our AI-powered tool to generate a custom coloring page based on your description.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Create Custom Coloring Page
            <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 